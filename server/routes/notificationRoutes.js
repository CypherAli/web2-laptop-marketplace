const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');

// All routes require authentication
router.use(auth);

// ==================== USER ROUTES ====================
router.get('/my-notifications', notificationController.getMyNotifications);
router.get('/unread-count', notificationController.getUnreadCount);
router.get('/:notificationId', notificationController.getNotificationById);
router.post('/:notificationId/read', notificationController.markAsRead);
router.post('/mark-all-read', notificationController.markAllAsRead);
router.post('/:notificationId/archive', notificationController.archiveNotification);
router.delete('/:notificationId', notificationController.deleteNotification);
router.delete('/clear-read/all', notificationController.clearReadNotifications);

// ==================== ADMIN ROUTES ====================
router.post('/admin/announcement', authorize('admin'), notificationController.sendSystemAnnouncement);
router.post('/admin/promotion', authorize('admin'), notificationController.sendPromotion);

module.exports = router;
