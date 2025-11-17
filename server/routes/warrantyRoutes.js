const express = require('express');
const router = express.Router();
const warrantyController = require('../controllers/warrantyController');
const { protect, admin } = require('../middleware/authMiddleware');

// All routes require authentication
router.use(protect);

// ==================== USER ROUTES ====================
router.get('/my-warranties', warrantyController.getUserWarranties);
router.get('/expiring', warrantyController.getExpiringWarranties);
router.get('/:warrantyId', warrantyController.getWarrantyById);
router.post('/register', warrantyController.registerWarranty);
router.put('/:warrantyId', warrantyController.updateWarranty);
router.post('/:warrantyId/repair', warrantyController.submitRepairRequest);
router.post('/:warrantyId/repair/:repairId/feedback', warrantyController.submitRepairFeedback);
router.post('/:warrantyId/documents', warrantyController.uploadWarrantyDocument);

// ==================== ADMIN ROUTES ====================
router.put('/:warrantyId/repair/:repairId/status', admin, warrantyController.updateRepairStatus);

module.exports = router;
