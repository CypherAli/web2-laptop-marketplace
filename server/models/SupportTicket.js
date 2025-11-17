const mongoose = require('mongoose');

/**
 * SUPPORT TICKET SYSTEM
 * Hệ thống hỗ trợ khách hàng
 */
const SupportTicketSchema = new mongoose.Schema({
    // Ticket Information
    ticketNumber: {
        type: String,
        unique: true,
        required: true
    },
    
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    
    // Ticket Details
    subject: {
        type: String,
        required: true,
        trim: true,
        maxlength: 200
    },
    
    category: {
        type: String,
        enum: [
            'order_issue',
            'product_inquiry',
            'warranty_claim',
            'refund_request',
            'technical_support',
            'payment_issue',
            'shipping_problem',
            'account_issue',
            'complaint',
            'other'
        ],
        required: true
    },
    
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'urgent'],
        default: 'medium'
    },
    
    status: {
        type: String,
        enum: ['open', 'in_progress', 'waiting_customer', 'resolved', 'closed', 'cancelled'],
        default: 'open'
    },
    
    // Related entities
    relatedOrder: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order'
    },
    relatedProduct: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    },
    relatedWarranty: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Warranty'
    },
    
    // Messages/Conversation
    messages: [{
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        senderRole: {
            type: String,
            enum: ['customer', 'support_agent', 'system'],
            required: true
        },
        message: {
            type: String,
            required: true
        },
        attachments: [{
            filename: String,
            url: String,
            fileType: String,
            uploadedAt: Date
        }],
        isInternal: {
            type: Boolean,
            default: false  // Internal notes only visible to support team
        },
        sentAt: {
            type: Date,
            default: Date.now
        },
        readAt: Date
    }],
    
    // Assignment
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'  // Support agent
    },
    assignedAt: Date,
    
    // Resolution
    resolution: {
        resolvedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        resolvedAt: Date,
        resolutionNotes: String,
        resolutionType: {
            type: String,
            enum: ['solved', 'refunded', 'replaced', 'compensated', 'no_action_needed', 'other']
        }
    },
    
    // Customer Satisfaction
    feedback: {
        rating: {
            type: Number,
            min: 1,
            max: 5
        },
        comment: String,
        submittedAt: Date
    },
    
    // Tracking
    firstResponseTime: Date,  // Time to first agent response
    totalResponseTime: Number,  // Total time spent
    reopenCount: {
        type: Number,
        default: 0
    },
    
    // Tags for organization
    tags: [String],
    
    // Notes (internal only)
    internalNotes: [{
        note: String,
        addedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        addedAt: {
            type: Date,
            default: Date.now
        }
    }]
}, { timestamps: true });

// Indexes
SupportTicketSchema.index({ ticketNumber: 1 });
SupportTicketSchema.index({ user: 1, status: 1 });
SupportTicketSchema.index({ assignedTo: 1, status: 1 });
SupportTicketSchema.index({ category: 1, priority: 1 });
SupportTicketSchema.index({ createdAt: -1 });

// Generate unique ticket number
SupportTicketSchema.pre('save', async function(next) {
    if (!this.ticketNumber) {
        const date = new Date();
        const year = date.getFullYear().toString().slice(-2);
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        
        // Find last ticket of the day
        const lastTicket = await mongoose.model('SupportTicket').findOne({
            ticketNumber: new RegExp(`^TK${year}${month}${day}`)
        }).sort({ ticketNumber: -1 });
        
        let sequence = 1;
        if (lastTicket) {
            const lastSeq = parseInt(lastTicket.ticketNumber.slice(-4));
            sequence = lastSeq + 1;
        }
        
        this.ticketNumber = `TK${year}${month}${day}${sequence.toString().padStart(4, '0')}`;
    }
    next();
});

// Virtuals
SupportTicketSchema.virtual('isOpen').get(function() {
    return ['open', 'in_progress', 'waiting_customer'].includes(this.status);
});

SupportTicketSchema.virtual('responseTimeInHours').get(function() {
    if (!this.firstResponseTime || !this.createdAt) return null;
    return Math.round((this.firstResponseTime - this.createdAt) / (1000 * 60 * 60));
});

// Methods
SupportTicketSchema.methods.addMessage = function(senderId, senderRole, message, attachments = []) {
    this.messages.push({
        sender: senderId,
        senderRole,
        message,
        attachments,
        sentAt: new Date()
    });
    
    // Set first response time if this is the first agent response
    if (senderRole === 'support_agent' && !this.firstResponseTime) {
        this.firstResponseTime = new Date();
    }
    
    return this.save();
};

SupportTicketSchema.methods.assignToAgent = function(agentId) {
    this.assignedTo = agentId;
    this.assignedAt = new Date();
    this.status = 'in_progress';
    return this.save();
};

SupportTicketSchema.methods.resolve = function(resolvedById, resolutionNotes, resolutionType) {
    this.status = 'resolved';
    this.resolution = {
        resolvedBy: resolvedById,
        resolvedAt: new Date(),
        resolutionNotes,
        resolutionType
    };
    return this.save();
};

SupportTicketSchema.methods.reopen = function() {
    this.status = 'open';
    this.reopenCount += 1;
    return this.save();
};

// Static methods
SupportTicketSchema.statics.getOpenTickets = function() {
    return this.find({
        status: { $in: ['open', 'in_progress', 'waiting_customer'] }
    }).sort({ priority: -1, createdAt: 1 });
};

SupportTicketSchema.statics.getUnassignedTickets = function() {
    return this.find({
        status: 'open',
        assignedTo: null
    }).sort({ priority: -1, createdAt: 1 });
};

module.exports = mongoose.model('SupportTicket', SupportTicketSchema);
