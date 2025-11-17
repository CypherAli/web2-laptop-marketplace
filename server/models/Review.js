const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
        index: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        index: true
    },
    
    // Review content
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    title: {
        type: String,
        required: true,
        maxlength: 200
    },
    comment: {
        type: String,
        required: true,
        maxlength: 2000
    },
    images: [String], // Review images uploaded by user
    
    // Verified purchase
    isVerifiedPurchase: {
        type: Boolean,
        default: false
    },
    
    // Helpful votes
    helpfulCount: {
        type: Number,
        default: 0
    },
    helpfulBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    
    // Review pros & cons
    pros: [String],
    cons: [String],
    
    // Moderation
    isApproved: {
        type: Boolean,
        default: false
    },
    moderatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    moderatedAt: Date,
    
    // Seller response
    sellerResponse: {
        comment: String,
        respondedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        respondedAt: Date
    }
    
}, { timestamps: true });

// Compound index to ensure one review per user per product
ReviewSchema.index({ product: 1, user: 1 }, { unique: true });
ReviewSchema.index({ createdAt: -1 });
ReviewSchema.index({ rating: -1 });
ReviewSchema.index({ isApproved: 1, createdAt: -1 });

// Update product rating after review is saved or updated
ReviewSchema.post('save', async function() {
    if (this.isApproved) {
        const Product = mongoose.model('Product');
        const product = await Product.findById(this.product);
        if (product) {
            await product.updateRating();
        }
    }
});

// Update product rating after review is deleted
ReviewSchema.post('remove', async function() {
    const Product = mongoose.model('Product');
    const product = await Product.findById(this.product);
    if (product) {
        await product.updateRating();
    }
});

module.exports = mongoose.model('Review', ReviewSchema);
