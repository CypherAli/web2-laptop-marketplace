const User = require('../models/User');
const Product = require('../models/Product');

/**
 * USER PROFILE CONTROLLER
 * Quản lý thông tin cá nhân, địa chỉ, phương thức thanh toán
 */

// ==================== PROFILE MANAGEMENT ====================

// Get full user profile
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
            .select('-password')
            .populate('recentViews.product', 'name price imageUrl brand')
            .populate('comparisonHistory.products', 'name price imageUrl brand');
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        res.json(user);
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ error: error.message });
    }
};

// Update basic profile info
exports.updateProfile = async (req, res) => {
    try {
        const { username, phone, avatar } = req.body;
        
        const updateData = {};
        if (username) updateData.username = username;
        if (phone) updateData.phone = phone;
        if (avatar) updateData.avatar = avatar;
        
        const user = await User.findByIdAndUpdate(
            req.user._id,
            updateData,
            { new: true, runValidators: true }
        ).select('-password');
        
        res.json({ message: 'Profile updated successfully', user });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ error: error.message });
    }
};

// Get user statistics
exports.getUserStats = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('stats loyaltyPoints membershipTier');
        res.json(user);
    } catch (error) {
        console.error('Get stats error:', error);
        res.status(500).json({ error: error.message });
    }
};

// ==================== ADDRESS MANAGEMENT ====================

// Get all addresses
exports.getAddresses = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('addresses');
        res.json(user.addresses);
    } catch (error) {
        console.error('Get addresses error:', error);
        res.status(500).json({ error: error.message });
    }
};

// Add new address
exports.addAddress = async (req, res) => {
    try {
        const { label, fullName, phone, address, isDefault } = req.body;
        
        const user = await User.findById(req.user._id);
        
        // If this is set as default, unset other defaults
        if (isDefault) {
            user.addresses.forEach(addr => addr.isDefault = false);
        }
        
        // If this is the first address, make it default
        const makeDefault = isDefault || user.addresses.length === 0;
        
        user.addresses.push({
            label,
            fullName,
            phone,
            address,
            isDefault: makeDefault
        });
        
        await user.save();
        
        res.status(201).json({ 
            message: 'Address added successfully', 
            addresses: user.addresses 
        });
    } catch (error) {
        console.error('Add address error:', error);
        res.status(500).json({ error: error.message });
    }
};

// Update address
exports.updateAddress = async (req, res) => {
    try {
        const { addressId } = req.params;
        const { label, fullName, phone, address, isDefault } = req.body;
        
        const user = await User.findById(req.user._id);
        const addressIndex = user.addresses.findIndex(
            addr => addr._id.toString() === addressId
        );
        
        if (addressIndex === -1) {
            return res.status(404).json({ message: 'Address not found' });
        }
        
        // If setting as default, unset other defaults
        if (isDefault) {
            user.addresses.forEach(addr => addr.isDefault = false);
        }
        
        // Update address
        if (label) user.addresses[addressIndex].label = label;
        if (fullName) user.addresses[addressIndex].fullName = fullName;
        if (phone) user.addresses[addressIndex].phone = phone;
        if (address) user.addresses[addressIndex].address = address;
        if (typeof isDefault !== 'undefined') {
            user.addresses[addressIndex].isDefault = isDefault;
        }
        
        await user.save();
        
        res.json({ 
            message: 'Address updated successfully', 
            addresses: user.addresses 
        });
    } catch (error) {
        console.error('Update address error:', error);
        res.status(500).json({ error: error.message });
    }
};

// Delete address
exports.deleteAddress = async (req, res) => {
    try {
        const { addressId } = req.params;
        
        const user = await User.findById(req.user._id);
        const addressIndex = user.addresses.findIndex(
            addr => addr._id.toString() === addressId
        );
        
        if (addressIndex === -1) {
            return res.status(404).json({ message: 'Address not found' });
        }
        
        const wasDefault = user.addresses[addressIndex].isDefault;
        user.addresses.splice(addressIndex, 1);
        
        // If deleted address was default, set first remaining address as default
        if (wasDefault && user.addresses.length > 0) {
            user.addresses[0].isDefault = true;
        }
        
        await user.save();
        
        res.json({ 
            message: 'Address deleted successfully', 
            addresses: user.addresses 
        });
    } catch (error) {
        console.error('Delete address error:', error);
        res.status(500).json({ error: error.message });
    }
};

