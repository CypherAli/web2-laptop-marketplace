const express = require('express');
const router = express.Router();
const voucherController = require('../controllers/voucherController');
const { protect, admin } = require('../middleware/authMiddleware');

// All routes require authentication
router.use(protect);

// ==================== USER ROUTES ====================
router.get('/my-vouchers', voucherController.getMyVouchers);
router.get('/available', voucherController.getAvailableVouchers);
router.post('/collect/:voucherId', voucherController.collectVoucher);
router.post('/apply', voucherController.applyVoucher);
router.post('/use', voucherController.useVoucher);

// ==================== ADMIN ROUTES ====================
router.post('/admin/create', admin, voucherController.createVoucher);
router.put('/admin/:voucherId', admin, voucherController.updateVoucher);
router.get('/admin/all', admin, voucherController.getAllVouchers);
router.post('/admin/:voucherId/deactivate', admin, voucherController.deactivateVoucher);
router.post('/admin/:voucherId/grant', admin, voucherController.grantVoucherToUsers);

module.exports = router;
