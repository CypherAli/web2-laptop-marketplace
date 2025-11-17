const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    username: { 
        type: String, 
        required: true, 
        unique: true,
        trim: true,
        minlength: 3,
        maxlength: 50
    },
    email: { 
        type: String, 
        required: true, 
        unique: true,
        lowercase: true,
        trim: true
    },
    password: { 
        type: String, 
        required: true,
        minlength: 6
    },
    role: {
        type: String,
        enum: ['client', 'partner', 'admin'],
        default: 'client'
    },
    // Partner-specific fields
    shopName: { 
        type: String,
        trim: true
    },
    shopDescription: { 
        type: String,
        trim: true,
        maxlength: 500
    },
    isApproved: { 
        type: Boolean, 
        default: function() {
            // Auto-approve clients and admins, partners need approval
            return this.role !== 'partner';
        }
    },
    // Additional user info
    phone: {
        type: String,
        trim: true
    },
    avatar: {
        type: String,
        default: ''
    },
    isActive: {
        type: Boolean,
        default: true
    },
    
    // === II. SHIPPING & CONTACT INFORMATION ===
    // Multiple shipping addresses support
    addresses: [{
        label: {
            type: String,
            enum: ['home', 'office', 'other'],
            default: 'home'
        },
        fullName: String,
        phone: String,
        address: {
            street: String,
            ward: String,      // Phường/Xã
            district: String,  // Quận/Huyện
            city: String,      // Tỉnh/Thành phố
            zipCode: String
        },
        isDefault: {
            type: Boolean,
            default: false
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    
    // === III. PAYMENT METHODS (Encrypted & Secured) ===
    paymentMethods: [{
        type: {
            type: String,
            enum: ['card', 'bank', 'ewallet'],
            required: true
        },
        provider: String,  // Visa, Mastercard, MoMo, ZaloPay, etc.
        lastFourDigits: String,
        accountName: String,
        expiryDate: String,
        isDefault: {
            type: Boolean,
            default: false
        },
        addedAt: {
            type: Date,
            default: Date.now
        }
    }],
    
    // === IV. USER PREFERENCES & CUSTOMIZATION ===
    preferences: {
        // Notification settings
        notifications: {
            email: {
                orderUpdates: { type: Boolean, default: true },
                priceAlerts: { type: Boolean, default: true },
                promotions: { type: Boolean, default: true },
                warrantyReminders: { type: Boolean, default: true }
            },
            push: {
                orderUpdates: { type: Boolean, default: true },
                priceAlerts: { type: Boolean, default: false },
                promotions: { type: Boolean, default: false }
            }
        },
        // Display preferences
        language: {
            type: String,
            enum: ['vi', 'en'],
            default: 'vi'
        },
        currency: {
            type: String,
            enum: ['VND', 'USD'],
            default: 'VND'
        },
        // Shopping preferences
        defaultPaymentMethod: mongoose.Schema.Types.ObjectId,
        defaultShippingAddress: mongoose.Schema.Types.ObjectId
    },
    
    // === V. BROWSING HISTORY & INTERACTIONS ===
    wishlist: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        },
        addedAt: {
            type: Date,
            default: Date.now
        }
    }],
    
    recentViews: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        },
        viewedAt: {
            type: Date,
            default: Date.now
        }
    }],
    
    searchHistory: [{
        query: String,
        filters: mongoose.Schema.Types.Mixed,
        searchedAt: {
            type: Date,
            default: Date.now
        }
    }],
    
    comparisonHistory: [{
        products: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        }],
        comparedAt: {
            type: Date,
            default: Date.now
        }
    }],
    
    // === VI. LOYALTY & REWARDS ===
    loyaltyPoints: {
        total: {
            type: Number,
            default: 0
        },
        available: {
            type: Number,
            default: 0
        },
        used: {
            type: Number,
            default: 0
        }
    },
    
    membershipTier: {
        type: String,
        enum: ['bronze', 'silver', 'gold', 'platinum'],
        default: 'bronze'
    },
    
    // === VII. STATISTICS (Auto-calculated) ===
    stats: {
        totalOrders: {
            type: Number,
            default: 0
        },
        totalSpent: {
            type: Number,
            default: 0
        },
        totalReviews: {
            type: Number,
            default: 0
        },
        averageRating: {
            type: Number,
            default: 0
        },
        lastOrderDate: Date,
        accountCreatedDays: Number
    }
}, { timestamps: true });

// Hash password before saving
UserSchema.pre('save', async function(next) {
    // Only hash the password if it has been modified (or is new)
    if (!this.isModified('password')) {
        return next();
    }
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Method to compare password for login
UserSchema.methods.comparePassword = async function(candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        throw error;
    }
};

module.exports = mongoose.model('User', UserSchema);