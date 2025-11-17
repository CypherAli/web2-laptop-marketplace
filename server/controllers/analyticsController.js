const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const Review = require('../models/Review');

// Get dashboard overview statistics
exports.getDashboardStats = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        
        const dateFilter = {};
        if (startDate && endDate) {
            dateFilter.createdAt = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }

        // Total revenue
        const revenueData = await Order.aggregate([
            { 
                $match: { 
                    status: { $in: ['delivered', 'shipped'] },
                    ...dateFilter 
                } 
            },
            { 
                $group: { 
                    _id: null, 
                    total: { $sum: '$totalAmount' },
                    count: { $sum: 1 }
                } 
            }
        ]);

        const revenue = revenueData[0] || { total: 0, count: 0 };

        // Total orders by status
        const ordersByStatus = await Order.aggregate([
            { $match: dateFilter },
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ]);

        // Total products
        const totalProducts = await Product.countDocuments({ isActive: true });
        const outOfStock = await Product.countDocuments({ stock: 0, isActive: true });

        // Total users by role
        const usersByRole = await User.aggregate([
            { $group: { _id: '$role', count: { $sum: 1 } } }
        ]);

        // Total reviews
        const totalReviews = await Review.countDocuments({ isApproved: true });
        const avgRating = await Review.aggregate([
            { $match: { isApproved: true } },
            { $group: { _id: null, average: { $avg: '$rating' } } }
        ]);

        // Low stock products
        const lowStockProducts = await Product.countDocuments({
            stock: { $lte: 5, $gt: 0 },
            isActive: true
        });

        res.json({
            revenue: {
                total: revenue.total,
                orders: revenue.count
            },
            orders: {
                byStatus: ordersByStatus,
                total: ordersByStatus.reduce((sum, item) => sum + item.count, 0)
            },
            products: {
                total: totalProducts,
                outOfStock,
                lowStock: lowStockProducts
            },
            users: {
                byRole: usersByRole,
                total: usersByRole.reduce((sum, item) => sum + item.count, 0)
            },
            reviews: {
                total: totalReviews,
                averageRating: avgRating[0] ? avgRating[0].average.toFixed(2) : 0
            }
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get revenue analytics with time series
exports.getRevenueAnalytics = async (req, res) => {
    try {
        const { period = 'month', startDate, endDate } = req.query;

        let groupBy;
        let dateFormat;

        switch(period) {
            case 'day':
                groupBy = {
                    year: { $year: '$createdAt' },
                    month: { $month: '$createdAt' },
                    day: { $dayOfMonth: '$createdAt' }
                };
                break;
            case 'week':
                groupBy = {
                    year: { $year: '$createdAt' },
                    week: { $week: '$createdAt' }
                };
                break;
            case 'month':
                groupBy = {
                    year: { $year: '$createdAt' },
                    month: { $month: '$createdAt' }
                };
                break;
            case 'year':
                groupBy = {
                    year: { $year: '$createdAt' }
                };
                break;
            default:
                groupBy = {
                    year: { $year: '$createdAt' },
                    month: { $month: '$createdAt' }
                };
        }

        const dateFilter = {};
        if (startDate && endDate) {
            dateFilter.createdAt = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }

        const revenueTimeSeries = await Order.aggregate([
            { 
                $match: { 
                    status: { $in: ['delivered', 'shipped'] },
                    ...dateFilter 
                } 
            },
            {
                $group: {
                    _id: groupBy,
                    revenue: { $sum: '$totalAmount' },
                    orders: { $sum: 1 },
                    avgOrderValue: { $avg: '$totalAmount' }
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
        ]);

        res.json(revenueTimeSeries);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get best selling products
exports.getBestSellers = async (req, res) => {
    try {
        const { limit = 10, startDate, endDate } = req.query;

        const dateFilter = {};
        if (startDate && endDate) {
            dateFilter.createdAt = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }

        const bestSellers = await Order.aggregate([
            { 
                $match: { 
                    status: { $in: ['delivered', 'shipped'] },
                    ...dateFilter 
                } 
            },
            { $unwind: '$items' },
            {
                $group: {
                    _id: '$items.product',
                    totalSold: { $sum: '$items.quantity' },
                    totalRevenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
                    orderCount: { $sum: 1 }
                }
            },
            { $sort: { totalSold: -1 } },
            { $limit: parseInt(limit) },
            {
                $lookup: {
                    from: 'products',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'product'
                }
            },
            { $unwind: '$product' },
            {
                $project: {
                    _id: 1,
                    productName: '$product.name',
                    brand: '$product.brand',
                    imageUrl: '$product.imageUrl',
                    totalSold: 1,
                    totalRevenue: 1,
                    orderCount: 1
                }
            }
        ]);

        res.json(bestSellers);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get low stock alerts
exports.getLowStockAlerts = async (req, res) => {
    try {
        const lowStockProducts = await Product.find({
            $expr: { $lte: ['$stock', '$lowStockAlert'] },
            isActive: true
        })
        .populate('createdBy', 'username shopName email')
        .sort({ stock: 1 })
        .select('name brand stock lowStockAlert imageUrl price createdBy');

        res.json(lowStockProducts);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get sales by category
exports.getSalesByCategory = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        const dateFilter = {};
        if (startDate && endDate) {
            dateFilter.createdAt = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }

        const salesByCategory = await Order.aggregate([
            { 
                $match: { 
                    status: { $in: ['delivered', 'shipped'] },
                    ...dateFilter 
                } 
            },
            { $unwind: '$items' },
            {
                $lookup: {
                    from: 'products',
                    localField: 'items.product',
                    foreignField: '_id',
                    as: 'product'
                }
            },
            { $unwind: '$product' },
            {
                $group: {
                    _id: '$product.category',
                    totalSold: { $sum: '$items.quantity' },
                    totalRevenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
                    orderCount: { $sum: 1 }
                }
            },
            { $sort: { totalRevenue: -1 } }
        ]);

        res.json(salesByCategory);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get sales by brand
exports.getSalesByBrand = async (req, res) => {
    try {
        const { limit = 10, startDate, endDate } = req.query;

        const dateFilter = {};
        if (startDate && endDate) {
            dateFilter.createdAt = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }

        const salesByBrand = await Order.aggregate([
            { 
                $match: { 
                    status: { $in: ['delivered', 'shipped'] },
                    ...dateFilter 
                } 
            },
            { $unwind: '$items' },
            {
                $lookup: {
                    from: 'products',
                    localField: 'items.product',
                    foreignField: '_id',
                    as: 'product'
                }
            },
            { $unwind: '$product' },
            {
                $group: {
                    _id: '$product.brand',
                    totalSold: { $sum: '$items.quantity' },
                    totalRevenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
                    orderCount: { $sum: 1 }
                }
            },
            { $sort: { totalRevenue: -1 } },
            { $limit: parseInt(limit) }
        ]);

        res.json(salesByBrand);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get customer analytics
exports.getCustomerAnalytics = async (req, res) => {
    try {
        // Top customers by spending
        const topCustomers = await Order.aggregate([
            { $match: { status: { $in: ['delivered', 'shipped'] } } },
            {
                $group: {
                    _id: '$user',
                    totalSpent: { $sum: '$totalAmount' },
                    orderCount: { $sum: 1 }
                }
            },
            { $sort: { totalSpent: -1 } },
            { $limit: 10 },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            { $unwind: '$user' },
            {
                $project: {
                    userId: '$_id',
                    username: '$user.username',
                    email: '$user.email',
                    totalSpent: 1,
                    orderCount: 1,
                    avgOrderValue: { $divide: ['$totalSpent', '$orderCount'] }
                }
            }
        ]);

        // New customers (this month)
        const thisMonth = new Date();
        thisMonth.setDate(1);
        thisMonth.setHours(0, 0, 0, 0);

        const newCustomers = await User.countDocuments({
            role: 'client',
            createdAt: { $gte: thisMonth }
        });

        // Customer retention rate
        const totalCustomers = await User.countDocuments({ role: 'client' });
        const repeatCustomers = await Order.aggregate([
            { $group: { _id: '$user', orderCount: { $sum: 1 } } },
            { $match: { orderCount: { $gt: 1 } } },
            { $count: 'count' }
        ]);

        const retentionRate = totalCustomers > 0 
            ? ((repeatCustomers[0]?.count || 0) / totalCustomers * 100).toFixed(2)
            : 0;

        res.json({
            topCustomers,
            newCustomersThisMonth: newCustomers,
            totalCustomers,
            repeatCustomers: repeatCustomers[0]?.count || 0,
            retentionRate: `${retentionRate}%`
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get order fulfillment metrics
exports.getFulfillmentMetrics = async (req, res) => {
    try {
        // Average processing time (pending to shipped)
        const processingTime = await Order.aggregate([
            { $match: { status: 'shipped' } },
            {
                $project: {
                    processingTime: {
                        $subtract: ['$tracking.shippedDate', '$createdAt']
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    avgProcessingTime: { $avg: '$processingTime' }
                }
            }
        ]);

        // Average delivery time (shipped to delivered)
        const deliveryTime = await Order.aggregate([
            { $match: { status: 'delivered' } },
            {
                $project: {
                    deliveryTime: {
                        $subtract: ['$tracking.deliveredDate', '$tracking.shippedDate']
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    avgDeliveryTime: { $avg: '$deliveryTime' }
                }
            }
        ]);

        // Order cancellation rate
        const totalOrders = await Order.countDocuments();
        const cancelledOrders = await Order.countDocuments({ status: 'cancelled' });
        const cancellationRate = totalOrders > 0 
            ? ((cancelledOrders / totalOrders) * 100).toFixed(2)
            : 0;

        res.json({
            avgProcessingDays: processingTime[0] 
                ? (processingTime[0].avgProcessingTime / (1000 * 60 * 60 * 24)).toFixed(1)
                : 0,
            avgDeliveryDays: deliveryTime[0] 
                ? (deliveryTime[0].avgDeliveryTime / (1000 * 60 * 60 * 24)).toFixed(1)
                : 0,
            totalOrders,
            cancelledOrders,
            cancellationRate: `${cancellationRate}%`
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