// ==================== PAYMENT METHODS ====================

// Get payment methods
exports.getPaymentMethods = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('paymentMethods');
        res.json(user.paymentMethods);
    } catch (error) {
        console.error('Get payment methods error:', error);
        res.status(500).json({ error: error.message });
    }
};

// Add payment method
exports.addPaymentMethod = async (req, res) => {
    try {
        const { type, provider, lastFourDigits, accountName, expiryDate, isDefault } = req.body;
        
        const user = await User.findById(req.user._id);
        
        // If this is set as default, unset other defaults
        if (isDefault) {
            user.paymentMethods.forEach(method => method.isDefault = false);
        }
        
        // If this is the first payment method, make it default
        const makeDefault = isDefault || user.paymentMethods.length === 0;
        
        user.paymentMethods.push({
            type,
            provider,
            lastFourDigits,
            accountName,
            expiryDate,
            isDefault: makeDefault
        });
        
        await user.save();
        
        res.status(201).json({ 
            message: 'Payment method added successfully', 
            paymentMethods: user.paymentMethods 
        });
    } catch (error) {
        console.error('Add payment method error:', error);
        res.status(500).json({ error: error.message });
    }
};

// Delete payment method
exports.deletePaymentMethod = async (req, res) => {
    try {
        const { methodId } = req.params;
        
        const user = await User.findById(req.user._id);
        const methodIndex = user.paymentMethods.findIndex(
            method => method._id.toString() === methodId
        );
        
        if (methodIndex === -1) {
            return res.status(404).json({ message: 'Payment method not found' });
        }
        
        const wasDefault = user.paymentMethods[methodIndex].isDefault;
        user.paymentMethods.splice(methodIndex, 1);
        
        // If deleted method was default, set first remaining method as default
        if (wasDefault && user.paymentMethods.length > 0) {
            user.paymentMethods[0].isDefault = true;
        }
        
        await user.save();
        
        res.json({ 
            message: 'Payment method deleted successfully', 
            paymentMethods: user.paymentMethods 
        });
    } catch (error) {
        console.error('Delete payment method error:', error);
        res.status(500).json({ error: error.message });
    }
};

// ==================== PREFERENCES ====================

// Get preferences
exports.getPreferences = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('preferences');
        res.json(user.preferences);
    } catch (error) {
        console.error('Get preferences error:', error);
        res.status(500).json({ error: error.message });
    }
};

// Update preferences
exports.updatePreferences = async (req, res) => {
    try {
        const { notifications, language, currency, defaultPaymentMethod, defaultShippingAddress } = req.body;
        
        const user = await User.findById(req.user._id);
        
        if (notifications) {
            if (notifications.email) {
                user.preferences.notifications.email = {
                    ...user.preferences.notifications.email,
                    ...notifications.email
                };
            }
            if (notifications.push) {
                user.preferences.notifications.push = {
                    ...user.preferences.notifications.push,
                    ...notifications.push
                };
            }
        }
        
        if (language) user.preferences.language = language;
        if (currency) user.preferences.currency = currency;
        if (defaultPaymentMethod) user.preferences.defaultPaymentMethod = defaultPaymentMethod;
        if (defaultShippingAddress) user.preferences.defaultShippingAddress = defaultShippingAddress;
        
        await user.save();
        
        res.json({ 
            message: 'Preferences updated successfully', 
            preferences: user.preferences 
        });
    } catch (error) {
        console.error('Update preferences error:', error);
        res.status(500).json({ error: error.message });
    }
};

// ==================== BROWSING HISTORY ====================

// Get recent views
exports.getRecentViews = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 20;
        
        const user = await User.findById(req.user._id)
            .select('recentViews')
            .populate('recentViews.product', 'name price imageUrl brand stock');
        
        const recentViews = user.recentViews
            .slice(0, limit)
            .filter(view => view.product); // Filter out deleted products
        
        res.json(recentViews);
    } catch (error) {
        console.error('Get recent views error:', error);
        res.status(500).json({ error: error.message });
    }
};

