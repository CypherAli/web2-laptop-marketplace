const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const {
    getDashboardStats,
    getRevenueAnalytics,
    getBestSellers,
    getLowStockAlerts,
    getSalesByCategory,
    getSalesByBrand,
    getCustomerAnalytics,
    getFulfillmentMetrics
} = require('../controllers/analyticsController');

// Public routes (for homepage best sellers)
router.get('/best-sellers', getBestSellers);
router.get('/low-stock', getLowStockAlerts);

// Protected routes (admin only)
router.get('/dashboard', auth, authorize(['admin']), getDashboardStats);
router.get('/revenue', auth, authorize(['admin']), getRevenueAnalytics);
router.get('/sales-by-category', auth, authorize(['admin']), getSalesByCategory);
router.get('/sales-by-brand', auth, authorize(['admin']), getSalesByBrand);
router.get('/customers', auth, authorize(['admin']), getCustomerAnalytics);
router.get('/fulfillment', auth, authorize(['admin']), getFulfillmentMetrics);

module.exports = router;
