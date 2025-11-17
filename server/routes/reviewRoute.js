const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const {
    getProductReviews,
    createReview,
    updateReview,
    deleteReview,
    markHelpful,
    addSellerResponse,
    getUserReviews,
    moderateReview
} = require('../controllers/reviewController');

// Public routes
router.get('/product/:productId', getProductReviews);

// Protected routes (authenticated users)
router.post('/product/:productId', auth, createReview);
router.put('/:reviewId', auth, updateReview);
router.delete('/:reviewId', auth, deleteReview);
router.post('/:reviewId/helpful', auth, markHelpful);
router.get('/my-reviews', auth, getUserReviews);

// Partner/Admin routes
router.post('/:reviewId/response', auth, authorize(['partner', 'admin']), addSellerResponse);

// Admin only routes
router.put('/:reviewId/moderate', auth, authorize(['admin']), moderateReview);

module.exports = router;
