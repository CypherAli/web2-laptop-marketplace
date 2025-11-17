const mongoose = require('mongoose');

const CartItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
        default: 1
    },
    price: {
        type: Number,
        required: true
    },
    addedAt: {
        type: Date,
        default: Date.now
    }
});

const CartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    items: [CartItemSchema],
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Calculate total
CartSchema.virtual('total').get(function() {
    return this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
});

// Calculate total items
CartSchema.virtual('totalItems').get(function() {
    return this.items.reduce((sum, item) => sum + item.quantity, 0);
});

// Ensure virtuals are included in JSON
CartSchema.set('toJSON', { virtuals: true });
CartSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Cart', CartSchema);
