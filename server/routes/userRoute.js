const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

// @desc    Get first admin user ID (for chat)
// @route   GET /api/user/get-admin
// @access  Public (needed for chat initialization)
router.get('/get-admin', async (req, res) => {
    try {
        const admin = await User.findOne({ role: 'admin', isActive: true }).select('_id username email');
        
        if (!admin) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy admin'
            });
        }
        
        res.json({
            success: true,
            adminId: admin._id,
            adminUsername: admin.username
        });
    } catch (error) {
        console.error('Get admin error:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy thông tin admin'
        });
    }
});

// @desc    Get user profile
// @route   GET /api/user/profile
// @access  Private
router.get('/profile', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy người dùng'
            });
        }
        
        res.json({
            success: true,
            user
        });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy thông tin người dùng'
        });
    }
});

// @desc    Update user profile
// @route   PUT /api/user/profile
// @access  Private
router.put('/profile', auth, async (req, res) => {
    try {
        const updates = req.body;
        
        // Don't allow updating sensitive fields
        delete updates.password;
        delete updates.role;
        delete updates.isApproved;
        
        const user = await User.findByIdAndUpdate(
            req.user.id,
            { $set: updates },
            { new: true, runValidators: true }
        ).select('-password');
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy người dùng'
            });
        }
        
        res.json({
            success: true,
            message: 'Cập nhật thông tin thành công',
            user
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi cập nhật thông tin'
        });
    }
});

module.exports = router;
