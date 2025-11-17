const mongoose = require('mongoose');

/**
 * VOUCHER/COUPON SYSTEM
 * Quản lý mã giảm giá cho user
 */
const VoucherSchema = new mongoose.Schema({
    // Voucher Information
    code: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true
    },
    name: {
        type: String,
        required: true
    },
    description: String,
    
    // Discount Details
    discountType: {
        type: String,
        enum: ['percentage', 'fixed_amount', 'free_shipping'],
        required: true
    },
    discountValue: {
        type: Number,
        required: true
    },
    maxDiscount: {
        type: Number  // For percentage discounts
    },
    
    // Conditions
    conditions: {
        minPurchaseAmount: {
            type: Number,
            default: 0
        },
        maxPurchaseAmount: Number,
        applicableCategories: [String],  // laptop brands or categories
        applicableProducts: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        }],
        excludedProducts: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        }],
        firstTimeUserOnly: {
            type: Boolean,
            default: false
        },
        specificUserTiers: [{
            type: String,
            enum: ['bronze', 'silver', 'gold', 'platinum']
        }]
    },
    
    // Usage Limits
    usageLimit: {
        totalLimit: {
            type: Number,
            default: null  // null = unlimited
        },
        perUserLimit: {
            type: Number,
            default: 1
        },
        currentUsage: {
            type: Number,
            default: 0
        }
    },
    
    // Validity Period
    validity: {
        startDate: {
            type: Date,
            required: true,
            default: Date.now
        },
        endDate: {
            type: Date,
            required: true
        },
        isActive: {
            type: Boolean,
            default: true
        }
    },
    
    // Assignment
    assignedTo: {
        type: String,
        enum: ['public', 'specific_users', 'loyalty_reward', 'promotion'],
        default: 'public'
    },
    specificUsers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    
    // Creator
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    
    // Metadata
    tags: [String],
    campaignName: String
}, { timestamps: true });

// User Voucher Collection (Many-to-Many relationship)
const UserVoucherSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    voucher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Voucher',
        required: true
    },
    
    // Usage tracking
    status: {
        type: String,
        enum: ['available', 'used', 'expired'],
        default: 'available'
    },
    
    usageHistory: [{
        order: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Order'
        },
        usedAt: Date,
        discountApplied: Number,
        orderAmount: Number
    }],
    
    // Collection info
    obtainedFrom: {
        type: String,
        enum: ['promotion', 'loyalty_reward', 'referral', 'admin_grant', 'campaign'],
        required: true
    },
    obtainedAt: {
        type: Date,
        default: Date.now
    },
    expiresAt: Date
}, { timestamps: true });

// Indexes
VoucherSchema.index({ code: 1 });
VoucherSchema.index({ 'validity.endDate': 1, 'validity.isActive': 1 });

UserVoucherSchema.index({ user: 1, status: 1 });
UserVoucherSchema.index({ voucher: 1 });
UserVoucherSchema.index({ expiresAt: 1 });

// Virtuals
VoucherSchema.virtual('isValid').get(function() {
    const now = new Date();
    return this.validity.isActive && 
           this.validity.startDate <= now && 
           this.validity.endDate >= now &&
           (this.usageLimit.totalLimit === null || 
            this.usageLimit.currentUsage < this.usageLimit.totalLimit);
});

// Methods
VoucherSchema.methods.canBeUsedBy = function(user, orderAmount) {
    if (!this.isValid) return { valid: false, reason: 'Voucher không còn hiệu lực' };
    
    // Check minimum purchase
    if (this.conditions.minPurchaseAmount > orderAmount) {
        return { 
            valid: false, 
            reason: `Đơn hàng tối thiểu ${this.conditions.minPurchaseAmount.toLocaleString()} VND` 
        };
    }
    
    // Check maximum purchase
    if (this.conditions.maxPurchaseAmount && orderAmount > this.conditions.maxPurchaseAmount) {
        return { 
            valid: false, 
            reason: `Đơn hàng tối đa ${this.conditions.maxPurchaseAmount.toLocaleString()} VND` 
        };
    }
    
    // Check user tier
    if (this.conditions.specificUserTiers && this.conditions.specificUserTiers.length > 0) {
        if (!this.conditions.specificUserTiers.includes(user.membershipTier)) {
            return { valid: false, reason: 'Chỉ dành cho hạng thành viên đặc biệt' };
        }
    }
    
    return { valid: true };
};

VoucherSchema.methods.calculateDiscount = function(orderAmount) {
    let discount = 0;
    
    switch(this.discountType) {
        case 'percentage':
            discount = orderAmount * (this.discountValue / 100);
            if (this.maxDiscount) {
                discount = Math.min(discount, this.maxDiscount);
            }
            break;
        case 'fixed_amount':
            discount = this.discountValue;
            break;
        case 'free_shipping':
            discount = 0;  // Handled separately
            break;
    }
    
    return Math.min(discount, orderAmount);  // Can't discount more than order amount
};

const Voucher = mongoose.model('Voucher', VoucherSchema);
const UserVoucher = mongoose.model('UserVoucher', UserVoucherSchema);

module.exports = { Voucher, UserVoucher };
