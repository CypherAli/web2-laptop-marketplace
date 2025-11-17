const mongoose = require('mongoose');

const OrderItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    name: { type: String, required: true },
    brand: { type: String },
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    quantity: { type: Number, required: true, min: 1 },
    imageUrl: { type: String },
    specifications: {
        processor: String,
        ram: String,
        storage: String
    }
});

const StatusHistorySchema = new mongoose.Schema({
    status: {
        type: String,
        required: true
    },
    note: String,
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const OrderSchema = new mongoose.Schema({
    orderNumber: {
        type: String,
        unique: true,
        index: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    items: [OrderItemSchema],
    
    // Pricing breakdown
    subtotal: {
        type: Number,
        required: true
    },
    shippingFee: {
        type: Number,
        default: 0
    },
    tax: {
        type: Number,
        default: 0
    },
    discount: {
        type: Number,
        default: 0
    },
    totalAmount: {
        type: Number,
        required: true
    },
    
    // Order status
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded', 'returned'],
        default: 'pending',
        index: true
    },
    statusHistory: [StatusHistorySchema],
    
    // Payment info
    paymentMethod: {
        type: String,
        enum: ['cod', 'vnpay', 'momo', 'stripe', 'bank_transfer'],
        default: 'cod'
    },
    paymentStatus: {
        type: String,
        enum: ['unpaid', 'paid', 'refunded', 'failed'],
        default: 'unpaid'
    },
    paymentDate: Date,
    transactionId: String,
    
    // Shipping info
    shippingAddress: {
        fullName: { type: String, required: true },
        phone: { type: String, required: true },
        email: String,
        address: { type: String, required: true },
        ward: String,
        district: String,
        city: { type: String, required: true },
        zipCode: String,
        country: { type: String, default: 'Vietnam' }
    },
    
    billingAddress: {
        fullName: String,
        phone: String,
        email: String,
        address: String,
        ward: String,
        district: String,
        city: String,
        zipCode: String,
        country: { type: String, default: 'Vietnam' }
    },
    
    // Tracking info
    tracking: {
        carrier: String,
        trackingNumber: String,
        trackingUrl: String,
        estimatedDelivery: Date,
        shippedDate: Date,
        deliveredDate: Date
    },
    
    // Coupon & promotion
    couponCode: String,
    couponDiscount: {
        type: Number,
        default: 0
    },
    
    // Customer notes & internal notes
    customerNotes: String,
    internalNotes: String,
    
    // Cancellation & return
    cancellation: {
        reason: String,
        cancelledBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        cancelledAt: Date
    },
    
    returnRequest: {
        reason: String,
        status: {
            type: String,
            enum: ['pending', 'approved', 'rejected', 'completed']
        },
        requestedAt: Date,
        processedAt: Date
    },
    
    // Review reminder
    reviewReminded: {
        type: Boolean,
        default: false
    }
    
}, { timestamps: true });

// Generate order number before saving
OrderSchema.pre('save', async function(next) {
    if (!this.orderNumber) {
        const count = await mongoose.model('Order').countDocuments();
        const date = new Date();
        const year = date.getFullYear().toString().slice(-2);
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const orderNum = String(count + 1).padStart(6, '0');
        this.orderNumber = `LP${year}${month}${orderNum}`;
    }
    
    // Add initial status to history
    if (this.isNew) {
        this.statusHistory.push({
            status: this.status,
            note: 'Order created',
            timestamp: new Date()
        });
    }
    
    next();
});

// Update status history when status changes
OrderSchema.pre('save', function(next) {
    if (this.isModified('status') && !this.isNew) {
        this.statusHistory.push({
            status: this.status,
            note: `Status changed to ${this.status}`,
            timestamp: new Date()
        });
    }
    next();
});

// Indexes for better performance
OrderSchema.index({ createdAt: -1 });
OrderSchema.index({ status: 1, createdAt: -1 });
OrderSchema.index({ 'items.product': 1 });
OrderSchema.index({ 'items.seller': 1 });

module.exports = mongoose.model('Order', OrderSchema);
