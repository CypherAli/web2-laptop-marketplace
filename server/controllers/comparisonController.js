const Comparison = require('../models/Comparison');
const Product = require('../models/Product');

// Create or update comparison
exports.saveComparison = async (req, res) => {
    try {
        const { productIds, isPublic } = req.body;
        const userId = req.user ? req.user.id : null;
        const sessionId = req.headers['x-session-id'];

        if (!productIds || productIds.length < 2) {
            return res.status(400).json({ 
                message: 'Please select at least 2 products to compare' 
            });
        }

        if (productIds.length > 4) {
            return res.status(400).json({ 
                message: 'Cannot compare more than 4 products' 
            });
        }

        // Verify all products exist
        const products = await Product.find({ _id: { $in: productIds } });
        if (products.length !== productIds.length) {
            return res.status(404).json({ 
                message: 'Some products not found' 
            });
        }

        // Find existing comparison or create new one
        let comparison;
        if (userId) {
            comparison = await Comparison.findOne({ user: userId });
        } else if (sessionId) {
            comparison = await Comparison.findOne({ sessionId });
        }

        if (comparison) {
            comparison.products = productIds;
            comparison.isPublic = isPublic || false;
            await comparison.save();
        } else {
            comparison = new Comparison({
                user: userId,
                sessionId: sessionId,
                products: productIds,
                isPublic: isPublic || false
            });
            await comparison.save();
        }

        await comparison.populate('products');

        res.json({
            message: 'Comparison saved successfully',
            comparison
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get comparison details
exports.getComparison = async (req, res) => {
    try {
        const { comparisonId } = req.params;

        const comparison = await Comparison.findById(comparisonId)
            .populate('products')
            .populate('user', 'username');

        if (!comparison) {
            return res.status(404).json({ message: 'Comparison not found' });
        }

        // Increment view count
        comparison.viewCount += 1;
        await comparison.save();

        res.json(comparison);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get comparison by slug (for public sharing)
exports.getComparisonBySlug = async (req, res) => {
    try {
        const { slug } = req.params;

        const comparison = await Comparison.findOne({ slug, isPublic: true })
            .populate('products')
            .populate('user', 'username');

        if (!comparison) {
            return res.status(404).json({ message: 'Comparison not found' });
        }

        // Increment view count
        comparison.viewCount += 1;
        await comparison.save();

        res.json(comparison);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Compare products directly (without saving)
exports.compareProducts = async (req, res) => {
    try {
        const { productIds } = req.body;

        if (!productIds || productIds.length < 2) {
            return res.status(400).json({ 
                message: 'Please provide at least 2 product IDs' 
            });
        }

        if (productIds.length > 4) {
            return res.status(400).json({ 
                message: 'Cannot compare more than 4 products' 
            });
        }

        const products = await Product.find({ _id: { $in: productIds } })
            .populate('createdBy', 'username shopName');

        if (products.length !== productIds.length) {
            return res.status(404).json({ 
                message: 'Some products not found' 
            });
        }

        // Build comparison data
        const comparisonData = {
            products: products,
            specifications: buildSpecificationComparison(products),
            pricing: buildPricingComparison(products),
            ratings: buildRatingComparison(products)
        };

        res.json(comparisonData);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Delete comparison
exports.deleteComparison = async (req, res) => {
    try {
        const { comparisonId } = req.params;
        const userId = req.user ? req.user.id : null;
        const sessionId = req.headers['x-session-id'];

        const comparison = await Comparison.findById(comparisonId);

        if (!comparison) {
            return res.status(404).json({ message: 'Comparison not found' });
        }

        // Check ownership
        const isOwner = (userId && comparison.user && comparison.user.toString() === userId) ||
                       (sessionId && comparison.sessionId === sessionId);

        if (!isOwner && req.user.role !== 'admin') {
            return res.status(403).json({ 
                message: 'You can only delete your own comparisons' 
            });
        }

        await comparison.remove();

        res.json({ message: 'Comparison deleted successfully' });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Helper function to build specification comparison
function buildSpecificationComparison(products) {
    const specs = {
        processor: [],
        ram: [],
        storage: [],
        graphics: [],
        display: [],
        weight: [],
        battery: [],
        operatingSystem: []
    };

    products.forEach(product => {
        Object.keys(specs).forEach(key => {
            specs[key].push(product.specifications[key] || 'N/A');
        });
    });

    return specs;
}

// Helper function to build pricing comparison
function buildPricingComparison(products) {
    return {
        prices: products.map(p => p.price),
        originalPrices: products.map(p => p.originalPrice || p.price),
        discounts: products.map(p => {
            if (p.originalPrice && p.originalPrice > p.price) {
                return Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100);
            }
            return 0;
        }),
        lowestPrice: Math.min(...products.map(p => p.price)),
        highestPrice: Math.max(...products.map(p => p.price))
    };
}

// Helper function to build rating comparison
function buildRatingComparison(products) {
    return products.map(p => ({
        productId: p._id,
        average: p.rating.average,
        count: p.rating.count
    }));
}

// Get user's saved comparisons
exports.getUserComparisons = async (req, res) => {
    try {
        const userId = req.user.id;

        const comparisons = await Comparison.find({ user: userId })
            .populate('products', 'name brand imageUrl price')
            .sort({ updatedAt: -1 });

        res.json(comparisons);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
