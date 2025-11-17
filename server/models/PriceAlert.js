const mongoose = require('mongoose');

/**
 * PRICE ALERT SYSTEM
 * Cho phép user đặt cảnh báo khi giá sản phẩm giảm
 */
const PriceAlertSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    
    // Alert settings
    targetPrice: {
        type: Number,
        required: true
    },
    currentPrice: {
        type: Number,
        required: true
    },
    
    // Alert type
    alertType: {
        type: String,
        enum: ['price_drop', 'back_in_stock', 'specific_price'],
        default: 'specific_price'
    },
    
    // Notification preferences
    notifyVia: {
        email: {
            type: Boolean,
            default: true
        },
        push: {
            type: Boolean,
            default: false
        },
        sms: {
            type: Boolean,
            default: false
        }
    },
    
    // Status
    status: {
        type: String,
        enum: ['active', 'triggered', 'expired', 'cancelled'],
        default: 'active'
    },
    
    // Trigger information
    triggered: {
        isTriggered: {
            type: Boolean,
            default: false
        },
        triggeredAt: Date,
        triggeredPrice: Number,
        notificationSent: {
            type: Boolean,
            default: false
        },
        notificationSentAt: Date
    },
    
    // Expiry
    expiresAt: {
        type: Date,
        default: function() {
            // Default: alert expires after 90 days
            const date = new Date();
            date.setDate(date.getDate() + 90);
            return date;
        }
    },
    
    // Metadata
    notes: String
}, { timestamps: true });

// Indexes
PriceAlertSchema.index({ user: 1, status: 1 });
PriceAlertSchema.index({ product: 1, status: 1 });
PriceAlertSchema.index({ expiresAt: 1 });

// Methods
PriceAlertSchema.methods.checkAndTrigger = async function(currentProductPrice) {
    if (this.status !== 'active') return false;
    
    if (currentProductPrice <= this.targetPrice) {
        this.status = 'triggered';
        this.triggered.isTriggered = true;
        this.triggered.triggeredAt = new Date();
        this.triggered.triggeredPrice = currentProductPrice;
        await this.save();
        return true;
    }
    return false;
};

// Static method to find active alerts for a product
PriceAlertSchema.statics.findActiveAlertsForProduct = function(productId) {
    return this.find({
        product: productId,
        status: 'active'
    }).populate('user', 'email username preferences');
};

module.exports = mongoose.model('PriceAlert', PriceAlertSchema);
