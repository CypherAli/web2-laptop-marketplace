const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true, index: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    originalPrice: { type: Number, min: 0 }, // For showing discount/sale
    stock: { type: Number, default: 0, min: 0 },
    category: { type: String, default: 'Laptops', index: true },
    brand: { type: String, required: true, index: true }, // Brand name (Dell, HP, Lenovo, etc.)
    imageUrl: { type: String },
    images: [{ type: String }], // Multiple product images
    
    // Multi-vendor fields
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    
    // Detailed product specifications
    specifications: {
        processor: { type: String, index: true },
        processorGen: String,
        ram: { type: String, index: true },
        ramType: String, // DDR4, DDR5
        storage: String,
        storageType: String, // SSD, HDD, NVMe
        graphics: String,
        graphicsMemory: String,
        display: String,
        displaySize: Number, // in inches
        displayResolution: String,
        displayRefreshRate: String,
        weight: String,
        battery: String,
        operatingSystem: String,
        ports: [String],
        connectivity: [String], // WiFi, Bluetooth, etc
        keyboard: String,
        webcam: String,
        audio: String,
        dimensions: String,
        color: [String]
    },
    
    // Product features & highlights
    features: [String],
    highlights: [String],
    
    // Warranty & Support
    warranty: {
        duration: { type: String, default: '12 months' },
        type: String, // manufacturer, seller, extended
        details: String
    },
    
    // Return & Shipping
    returnPolicy: {
        returnable: { type: Boolean, default: true },
        returnWindow: { type: Number, default: 30 }, // days
        details: String
    },
    
    shipping: {
        isFreeShipping: { type: Boolean, default: false },
        estimatedDays: { type: Number, default: 3 },
        shippingCost: { type: Number, default: 0 }
    },
    
    // Reviews & Ratings
    rating: {
        average: { type: Number, default: 0, min: 0, max: 5 },
        count: { type: Number, default: 0 },
        breakdown: {
            5: { type: Number, default: 0 },
            4: { type: Number, default: 0 },
            3: { type: Number, default: 0 },
            2: { type: Number, default: 0 },
            1: { type: Number, default: 0 }
        }
    },
    
    // Sales & Analytics
    isActive: { type: Boolean, default: true }, // Partner can deactivate products
    soldCount: { type: Number, default: 0 }, // Track sales for analytics
    viewCount: { type: Number, default: 0 }, // Track product views
    wishlistCount: { type: Number, default: 0 }, // Track wishlist adds
    
    // SEO
    metaTitle: String,
    metaDescription: String,
    slug: { type: String, unique: true, sparse: true },
    tags: [String],
    
    // Inventory alerts
    lowStockAlert: { type: Number, default: 5 },
    
    // Featured & Deals
    isFeatured: { type: Boolean, default: false },
    isDeal: { type: Boolean, default: false },
    dealEndDate: Date
    
}, { timestamps: true });

// Indexes for better query performance
ProductSchema.index({ name: 'text', description: 'text', tags: 'text' });
ProductSchema.index({ price: 1, brand: 1 });
ProductSchema.index({ soldCount: -1 });
ProductSchema.index({ 'rating.average': -1 });
ProductSchema.index({ createdAt: -1 });

// Generate slug before saving
ProductSchema.pre('save', function(next) {
    if (this.isModified('name') && !this.slug) {
        this.slug = this.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '') + '-' + this._id.toString().slice(-6);
    }
    next();
});

// Method to update rating
ProductSchema.methods.updateRating = async function() {
    const Review = mongoose.model('Review');
    const reviews = await Review.find({ product: this._id, isApproved: true });
    
    if (reviews.length === 0) {
        this.rating.average = 0;
        this.rating.count = 0;
        this.rating.breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    } else {
        const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        let totalRating = 0;
        
        reviews.forEach(review => {
            breakdown[review.rating]++;
            totalRating += review.rating;
        });
        
        this.rating.average = (totalRating / reviews.length).toFixed(1);
        this.rating.count = reviews.length;
        this.rating.breakdown = breakdown;
    }
    
    await this.save();
};

module.exports = mongoose.model('Product', ProductSchema);