// Add to recent views
exports.addRecentView = async (req, res) => {
    try {
        const { productId } = req.body;
        
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        
        const user = await User.findById(req.user._id);
        
        // Remove existing view of this product
        user.recentViews = user.recentViews.filter(
            view => view.product.toString() !== productId
        );
        
        // Add to beginning of array
        user.recentViews.unshift({
            product: productId,
            viewedAt: new Date()
        });
        
        // Keep only last 50 views
        user.recentViews = user.recentViews.slice(0, 50);
        
        await user.save();
        
        res.json({ message: 'Added to recent views' });
    } catch (error) {
        console.error('Add recent view error:', error);
        res.status(500).json({ error: error.message });
    }
};

// Get search history
exports.getSearchHistory = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 20;
        
        const user = await User.findById(req.user._id).select('searchHistory');
        const searchHistory = user.searchHistory.slice(0, limit);
        
        res.json(searchHistory);
    } catch (error) {
        console.error('Get search history error:', error);
        res.status(500).json({ error: error.message });
    }
};

// Add to search history
exports.addSearchHistory = async (req, res) => {
    try {
        const { query, filters } = req.body;
        
        const user = await User.findById(req.user._id);
        
        user.searchHistory.unshift({
            query,
            filters,
            searchedAt: new Date()
        });
        
        // Keep only last 50 searches
        user.searchHistory = user.searchHistory.slice(0, 50);
        
        await user.save();
        
        res.json({ message: 'Added to search history' });
    } catch (error) {
        console.error('Add search history error:', error);
        res.status(500).json({ error: error.message });
    }
};

// Clear search history
exports.clearSearchHistory = async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.user._id, { searchHistory: [] });
        res.json({ message: 'Search history cleared' });
    } catch (error) {
        console.error('Clear search history error:', error);
        res.status(500).json({ error: error.message });
    }
};

// Get comparison history
exports.getComparisonHistory = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        
        const user = await User.findById(req.user._id)
            .select('comparisonHistory')
            .populate('comparisonHistory.products', 'name price imageUrl brand');
        
        const comparisonHistory = user.comparisonHistory.slice(0, limit);
        
        res.json(comparisonHistory);
    } catch (error) {
        console.error('Get comparison history error:', error);
        res.status(500).json({ error: error.message });
    }
};

// Add to comparison history
exports.addComparisonHistory = async (req, res) => {
    try {
        const { productIds } = req.body;
        
        if (!productIds || productIds.length < 2) {
            return res.status(400).json({ message: 'At least 2 products required for comparison' });
        }
        
        const user = await User.findById(req.user._id);
        
        user.comparisonHistory.unshift({
            products: productIds,
            comparedAt: new Date()
        });
        
        // Keep only last 20 comparisons
        user.comparisonHistory = user.comparisonHistory.slice(0, 20);
        
        await user.save();
        
        res.json({ message: 'Added to comparison history' });
    } catch (error) {
        console.error('Add comparison history error:', error);
        res.status(500).json({ error: error.message });
    }
};

// ==================== WISHLIST ====================

// Get wishlist
exports.getWishlist = async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
            .select('wishlist')
            .populate('wishlist.product', 'name price imageUrl brand model specifications stock');
        
        // Filter out deleted products
        const wishlist = user.wishlist.filter(item => item.product);
        
        res.json(wishlist);
    } catch (error) {
        console.error('Get wishlist error:', error);
        res.status(500).json({ error: error.message });
    }
};

// Add to wishlist
exports.addToWishlist = async (req, res) => {
    try {
        const { productId } = req.body;
        
        if (!productId) {
            return res.status(400).json({ message: 'Product ID is required' });
        }
        
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        
        const user = await User.findById(req.user._id);
        
        // Check if already in wishlist
        const exists = user.wishlist.some(
            item => item.product.toString() === productId
        );
        
        if (exists) {
            return res.status(400).json({ message: 'Product already in wishlist' });
        }
        
        user.wishlist.push({
            product: productId,
            addedAt: new Date()
        });
        
        await user.save();
        
        res.json({ message: 'Added to wishlist' });
    } catch (error) {
        console.error('Add to wishlist error:', error);
        res.status(500).json({ error: error.message });
    }
};

// Remove from wishlist
exports.removeFromWishlist = async (req, res) => {
    try {
        const { productId } = req.params;
        
        const user = await User.findById(req.user._id);
        
        user.wishlist = user.wishlist.filter(
            item => item.product.toString() !== productId
        );
        
        await user.save();
        
        res.json({ message: 'Removed from wishlist' });
    } catch (error) {
        console.error('Remove from wishlist error:', error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = exports;
