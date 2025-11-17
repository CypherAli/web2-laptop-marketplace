const Review = require('../models/Review');
const Product = require('../models/Product');
const Order = require('../models/Order');

// Get all reviews for a product
exports.getProductReviews = async (req, res) => {
    try {
        const { productId } = req.params;
        const { 
            page = 1, 
            limit = 10, 
            sortBy = 'recent', 
            rating,
            verified 
        } = req.query;

        const filter = { 
            product: productId,
            isApproved: true 
        };
        
        if (rating) {
            filter.rating = Number(rating);
        }
        
        if (verified === 'true') {
            filter.isVerifiedPurchase = true;
        }

        let sort = {};
        switch(sortBy) {
            case 'recent':
                sort = { createdAt: -1 };
                break;
            case 'oldest':
                sort = { createdAt: 1 };
                break;
            case 'helpful':
                sort = { helpfulCount: -1 };
                break;
            case 'rating_high':
                sort = { rating: -1 };
                break;
            case 'rating_low':
                sort = { rating: 1 };
                break;
            default:
                sort = { createdAt: -1 };
        }

        const pageNum = Number(page);
        const limitNum = Number(limit);
        const skip = (pageNum - 1) * limitNum;

        const reviews = await Review.find(filter)
            .populate('user', 'username email')
            .populate('sellerResponse.respondedBy', 'username shopName')
            .sort(sort)
            .skip(skip)
            .limit(limitNum);

        const totalReviews = await Review.countDocuments(filter);
        const totalPages = Math.ceil(totalReviews / limitNum);

        res.json({
            reviews,
            currentPage: pageNum,
            totalPages,
            totalReviews
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Create a review (authenticated users only)
exports.createReview = async (req, res) => {
    try {
        const { productId } = req.params;
        const { rating, title, comment, pros, cons, images } = req.body;
        const userId = req.user.id;

        // Check if product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Check if user already reviewed this product
        const existingReview = await Review.findOne({
            product: productId,
            user: userId
        });

        if (existingReview) {
            return res.status(400).json({ 
                message: 'You have already reviewed this product' 
            });
        }

        // Check if this is a verified purchase
        const order = await Order.findOne({
            user: userId,
            'items.product': productId,
            status: 'delivered'
        });

        const reviewData = {
            product: productId,
            user: userId,
            rating,
            title,
            comment,
            pros: pros || [],
            cons: cons || [],
            images: images || [],
            isVerifiedPurchase: !!order,
            order: order ? order._id : null,
            isApproved: true // Auto-approve for now, can add moderation later
        };

        const review = new Review(reviewData);
        await review.save();

        // Populate user info before sending response
        await review.populate('user', 'username email');

        res.status(201).json({
            message: 'Review created successfully',
            review
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update a review (only by review owner)
exports.updateReview = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const { rating, title, comment, pros, cons, images } = req.body;
        const userId = req.user.id;

        const review = await Review.findById(reviewId);

        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        // Check ownership
        if (review.user.toString() !== userId) {
            return res.status(403).json({ 
                message: 'You can only update your own reviews' 
            });
        }

        // Update fields
        if (rating) review.rating = rating;
        if (title) review.title = title;
        if (comment) review.comment = comment;
        if (pros) review.pros = pros;
        if (cons) review.cons = cons;
        if (images) review.images = images;

        await review.save();
        await review.populate('user', 'username email');

        res.json({
            message: 'Review updated successfully',
            review
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Delete a review (only by review owner or admin)
exports.deleteReview = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const userId = req.user.id;
        const userRole = req.user.role;

        const review = await Review.findById(reviewId);

        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        // Check ownership or admin
        if (review.user.toString() !== userId && userRole !== 'admin') {
            return res.status(403).json({ 
                message: 'You can only delete your own reviews' 
            });
        }

        await review.remove();

        res.json({ message: 'Review deleted successfully' });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Mark review as helpful
exports.markHelpful = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const userId = req.user.id;

        const review = await Review.findById(reviewId);

        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        // Check if user already marked as helpful
        const alreadyMarked = review.helpfulBy.includes(userId);

        if (alreadyMarked) {
            // Remove helpful mark
            review.helpfulBy = review.helpfulBy.filter(
                id => id.toString() !== userId
            );
            review.helpfulCount = Math.max(0, review.helpfulCount - 1);
        } else {
            // Add helpful mark
            review.helpfulBy.push(userId);
            review.helpfulCount += 1;
        }

        await review.save();

        res.json({
            message: alreadyMarked ? 'Helpful mark removed' : 'Marked as helpful',
            helpfulCount: review.helpfulCount
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Add seller response (partner/admin only)
exports.addSellerResponse = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const { comment } = req.body;
        const userId = req.user.id;

        const review = await Review.findById(reviewId).populate('product');

        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        // Check if user is the product owner or admin
        const isOwner = review.product.createdBy.toString() === userId;
        const isAdmin = req.user.role === 'admin';

        if (!isOwner && !isAdmin) {
            return res.status(403).json({ 
                message: 'Only product owner or admin can respond to reviews' 
            });
        }

        review.sellerResponse = {
            comment,
            respondedBy: userId,
            respondedAt: new Date()
        };

        await review.save();
        await review.populate('sellerResponse.respondedBy', 'username shopName');

        res.json({
            message: 'Seller response added successfully',
            review
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get user's reviews
exports.getUserReviews = async (req, res) => {
    try {
        const userId = req.user.id;
        const { page = 1, limit = 10 } = req.query;

        const pageNum = Number(page);
        const limitNum = Number(limit);
        const skip = (pageNum - 1) * limitNum;

        const reviews = await Review.find({ user: userId })
            .populate('product', 'name brand imageUrl price')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limitNum);

        const totalReviews = await Review.countDocuments({ user: userId });
        const totalPages = Math.ceil(totalReviews / limitNum);

        res.json({
            reviews,
            currentPage: pageNum,
            totalPages,
            totalReviews
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Moderate review (admin only)
exports.moderateReview = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const { isApproved } = req.body;
        const adminId = req.user.id;

        const review = await Review.findById(reviewId);

        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        review.isApproved = isApproved;
        review.moderatedBy = adminId;
        review.moderatedAt = new Date();

        await review.save();

        res.json({
            message: `Review ${isApproved ? 'approved' : 'rejected'} successfully`,
            review
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
