const mongoose = require('mongoose');

const ComparisonSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        index: true
    },
    sessionId: {
        type: String,
        index: true
    },
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }],
    isPublic: {
        type: Boolean,
        default: false
    },
    slug: {
        type: String,
        unique: true,
        sparse: true
    },
    viewCount: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

// Limit to maximum 4 products for comparison
ComparisonSchema.pre('save', function(next) {
    if (this.products.length > 4) {
        next(new Error('Cannot compare more than 4 products'));
    } else {
        next();
    }
});

// Generate slug for public comparisons
ComparisonSchema.pre('save', function(next) {
    if (this.isPublic && !this.slug) {
        this.slug = `compare-${this._id.toString().slice(-8)}`;
    }
    next();
});

module.exports = mongoose.model('Comparison', ComparisonSchema);
