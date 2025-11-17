const mongoose = require('mongoose');

/**
 * PAYMENT MODEL
 * Quản lý các giao dịch thanh toán
 */
const PaymentSchema = new mongoose.Schema({
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true,
        index: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    
    // Payment method details
    paymentMethod: {
        type: String,
        enum: ['cod', 'vnpay', 'momo', 'zalopay', 'bank_transfer', 'credit_card'],
        required: true
    },
    
    // Payment provider details
    provider: {
        name: String,  // VNPay, MoMo, ZaloPay, etc.
        transactionId: String,  // ID from payment gateway
        transactionRef: String,  // Reference number
        gatewayOrderInfo: mongoose.Schema.Types.Mixed  // Raw response from gateway
    },
    
    // Amount details
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    currency: {
        type: String,
        default: 'VND'
    },
    
    // Payment status
    status: {
        type: String,
        enum: ['pending', 'processing', 'success', 'failed', 'cancelled', 'refunded'],
        default: 'pending',
        index: true
    },
    
    // Timestamps
    paymentDate: Date,
    completedAt: Date,
    failedAt: Date,
    cancelledAt: Date,
    refundedAt: Date,
    
    // Error handling
    error: {
        code: String,
        message: String,
        details: mongoose.Schema.Types.Mixed
    },
    
    // Refund information
    refund: {
        amount: Number,
        reason: String,
        requestedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        requestedAt: Date,
        processedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        processedAt: Date,
        refundTransactionId: String,
        status: {
            type: String,
            enum: ['requested', 'approved', 'rejected', 'completed']
        }
    },
    
    // Payment details for COD
    codDetails: {
        collectedBy: String,  // Delivery person name
        collectedAt: Date,
        receiptNumber: String
    },
    
    // Bank transfer details
    bankTransferDetails: {
        bankName: String,
        accountNumber: String,
        accountName: String,
        transferDate: Date,
        referenceNumber: String,
        proofImageUrl: String
    },
    
    // Additional metadata
    metadata: mongoose.Schema.Types.Mixed,
    
    // IP address and user agent for security
    ipAddress: String,
    userAgent: String
    
}, { timestamps: true });

// Indexes for better query performance
PaymentSchema.index({ status: 1, createdAt: -1 });
PaymentSchema.index({ 'provider.transactionId': 1 });
PaymentSchema.index({ paymentMethod: 1, status: 1 });

// Methods
PaymentSchema.methods.markAsSuccess = function(transactionDetails) {
    this.status = 'success';
    this.completedAt = new Date();
    if (transactionDetails) {
        this.provider = {
            ...this.provider,
            ...transactionDetails
        };
    }
    return this.save();
};

PaymentSchema.methods.markAsFailed = function(errorDetails) {
    this.status = 'failed';
    this.failedAt = new Date();
    this.error = errorDetails;
    return this.save();
};

PaymentSchema.methods.requestRefund = function(amount, reason, userId) {
    this.refund = {
        amount,
        reason,
        requestedBy: userId,
        requestedAt: new Date(),
        status: 'requested'
    };
    return this.save();
};

PaymentSchema.methods.processRefund = function(approved, userId, transactionId) {
    if (!this.refund) {
        throw new Error('No refund request found');
    }
    
    this.refund.processedBy = userId;
    this.refund.processedAt = new Date();
    this.refund.status = approved ? 'completed' : 'rejected';
    
    if (approved) {
        this.refund.refundTransactionId = transactionId;
        this.status = 'refunded';
        this.refundedAt = new Date();
    }
    
    return this.save();
};

// Static methods
PaymentSchema.statics.getTotalRevenue = function(filters = {}) {
    return this.aggregate([
        {
            $match: {
                status: 'success',
                ...filters
            }
        },
        {
            $group: {
                _id: null,
                totalRevenue: { $sum: '$amount' },
                totalTransactions: { $sum: 1 }
            }
        }
    ]);
};

PaymentSchema.statics.getRevenueByMethod = function(filters = {}) {
    return this.aggregate([
        {
            $match: {
                status: 'success',
                ...filters
            }
        },
        {
            $group: {
                _id: '$paymentMethod',
                revenue: { $sum: '$amount' },
                count: { $sum: 1 }
            }
        },
        {
            $sort: { revenue: -1 }
        }
    ]);
};

module.exports = mongoose.model('Payment', PaymentSchema);
