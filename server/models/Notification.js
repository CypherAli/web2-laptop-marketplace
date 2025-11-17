const mongoose = require('mongoose');

/**
 * NOTIFICATION SYSTEM
 * Real-time notifications cho user
 */
const NotificationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    
    // Notification Details
    type: {
        type: String,
        enum: [
            // Order notifications
            'order_confirmed',
            'order_shipped',
            'order_delivered',
            'order_cancelled',
            
            // Price alerts
            'price_drop',
            'back_in_stock',
            
            // Warranty notifications
            'warranty_expiring',
            'warranty_expired',
            'repair_status_updated',
            
            // Voucher notifications
            'voucher_received',
            'voucher_expiring',
            
            // Support notifications
            'ticket_replied',
            'ticket_resolved',
            
            // Promotional
            'new_promotion',
            'flash_sale',
            
            // Account
            'account_security',
            'password_changed',
            
            // System
            'system_announcement',
            'maintenance_notice'
        ],
        required: true
    },
    
    title: {
        type: String,
        required: true
    },
    
    message: {
        type: String,
        required: true
    },
    
    // Links & Actions
    actionUrl: String,  // Link to related page
    actionText: String,  // Button text
    
    // Related entities
    relatedOrder: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order'
    },
    relatedProduct: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    },
    relatedTicket: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SupportTicket'
    },
    relatedWarranty: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Warranty'
    },
    
    // Priority & Status
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'urgent'],
        default: 'medium'
    },
    
    status: {
        type: String,
        enum: ['unread', 'read', 'archived'],
        default: 'unread'
    },
    
    // Delivery channels
    channels: {
        inApp: {
            sent: { type: Boolean, default: true },
            sentAt: Date
        },
        email: {
            sent: { type: Boolean, default: false },
            sentAt: Date,
            opened: { type: Boolean, default: false },
            openedAt: Date
        },
        push: {
            sent: { type: Boolean, default: false },
            sentAt: Date,
            clicked: { type: Boolean, default: false },
            clickedAt: Date
        },
        sms: {
            sent: { type: Boolean, default: false },
            sentAt: Date
        }
    },
    
    // Tracking
    readAt: Date,
    archivedAt: Date,
    
    // Metadata
    metadata: mongoose.Schema.Types.Mixed,  // Additional data specific to notification type
    
    // Expiry
    expiresAt: {
        type: Date,
        default: function() {
            // Default: notifications expire after 90 days
            const date = new Date();
            date.setDate(date.getDate() + 90);
            return date;
        }
    }
}, { timestamps: true });

// Indexes
NotificationSchema.index({ user: 1, status: 1, createdAt: -1 });
NotificationSchema.index({ user: 1, type: 1 });
NotificationSchema.index({ expiresAt: 1 });

// Virtuals
NotificationSchema.virtual('isUnread').get(function() {
    return this.status === 'unread';
});

NotificationSchema.virtual('age').get(function() {
    const now = new Date();
    const created = new Date(this.createdAt);
    const diffMs = now - created;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 60) return `${diffMins} phút trước`;
    if (diffHours < 24) return `${diffHours} giờ trước`;
    return `${diffDays} ngày trước`;
});

// Methods
NotificationSchema.methods.markAsRead = function() {
    if (this.status === 'unread') {
        this.status = 'read';
        this.readAt = new Date();
        return this.save();
    }
    return Promise.resolve(this);
};

NotificationSchema.methods.archive = function() {
    this.status = 'archived';
    this.archivedAt = new Date();
    return this.save();
};

// Static methods
NotificationSchema.statics.createNotification = async function(data) {
    const notification = new this(data);
    await notification.save();
    
    // Here you can trigger real-time push via Socket.io
    // global.io.to(data.user.toString()).emit('new_notification', notification);
    
    return notification;
};

NotificationSchema.statics.getUnreadCount = function(userId) {
    return this.countDocuments({ user: userId, status: 'unread' });
};

NotificationSchema.statics.markAllAsRead = function(userId) {
    return this.updateMany(
        { user: userId, status: 'unread' },
        { 
            status: 'read', 
            readAt: new Date() 
        }
    );
};

NotificationSchema.statics.cleanupExpired = function() {
    return this.deleteMany({
        expiresAt: { $lt: new Date() }
    });
};

// Helper function to create specific notification types
NotificationSchema.statics.notifyOrderStatus = function(userId, order, status) {
    const messages = {
        order_confirmed: {
            title: 'Đơn hàng đã được xác nhận',
            message: `Đơn hàng #${order.orderNumber} đã được xác nhận và đang được xử lý.`
        },
        order_shipped: {
            title: 'Đơn hàng đang được giao',
            message: `Đơn hàng #${order.orderNumber} đang trên đường giao đến bạn!`
        },
        order_delivered: {
            title: 'Đơn hàng đã được giao',
            message: `Đơn hàng #${order.orderNumber} đã được giao thành công. Cảm ơn bạn đã mua hàng!`
        }
    };
    
    const config = messages[status];
    if (config) {
        return this.createNotification({
            user: userId,
            type: status,
            title: config.title,
            message: config.message,
            relatedOrder: order._id,
            actionUrl: `/orders/${order._id}`,
            actionText: 'Xem đơn hàng',
            priority: 'high'
        });
    }
};

NotificationSchema.statics.notifyPriceDrop = function(userId, product, oldPrice, newPrice) {
    return this.createNotification({
        user: userId,
        type: 'price_drop',
        title: '🔥 Giá đã giảm!',
        message: `${product.name} giảm từ ${oldPrice.toLocaleString()} đ xuống ${newPrice.toLocaleString()} đ`,
        relatedProduct: product._id,
        actionUrl: `/product/${product._id}`,
        actionText: 'Xem ngay',
        priority: 'high'
    });
};

NotificationSchema.statics.notifyWarrantyExpiring = function(userId, warranty, daysLeft) {
    return this.createNotification({
        user: userId,
        type: 'warranty_expiring',
        title: '⚠️ Bảo hành sắp hết hạn',
        message: `Bảo hành cho ${warranty.productName} sẽ hết hạn trong ${daysLeft} ngày`,
        relatedWarranty: warranty._id,
        actionUrl: '/profile/warranty',
        actionText: 'Xem chi tiết',
        priority: 'medium'
    });
};

module.exports = mongoose.model('Notification', NotificationSchema);
