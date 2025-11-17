const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
    saveComparison,
    getComparison,
    getComparisonBySlug,
    compareProducts,
    deleteComparison,
    getUserComparisons
} = require('../controllers/comparisonController');

// Public routes
router.post('/compare', compareProducts); // Direct comparison without saving
router.get('/slug/:slug', getComparisonBySlug); // Get public comparison by slug

// Protected routes (optional auth - works for both logged in and guest users)
router.post('/save', auth, saveComparison); // Save comparison
router.get('/:comparisonId', getComparison); // Get comparison by ID
router.delete('/:comparisonId', deleteComparison); // Delete comparison

// Authenticated user routes
router.get('/my/saved', auth, getUserComparisons); // Get user's saved comparisons

module.exports = router;
