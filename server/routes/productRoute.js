const express = require('express');
const router = express.Router();
const { 
    getAllProducts, 
    getProductById, 
    createProduct, 
    updateProduct, 
    deleteProduct,
    getAllBrands
} = require('../controllers/productController');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const isOwner = require('../middleware/isOwner');

// Public Routes - Anyone can view products
router.get('/', getAllProducts);
router.get('/brands', getAllBrands); // Must be BEFORE /:id to avoid conflict

// Protected Routes - Partner and Admin can create/modify products
const partnerAdmin = authorize('partner', 'admin');

// Get my products (Partner's own products)
router.get('/my-products', auth, partnerAdmin, async (req, res) => {
    try {
        const Product = require('../models/Product');
        const products = await Product.find({ createdBy: req.user.id })
            .sort({ createdAt: -1 });
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create product - Partner/Admin only
router.post('/', auth, partnerAdmin, createProduct);

// Must be AFTER specific routes like /my-products
router.get('/:id', getProductById);

// Update/Delete - Partner can only modify their own products, Admin can modify all
router.put('/:id', auth, partnerAdmin, isOwner, updateProduct);
router.delete('/:id', auth, partnerAdmin, isOwner, deleteProduct);

module.exports = router;