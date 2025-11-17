const Product = require('../models/Product');

/**
 * Middleware to check if the authenticated user owns the resource
 * Used for Partner ownership validation (can only edit/delete their own products)
 */
const isOwner = async (req, res, next) => {
    try {
        const productId = req.params.id;
        const userId = req.user.id;
        const userRole = req.user.role;

        // Admin can access all products
        if (userRole === 'admin') {
            return next();
        }

        // Find the product
        const product = await Product.findById(productId);
        
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Check if user is the creator
        if (product.createdBy.toString() !== userId) {
            return res.status(403).json({ 
                message: 'Access denied. You can only modify your own products.' 
            });
        }

        // User is the owner, proceed
        next();
    } catch (error) {
        console.error('Ownership check error:', error);
        res.status(500).json({ message: 'Server error during ownership verification' });
    }
};

module.exports = isOwner;
