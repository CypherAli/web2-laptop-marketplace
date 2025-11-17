const Notification = require('../models/Notification');

/**
 * NOTIFICATION CONTROLLER
 * Quản lý thông báo
 */

// Get user's notifications
exports.getMyNotifications = async (req, res) => {
    try {
        const { status, type, page = 1, limit = 20 } = req.query;
        
        const filter = { user: req.user.id };
        if (status) filter.status = status;
        if (type) filter.type = type;
        
        const skip = (parseInt(page) - 1) * parseInt(limit);
        
        const notifications = await Notification.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));
        
        const total = await Notification.countDocuments(filter);
        const unreadCount = await Notification.getUnreadCount(req.user.id);
        
        res.json({
            notifications,
            unreadCount,
            currentPage: parseInt(page),
            totalPages: Math.ceil(total / parseInt(limit)),
            total
        });
    } catch (error) {
        console.error('Get notifications error:', error);
        res.status(500).json({ error: error.message });
    }
};

// Get unread count
exports.getUnreadCount = async (req, res) => {
    try {
        const count = await Notification.getUnreadCount(req.user.id);
        res.json({ unreadCount: count });
    } catch (error) {
        console.error('Get unread count error:', error);
        res.status(500).json({ error: error.message });
    }
};

// Mark notification as read
exports.markAsRead = async (req, res) => {
    try {
        const { notificationId } = req.params;
        
        const notification = await Notification.findOne({
            _id: notificationId,
            user: req.user.id
        });
        
        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }
        
        await notification.markAsRead();
        
        res.json({
            message: 'Notification marked as read',
            notification
        });
    } catch (error) {
        console.error('Mark as read error:', error);
        res.status(500).json({ error: error.message });
    }
};

// Mark all notifications as read
exports.markAllAsRead = async (req, res) => {
    try {
        await Notification.markAllAsRead(req.user.id);
        
        res.json({ message: 'All notifications marked as read' });
    } catch (error) {
        console.error('Mark all as read error:', error);
        res.status(500).json({ error: error.message });
    }
};

// Archive notification
exports.archiveNotification = async (req, res) => {
    try {
        const { notificationId } = req.params;
        
        const notification = await Notification.findOne({
            _id: notificationId,
            user: req.user.id
        });
        
        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }
        
        await notification.archive();
        
        res.json({
            message: 'Notification archived',
            notification
        });
    } catch (error) {
        console.error('Archive notification error:', error);
        res.status(500).json({ error: error.message });
    }
};

// Delete notification
exports.deleteNotification = async (req, res) => {
    try {
        const { notificationId } = req.params;
        
        const notification = await Notification.findOneAndDelete({
            _id: notificationId,
            user: req.user.id
        });
        
        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }
        
        res.json({ message: 'Notification deleted' });
    } catch (error) {
        console.error('Delete notification error:', error);
        res.status(500).json({ error: error.message });
    }
};

// Clear all read notifications
exports.clearReadNotifications = async (req, res) => {
    try {
        await Notification.deleteMany({
            user: req.user.id,
            status: 'read'
        });
        
        res.json({ message: 'Read notifications cleared' });
    } catch (error) {
        console.error('Clear notifications error:', error);
        res.status(500).json({ error: error.message });
    }
};

// Get notification by ID
exports.getNotificationById = async (req, res) => {
    try {
        const { notificationId } = req.params;
        
        const notification = await Notification.findOne({
            _id: notificationId,
            user: req.user.id
        })
            .populate('relatedOrder', 'orderNumber totalAmount')
            .populate('relatedProduct', 'name brand imageUrl price')
            .populate('relatedTicket', 'ticketNumber subject')
            .populate('relatedWarranty', 'productName warrantyPeriod');
        
        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }
        
        // Auto mark as read
        if (notification.status === 'unread') {
            await notification.markAsRead();
        }
        
        res.json(notification);
    } catch (error) {
        console.error('Get notification error:', error);
        res.status(500).json({ error: error.message });
    }
};

// ==================== ADMIN NOTIFICATION MANAGEMENT ====================

// Send system announcement (Admin)
exports.sendSystemAnnouncement = async (req, res) => {
    try {
        const { title, message, actionUrl, actionText, priority, userIds } = req.body;
        
        if (!title || !message) {
            return res.status(400).json({ message: 'Title and message are required' });
        }
        
        let targetUsers;
        
        if (userIds && userIds.length > 0) {
            // Send to specific users
            targetUsers = userIds;
        } else {
            // Send to all users
            const User = require('../models/User');
            const users = await User.find({ isActive: true }).select('_id');
            targetUsers = users.map(u => u._id);
        }
        
        const notifications = [];
        
        for (const userId of targetUsers) {
            const notification = await Notification.createNotification({
                user: userId,
                type: 'system_announcement',
                title,
                message,
                actionUrl: actionUrl || null,
                actionText: actionText || null,
                priority: priority || 'medium'
            });
            notifications.push(notification);
        }
        
        res.json({
            message: `System announcement sent to ${targetUsers.length} users`,
            count: notifications.length
        });
    } catch (error) {
        console.error('Send announcement error:', error);
        res.status(500).json({ error: error.message });
    }
};

// Send promotional notification (Admin)
exports.sendPromotion = async (req, res) => {
    try {
        const { title, message, actionUrl, actionText, userTiers } = req.body;
        
        if (!title || !message) {
            return res.status(400).json({ message: 'Title and message are required' });
        }
        
        const User = require('../models/User');
        
        const filter = { isActive: true };
        if (userTiers && userTiers.length > 0) {
            filter.membershipTier = { $in: userTiers };
        }
        
        const users = await User.find(filter).select('_id');
        
        const notifications = [];
        
        for (const user of users) {
            const notification = await Notification.createNotification({
                user: user._id,
                type: 'new_promotion',
                title,
                message,
                actionUrl: actionUrl || null,
                actionText: actionText || null,
                priority: 'low'
            });
            notifications.push(notification);
        }
        
        res.json({
            message: `Promotion sent to ${users.length} users`,
            count: notifications.length
        });
    } catch (error) {
        console.error('Send promotion error:', error);
        res.status(500).json({ error: error.message });
    }
};

// Cleanup expired notifications (Cron job)
exports.cleanupExpiredNotifications = async () => {
    try {
        const result = await Notification.cleanupExpired();
        console.log(`Cleaned up ${result.deletedCount} expired notifications`);
        return result;
    } catch (error) {
        console.error('Cleanup notifications error:', error);
    }
};

module.exports = exports;
