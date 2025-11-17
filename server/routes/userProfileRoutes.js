const express = require('express');
const router = express.Router();
const userProfileController = require('../controllers/userProfileController');
const { protect } = require('../middleware/authMiddleware');

// All routes require authentication
router.use(protect);

// ==================== PROFILE ====================
router.get('/profile', userProfileController.getProfile);
router.put('/profile', userProfileController.updateProfile);
router.get('/profile/stats', userProfileController.getUserStats);

// ==================== ADDRESSES ====================
router.get('/addresses', userProfileController.getAddresses);
router.post('/addresses', userProfileController.addAddress);
router.put('/addresses/:addressId', userProfileController.updateAddress);
router.delete('/addresses/:addressId', userProfileController.deleteAddress);

// ==================== PAYMENT METHODS ====================
router.get('/payment-methods', userProfileController.getPaymentMethods);
router.post('/payment-methods', userProfileController.addPaymentMethod);
router.delete('/payment-methods/:methodId', userProfileController.deletePaymentMethod);

// ==================== PREFERENCES ====================
router.get('/preferences', userProfileController.getPreferences);
router.put('/preferences', userProfileController.updatePreferences);

// ==================== WISHLIST ====================
router.get('/wishlist', userProfileController.getWishlist);
router.post('/wishlist', userProfileController.addToWishlist);
router.delete('/wishlist/:productId', userProfileController.removeFromWishlist);

// ==================== BROWSING HISTORY ====================
router.get('/recent-views', userProfileController.getRecentViews);
router.post('/recent-views', userProfileController.addRecentView);

router.get('/search-history', userProfileController.getSearchHistory);
router.post('/search-history', userProfileController.addSearchHistory);
router.delete('/search-history', userProfileController.clearSearchHistory);

router.get('/comparison-history', userProfileController.getComparisonHistory);
router.post('/comparison-history', userProfileController.addComparisonHistory);

module.exports = router;
