const express = require('express');
const router = express.Router();
const priceAlertController = require('../controllers/priceAlertController');
const { protect } = require('../middleware/authMiddleware');

// All routes require authentication
router.use(protect);

// ==================== USER ROUTES ====================
router.get('/my-alerts', priceAlertController.getUserPriceAlerts);
router.get('/triggered', priceAlertController.getTriggeredAlerts);
router.get('/:alertId', priceAlertController.getPriceAlertById);
router.post('/create', priceAlertController.createPriceAlert);
router.put('/:alertId', priceAlertController.updatePriceAlert);
router.delete('/:alertId', priceAlertController.deletePriceAlert);

module.exports = router;
