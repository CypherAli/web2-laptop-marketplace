const Product = require('../models/Product');
const Order = require('../models/Order');

/**
 * Partner Dashboard Controller
 * Handles partner-specific operations: view their products, revenue analytics
 */

// Get partner's own products
exports.getMyProducts = async (req, res) => {
    try {
        const { page = 1, limit = 10, sortBy = 'createdAt' } = req.query;
        const partnerId = req.user.id;

        const pageNum = Number(page);
        const limitNum = Number(limit);
        const skip = (pageNum - 1) * limitNum;

        const sort = sortBy === 'price' ? { price: -1 } : 
                     sortBy === 'stock' ? { stock: -1 } : 
                     sortBy === 'soldCount' ? { soldCount: -1 } : 
                     { createdAt: -1 };

        const products = await Product.find({ createdBy: partnerId })
            .sort(sort)
            .skip(skip)
            .limit(limitNum);

        const totalProducts = await Product.countDocuments({ createdBy: partnerId });
        const totalPages = Math.ceil(totalProducts / limitNum);

        res.json({
            products,
            currentPage: pageNum,
            totalPages,
            totalProducts
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get partner's product statistics
exports.getMyStats = async (req, res) => {
    try {
        const partnerId = req.user.id;

        // Product statistics
        const totalProducts = await Product.countDocuments({ createdBy: partnerId });
        const activeProducts = await Product.countDocuments({ createdBy: partnerId, isActive: true });
        const outOfStockProducts = await Product.countDocuments({ createdBy: partnerId, stock: 0 });

        // Get total revenue from completed orders containing partner's products
        const orders = await Order.find({ status: { $in: ['delivered', 'processing', 'shipped'] } })
            .populate({
                path: 'items.product',
                select: 'createdBy'
            });

        let totalRevenue = 0;
        let totalSoldItems = 0;
        let todayRevenue = 0;
        let monthRevenue = 0;
        let totalOrders = 0;

        // Get today's start and end
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        // Get this month's start
        const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

        orders.forEach(order => {
            let hasPartnerProduct = false;
            let orderRevenue = 0;

            order.items.forEach(item => {
                // Check if this item's product belongs to the partner
                if (item.product && item.product.createdBy && 
                    item.product.createdBy.toString() === partnerId) {
                    const itemTotal = item.price * item.quantity;
                    totalRevenue += itemTotal;
                    totalSoldItems += item.quantity;
                    orderRevenue += itemTotal;
                    hasPartnerProduct = true;

                    // Calculate today's revenue
                    if (order.createdAt >= today && order.createdAt < tomorrow) {
                        todayRevenue += itemTotal;
                    }

                    // Calculate this month's revenue
                    if (order.createdAt >= monthStart) {
                        monthRevenue += itemTotal;
                    }
                }
            });

            // Count unique orders that contain partner's products
            if (hasPartnerProduct) {
                totalOrders++;
            }
        });

        // Get best selling products
        const bestSellers = await Product.find({ createdBy: partnerId })
            .sort({ soldCount: -1 })
            .limit(5)
            .select('name price soldCount imageUrl stock');

        res.json({
            totalProducts,
            activeProducts,
            outOfStockProducts,
            totalRevenue,
            todayRevenue,
            monthRevenue,
            totalSoldItems,
            totalOrders,
            bestSellers
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get partner's revenue by month (last 6 months)
exports.getRevenueByMonth = async (req, res) => {
    try {
        const partnerId = req.user.id;
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const orders = await Order.find({ 
            status: { $in: ['delivered', 'processing', 'shipped'] },
            createdAt: { $gte: sixMonthsAgo }
        }).populate({
            path: 'items.product',
            select: 'createdBy'
        });

        // Group revenue by month
        const revenueByMonth = {};
        
        orders.forEach(order => {
            const month = order.createdAt.toISOString().slice(0, 7); // YYYY-MM
            
            order.items.forEach(item => {
                if (item.product && item.product.createdBy && 
                    item.product.createdBy.toString() === partnerId) {
                    const itemRevenue = item.price * item.quantity;
                    revenueByMonth[month] = (revenueByMonth[month] || 0) + itemRevenue;
                }
            });
        });

        // Convert to array format
        const revenueArray = Object.keys(revenueByMonth)
            .sort()
            .map(month => ({
                month,
                revenue: revenueByMonth[month]
            }));

        res.json(revenueArray);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Toggle product active status
exports.toggleProductStatus = async (req, res) => {
    try {
        const productId = req.params.id;
        const partnerId = req.user.id;

        const product = await Product.findOne({ _id: productId, createdBy: partnerId });
        
        if (!product) {
            return res.status(404).json({ message: 'Product not found or you do not own this product' });
        }

        product.isActive = !product.isActive;
        await product.save();

        res.json({ 
            message: `Product ${product.isActive ? 'activated' : 'deactivated'} successfully`,
            isActive: product.isActive 
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get partner's revenue by brand (Dell, HP, Lenovo, etc.)
exports.getRevenueByBrand = async (req, res) => {
    try {
        const partnerId = req.user.id;

        // Get all partner's products grouped by brand
        const partnerProducts = await Product.find({ createdBy: partnerId });
        const productIdsByBrand = {};
        
        partnerProducts.forEach(product => {
            if (!productIdsByBrand[product.brand]) {
                productIdsByBrand[product.brand] = [];
            }
            productIdsByBrand[product.brand].push(product._id.toString());
        });

        // Get all completed orders
        const orders = await Order.find({ 
            status: { $in: ['delivered', 'processing', 'shipped'] }
        }).populate('items.product');

        // Calculate revenue by brand
        const revenueByBrand = {};
        const soldCountByBrand = {};

        orders.forEach(order => {
            order.items.forEach(item => {
                if (item.product && item.product.createdBy && 
                    item.product.createdBy.toString() === partnerId) {
                    
                    const brand = item.product.brand;
                    const itemRevenue = item.price * item.quantity;
                    
                    revenueByBrand[brand] = (revenueByBrand[brand] || 0) + itemRevenue;
                    soldCountByBrand[brand] = (soldCountByBrand[brand] || 0) + item.quantity;
                }
            });
        });

        // Convert to array format with additional stats
        const brandStats = Object.keys(revenueByBrand)
            .sort((a, b) => revenueByBrand[b] - revenueByBrand[a]) // Sort by revenue desc
            .map(brand => ({
                brand,
                revenue: revenueByBrand[brand],
                soldCount: soldCountByBrand[brand],
                productCount: productIdsByBrand[brand] ? productIdsByBrand[brand].length : 0
            }));

        res.json(brandStats);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = exports;
