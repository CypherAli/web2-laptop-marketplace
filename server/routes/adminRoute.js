const express = require('express');
const router = express.Router();
const {
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    getSystemStats,
    getSystemRevenueByMonth,
    getRevenueByShop,
    getPartnerDetailedRevenue
} = require('../controllers/adminController');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');

// All routes require authentication and admin role
const adminOnly = authorize('admin');

// User management
router.get('/users', auth, adminOnly, getAllUsers);
router.get('/users/:id', auth, adminOnly, getUserById);
router.put('/users/:id', auth, adminOnly, updateUser);
router.delete('/users/:id', auth, adminOnly, deleteUser);

// System statistics
router.get('/stats', auth, adminOnly, getSystemStats);
router.get('/revenue', auth, adminOnly, getSystemRevenueByMonth);
router.get('/revenue-by-shop', auth, adminOnly, getRevenueByShop);
router.get('/partners/:partnerId/revenue', auth, adminOnly, getPartnerDetailedRevenue);

module.exports = router;
