const express = require('express');
const router = express.Router();
const {
    getMyProducts,
    getMyStats,
    getRevenueByMonth,
    getRevenueByBrand,
    toggleProductStatus
} = require('../controllers/partnerController');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const User = require('../models/User');

// Routes accessible by partner and admin
const partnerOrAdmin = authorize('partner', 'admin');

router.get('/my-products', auth, partnerOrAdmin, getMyProducts);
router.get('/stats', auth, partnerOrAdmin, getMyStats);
router.get('/revenue', auth, partnerOrAdmin, getRevenueByMonth);
router.get('/revenue-by-brand', auth, partnerOrAdmin, getRevenueByBrand);
router.patch('/products/:id/toggle-status', auth, partnerOrAdmin, toggleProductStatus);

// Get list of active partners (for chat widget)
router.get('/list-active', async (req, res) => {
    try {
        const partners = await User.find({
            role: 'partner',
            isActive: true,
            isApproved: true
        }).select('username email shopName phone createdAt');
        
        const formattedPartners = partners.map(partner => ({
            _id: partner._id,
            name: partner.shopName || partner.username,
            email: partner.email,
            phone: partner.phone || 'Chưa cập nhật',
            joinedDate: partner.createdAt
        }));
        
        res.json({
            success: true,
            partners: formattedPartners,
            count: formattedPartners.length
        });
    } catch (error) {
        console.error('Error fetching active partners:', error);
        res.status(500).json({
            success: false,
            message: 'Không thể tải danh sách partners',
            error: error.message
        });
    }
});

module.exports = router;
