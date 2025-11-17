const express = require('express');
const router = express.Router();
const {
    createOrder,
    getMyOrders,
    getOrderById,
    getAllOrders,
    updateOrderStatus,
    cancelOrder
} = require('../controllers/orderController');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');

// User routes (authenticated)
router.post('/', auth, createOrder);
router.get('/my-orders', auth, getMyOrders);
router.get('/:id', auth, getOrderById);
router.put('/:id/cancel', auth, cancelOrder);

// Manager/Admin routes
router.get('/', auth, authorize('manager', 'admin'), getAllOrders);
router.put('/:id/status', auth, authorize('manager', 'admin'), updateOrderStatus);

module.exports = router;
