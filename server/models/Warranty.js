const mongoose = require('mongoose');

/**
 * WARRANTY MANAGEMENT SYSTEM
 * Quản lý bảo hành cho laptop đã mua
 */
const WarrantySchema = new mongoose.Schema({
    // Liên kết với user và đơn hàng
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    
    // Thông tin sản phẩm
    productName: {
        type: String,
        required: true
    },
    serialNumber: {
        type: String,
        unique: true,
        sparse: true
    },
    imeiNumber: String,
    
    // Thông tin bảo hành
    warrantyType: {
        type: String,
        enum: ['manufacturer', 'seller', 'extended'],
        default: 'manufacturer'
    },
    
    warrantyPeriod: {
        months: {
            type: Number,
            required: true,
            default: 12
        },
        startDate: {
            type: Date,
            required: true,
            default: Date.now
        },
        endDate: {
            type: Date,
            required: true
        }
    },
    
    // Trạng thái
    status: {
        type: String,
        enum: ['active', 'expired', 'void', 'claimed'],
        default: 'active'
    },
    
    // Điều khoản bảo hành
    terms: {
        coverageType: {
            type: String,
            enum: ['full', 'parts_only', 'labor_only'],
            default: 'full'
        },
        coveredIssues: [String],  // Hardware failure, Screen damage, etc.
        exclusions: [String],      // Water damage, Physical abuse, etc.
        claimLimit: Number         // Số lần claim tối đa
    },
    
    // Lịch sử sửa chữa/bảo hành
    repairHistory: [{
        issueDescription: {
            type: String,
            required: true
        },
        reportedDate: {
            type: Date,
            default: Date.now
        },
        repairCenter: {
            name: String,
            address: String,
            phone: String
        },
        status: {
            type: String,
            enum: ['pending', 'in_progress', 'completed', 'rejected'],
            default: 'pending'
        },
        receivedDate: Date,
        completedDate: Date,
        estimatedCompletionDate: Date,
        repairDetails: {
            diagnosis: String,
            partsReplaced: [String],
            laborCost: Number,
            partsCost: Number,
            totalCost: Number,
            coveredByClaimed: Boolean
        },
        technicianNotes: String,
        customerSatisfaction: {
            rating: Number,  // 1-5
            feedback: String
        }
    }],
    
    // Thông tin người liên hệ bảo hành
    contactPerson: {
        name: String,
        phone: String,
        email: String
    },
    
    // Documents & Proofs
    documents: [{
        type: {
            type: String,
            enum: ['invoice', 'warranty_card', 'repair_receipt', 'photo'],
            required: true
        },
        url: String,
        uploadedAt: {
            type: Date,
            default: Date.now
        }
    }],
    
    // Ghi chú
    notes: String,
    
    // Nhắc nhở
    reminders: {
        thirtyDaysBefore: {
            sent: Boolean,
            sentAt: Date
        },
        sevenDaysBefore: {
            sent: Boolean,
            sentAt: Date
        },
        onExpiryDate: {
            sent: Boolean,
            sentAt: Date
        }
    }
}, { timestamps: true });

// Indexes
WarrantySchema.index({ user: 1, status: 1 });
WarrantySchema.index({ 'warrantyPeriod.endDate': 1 });
// serialNumber already has unique: true, no need for separate index

// Virtual for days remaining
WarrantySchema.virtual('daysRemaining').get(function() {
    if (this.status !== 'active') return 0;
    const now = new Date();
    const end = new Date(this.warrantyPeriod.endDate);
    const diff = end - now;
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
});

// Method to check if warranty is expiring soon
WarrantySchema.methods.isExpiringSoon = function(days = 30) {
    return this.daysRemaining > 0 && this.daysRemaining <= days;
};

// Static method to find expiring warranties
WarrantySchema.statics.findExpiringSoon = function(days = 30) {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);
    
    return this.find({
        status: 'active',
        'warrantyPeriod.endDate': {
            $gte: new Date(),
            $lte: futureDate
        }
    });
};

// Auto-update status when warranty expires
WarrantySchema.pre('save', function(next) {
    if (this.warrantyPeriod && this.warrantyPeriod.endDate) {
        const now = new Date();
        if (new Date(this.warrantyPeriod.endDate) < now && this.status === 'active') {
            this.status = 'expired';
        }
    }
    next();
});

module.exports = mongoose.model('Warranty', WarrantySchema);
