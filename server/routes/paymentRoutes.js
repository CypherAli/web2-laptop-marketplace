const express = require('express');
const router = express.Router();
const {
    createPayment,
    getPaymentByOrder,
    getMyPayments,
    confirmCODPayment,
    createVNPayPayment,
    vnpayReturn,
    createMoMoPayment,
    submitBankTransfer,
    verifyBankTransfer,
    requestRefund,
    processRefund
} = require('../controllers/paymentController');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');

// User routes
router.post('/create', auth, createPayment);
router.get('/my-payments', auth, getMyPayments);
router.get('/order/:orderId', auth, getPaymentByOrder);

// COD payment
router.put('/:paymentId/confirm-cod', auth, authorize('admin', 'partner'), confirmCODPayment);

// VNPay payment
router.post('/vnpay/create', auth, createVNPayPayment);
router.get('/vnpay/return', vnpayReturn);

// MoMo payment
router.post('/momo/create', auth, createMoMoPayment);

// Bank transfer
router.put('/:paymentId/bank-transfer', auth, submitBankTransfer);
router.put('/:paymentId/verify-bank-transfer', auth, authorize('admin'), verifyBankTransfer);

// Refund
router.post('/:paymentId/refund', auth, requestRefund);
router.put('/:paymentId/process-refund', auth, authorize('admin'), processRefund);

module.exports = router;
