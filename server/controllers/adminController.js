const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');

/**
 * Admin Dashboard Controller
 * Handles admin-specific operations: manage users, view all data, system statistics
 */

// Get all users with pagination
exports.getAllUsers = async (req, res) => {
    try {
        const { page = 1, limit = 20, role, search } = req.query;

        const filter = {};
        if (role) filter.role = role;
        if (search) {
            filter.$or = [
                { username: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }

        const pageNum = Number(page);
        const limitNum = Number(limit);
        const skip = (pageNum - 1) * limitNum;

        const users = await User.find(filter)
            .select('-password')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limitNum);

        const totalUsers = await User.countDocuments(filter);
        const totalPages = Math.ceil(totalUsers / limitNum);

        res.json({
            users,
            currentPage: pageNum,
            totalPages,
            totalUsers
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get user by ID
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update user (role, approval status, etc.)
exports.updateUser = async (req, res) => {
    try {
        const { role, isApproved, shopName, shopDescription } = req.body;
        
        const updateData = {};
        if (role) updateData.role = role;
        if (typeof isApproved !== 'undefined') updateData.isApproved = isApproved;
        if (shopName) updateData.shopName = shopName;
        if (shopDescription) updateData.shopDescription = shopDescription;

        const user = await User.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Delete user
exports.deleteUser = async (req, res) => {
    try {
        // Check if this is the last admin
        const user = await User.findById(req.params.id);
        if (user.role === 'admin') {
            const adminCount = await User.countDocuments({ role: 'admin' });
            if (adminCount <= 1) {
                return res.status(400).json({ message: 'Cannot delete the last admin account' });
            }
        }

        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get system statistics
exports.getSystemStats = async (req, res) => {
    try {
        // User stats
        const totalUsers = await User.countDocuments();
        const totalClients = await User.countDocuments({ role: 'client' });
        const totalPartners = await User.countDocuments({ role: 'partner' });
        const approvedPartners = await User.countDocuments({ role: 'partner', isApproved: true });
        const pendingPartners = await User.countDocuments({ role: 'partner', isApproved: false });

        // Product stats
        const totalProducts = await Product.countDocuments();
        const activeProducts = await Product.countDocuments({ isActive: true });
        const outOfStockProducts = await Product.countDocuments({ stock: 0 });

        // Order stats
        const totalOrders = await Order.countDocuments();
        const pendingOrders = await Order.countDocuments({ status: 'pending' });
        const processingOrders = await Order.countDocuments({ status: 'processing' });
        const deliveredOrders = await Order.countDocuments({ status: 'delivered' });
        const cancelledOrders = await Order.countDocuments({ status: 'cancelled' });

        // Revenue stats
        const completedOrders = await Order.find({ status: { $in: ['delivered', 'processing', 'shipped'] } });
        const totalRevenue = completedOrders.reduce((sum, order) => sum + order.totalAmount, 0);
        const averageOrderValue = completedOrders.length > 0 ? totalRevenue / completedOrders.length : 0;

        // Recent activity
        const recentOrders = await Order.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('user', 'username email')
            .select('user totalAmount status createdAt');

        const recentProducts = await Product.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('createdBy', 'username shopName')
            .select('name price createdBy createdAt');

        res.json({
            users: {
                total: totalUsers,
                clients: totalClients,
                partners: totalPartners,
                approvedPartners,
                pendingPartners
            },
            products: {
                total: totalProducts,
                active: activeProducts,
                outOfStock: outOfStockProducts
            },
            orders: {
                total: totalOrders,
                pending: pendingOrders,
                processing: processingOrders,
                delivered: deliveredOrders,
                cancelled: cancelledOrders
            },
            revenue: {
                total: totalRevenue,
                averageOrderValue: Math.round(averageOrderValue)
            },
            recentActivity: {
                orders: recentOrders,
                products: recentProducts
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get revenue by month (all partners)
exports.getSystemRevenueByMonth = async (req, res) => {
    try {
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const orders = await Order.aggregate([
            {
                $match: {
                    status: { $in: ['delivered', 'processing', 'shipped'] },
                    createdAt: { $gte: sixMonthsAgo }
                }
            },
            {
                $group: {
                    _id: { 
                        year: { $year: '$createdAt' },
                        month: { $month: '$createdAt' }
                    },
                    revenue: { $sum: '$totalAmount' },
                    orderCount: { $sum: 1 }
                }
            },
            {
                $sort: { '_id.year': 1, '_id.month': 1 }
            }
        ]);

        const revenueByMonth = orders.map(item => ({
            month: `${item._id.year}-${String(item._id.month).padStart(2, '0')}`,
            revenue: item.revenue,
            orderCount: item.orderCount
        }));

        res.json(revenueByMonth);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get revenue by partner/shop (Admin view all shops performance)
exports.getRevenueByShop = async (req, res) => {
    try {
        // Get all partners
        const partners = await User.find({ role: 'partner' }).select('_id username shopName email isApproved');

        // Get all completed orders
        const orders = await Order.find({ 
            status: { $in: ['delivered', 'processing', 'shipped'] }
        }).populate('items.product');

        // Calculate revenue by partner
        const revenueByPartner = {};
        const soldCountByPartner = {};
        const orderCountByPartner = {};

        orders.forEach(order => {
            order.items.forEach(item => {
                if (item.product && item.product.createdBy) {
                    const partnerId = item.product.createdBy.toString();
                    const itemRevenue = item.price * item.quantity;
                    
                    revenueByPartner[partnerId] = (revenueByPartner[partnerId] || 0) + itemRevenue;
                    soldCountByPartner[partnerId] = (soldCountByPartner[partnerId] || 0) + item.quantity;
                    orderCountByPartner[partnerId] = (orderCountByPartner[partnerId] || 0) + 1;
                }
            });
        });

        // Get product counts by partner
        const productCountsByPartner = await Product.aggregate([
            {
                $group: {
                    _id: '$createdBy',
                    totalProducts: { $sum: 1 },
                    activeProducts: {
                        $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] }
                    },
                    totalStock: { $sum: '$stock' }
                }
            }
        ]);

        const productStatsMap = {};
        productCountsByPartner.forEach(stat => {
            productStatsMap[stat._id.toString()] = {
                totalProducts: stat.totalProducts,
                activeProducts: stat.activeProducts,
                totalStock: stat.totalStock
            };
        });

        // Combine all stats
        const shopStats = partners.map(partner => {
            const partnerId = partner._id.toString();
            const productStats = productStatsMap[partnerId] || { 
                totalProducts: 0, 
                activeProducts: 0, 
                totalStock: 0 
            };

            return {
                partnerId: partner._id,
                username: partner.username,
                shopName: partner.shopName || 'N/A',
                email: partner.email,
                isApproved: partner.isApproved,
                revenue: revenueByPartner[partnerId] || 0,
                soldCount: soldCountByPartner[partnerId] || 0,
                orderCount: orderCountByPartner[partnerId] || 0,
                totalProducts: productStats.totalProducts,
                activeProducts: productStats.activeProducts,
                totalStock: productStats.totalStock
            };
        }).sort((a, b) => b.revenue - a.revenue); // Sort by revenue desc

        res.json(shopStats);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get specific partner's detailed revenue (Admin viewing one partner)
exports.getPartnerDetailedRevenue = async (req, res) => {
    try {
        const partnerId = req.params.partnerId;

        // Check if partner exists
        const partner = await User.findOne({ _id: partnerId, role: 'partner' })
            .select('username shopName email isApproved');
        
        if (!partner) {
            return res.status(404).json({ message: 'Partner not found' });
        }

        // Get partner's products
        const products = await Product.find({ createdBy: partnerId })
            .select('name brand price stock soldCount isActive');

        // Get orders containing partner's products
        const orders = await Order.find({ 
            status: { $in: ['delivered', 'processing', 'shipped'] }
        }).populate('items.product');

        // Calculate revenue by month
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const revenueByMonth = {};
        const revenueByBrand = {};
        let totalRevenue = 0;
        let totalSoldCount = 0;

        orders.forEach(order => {
            if (order.createdAt >= sixMonthsAgo) {
                const month = order.createdAt.toISOString().slice(0, 7);
                
                order.items.forEach(item => {
                    if (item.product && item.product.createdBy && 
                        item.product.createdBy.toString() === partnerId) {
                        
                        const itemRevenue = item.price * item.quantity;
                        totalRevenue += itemRevenue;
                        totalSoldCount += item.quantity;
                        
                        revenueByMonth[month] = (revenueByMonth[month] || 0) + itemRevenue;
                        
                        const brand = item.product.brand;
                        revenueByBrand[brand] = (revenueByBrand[brand] || 0) + itemRevenue;
                    }
                });
            }
        });

        // Format revenue by month
        const monthlyRevenue = Object.keys(revenueByMonth)
            .sort()
            .map(month => ({
                month,
                revenue: revenueByMonth[month]
            }));

        // Format revenue by brand
        const brandRevenue = Object.keys(revenueByBrand)
            .sort((a, b) => revenueByBrand[b] - revenueByBrand[a])
            .map(brand => ({
                brand,
                revenue: revenueByBrand[brand]
            }));

        // Get best sellers
        const bestSellers = products
            .sort((a, b) => b.soldCount - a.soldCount)
            .slice(0, 10)
            .map(p => ({
                name: p.name,
                brand: p.brand,
                price: p.price,
                soldCount: p.soldCount,
                stock: p.stock,
                isActive: p.isActive
            }));

        res.json({
            partner: {
                id: partner._id,
                username: partner.username,
                shopName: partner.shopName,
                email: partner.email,
                isApproved: partner.isApproved
            },
            summary: {
                totalRevenue,
                totalSoldCount,
                totalProducts: products.length,
                activeProducts: products.filter(p => p.isActive).length
            },
            monthlyRevenue,
            brandRevenue,
            bestSellers
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = exports;
