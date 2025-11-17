const { Voucher, UserVoucher } = require('../models/Voucher');
const User = require('../models/User');
const Notification = require('../models/Notification');

/**
 * VOUCHER CONTROLLER
 * Quản lý mã giảm giá
 */

// ==================== USER VOUCHER MANAGEMENT ====================

// Get user's vouchers
exports.getMyVouchers = async (req, res) => {
    try {
        const { status, page = 1, limit = 20 } = req.query;
        
        const filter = { user: req.user.id };
        if (status) filter.status = status;
        
        const skip = (parseInt(page) - 1) * parseInt(limit);
        
        const userVouchers = await UserVoucher.find(filter)
            .populate('voucher')
            .sort({ obtainedAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));
        
        const total = await UserVoucher.countDocuments(filter);
        
        res.json({
            vouchers: userVouchers,
            currentPage: parseInt(page),
            totalPages: Math.ceil(total / parseInt(limit)),
            total
        });
    } catch (error) {
        console.error('Get my vouchers error:', error);
        res.status(500).json({ error: error.message });
    }
};

// Get available public vouchers
exports.getAvailableVouchers = async (req, res) => {
    try {
        const now = new Date();
        
        // Find public vouchers that are valid
        const vouchers = await Voucher.find({
            assignedTo: 'public',
            'validity.isActive': true,
            'validity.startDate': { $lte: now },
            'validity.endDate': { $gte: now },
            $or: [
                { 'usageLimit.totalLimit': null },
                { $expr: { $lt: ['$usageLimit.currentUsage', '$usageLimit.totalLimit'] } }
            ]
        }).sort({ createdAt: -1 });
        
        // Filter out vouchers user already has
        const userVoucherIds = await UserVoucher.find({
            user: req.user.id,
            status: { $in: ['available', 'used'] }
        }).distinct('voucher');
        
        const availableVouchers = vouchers.filter(
            voucher => !userVoucherIds.some(id => id.equals(voucher._id))
        );
        
        res.json(availableVouchers);
    } catch (error) {
        console.error('Get available vouchers error:', error);
        res.status(500).json({ error: error.message });
    }
};

// Collect/Claim a voucher
exports.collectVoucher = async (req, res) => {
    try {
        const { voucherId, code } = req.body;
        
        let voucher;
        
        // Find voucher by ID or code
        if (voucherId) {
            voucher = await Voucher.findById(voucherId);
        } else if (code) {
            voucher = await Voucher.findOne({ code: code.toUpperCase() });
        } else {
            return res.status(400).json({ message: 'Voucher ID or code required' });
        }
        
        if (!voucher) {
            return res.status(404).json({ message: 'Voucher not found' });
        }
        
        // Check if voucher is valid
        if (!voucher.isValid) {
            return res.status(400).json({ message: 'Voucher is not valid or has expired' });
        }
        
        // Check if user already has this voucher
        const existingUserVoucher = await UserVoucher.findOne({
            user: req.user.id,
            voucher: voucher._id,
            status: { $in: ['available', 'used'] }
        });
        
        if (existingUserVoucher) {
            return res.status(400).json({ message: 'You already have this voucher' });
        }
        
        // Check if voucher is for specific users
        if (voucher.assignedTo === 'specific_users') {
            if (!voucher.specificUsers.some(userId => userId.equals(req.user.id))) {
                return res.status(403).json({ message: 'This voucher is not available for you' });
            }
        }
        
        // Create user voucher
        const userVoucher = new UserVoucher({
            user: req.user.id,
            voucher: voucher._id,
            status: 'available',
            obtainedFrom: 'promotion',
            expiresAt: voucher.validity.endDate
        });
        
        await userVoucher.save();
        
        // Send notification
        await Notification.createNotification({
            user: req.user.id,
            type: 'voucher_received',
            title: '🎉 Bạn đã nhận được voucher!',
            message: `Voucher "${voucher.name}" đã được thêm vào ví của bạn`,
            actionUrl: '/profile/vouchers',
            actionText: 'Xem voucher',
            priority: 'medium'
        });
        
        res.status(201).json({
            message: 'Voucher collected successfully',
            userVoucher: await userVoucher.populate('voucher')
        });
    } catch (error) {
        console.error('Collect voucher error:', error);
        res.status(500).json({ error: error.message });
    }
};

// Apply voucher to order
exports.applyVoucher = async (req, res) => {
    try {
        const { voucherCode, orderAmount, productIds } = req.body;
        
        if (!voucherCode || !orderAmount) {
            return res.status(400).json({ message: 'Voucher code and order amount required' });
        }
        
        // Find voucher
        const voucher = await Voucher.findOne({ code: voucherCode.toUpperCase() });
        if (!voucher) {
            return res.status(404).json({ message: 'Voucher not found' });
        }
        
        // Check if user has this voucher
        const userVoucher = await UserVoucher.findOne({
            user: req.user.id,
            voucher: voucher._id,
            status: 'available'
        });
        
        if (!userVoucher) {
            return res.status(403).json({ message: 'You do not have this voucher or it has been used' });
        }
        
        // Get user info for tier checking
        const user = await User.findById(req.user.id);
        
        // Check if voucher can be used
        const canUse = voucher.canBeUsedBy(user, orderAmount);
        if (!canUse.valid) {
            return res.status(400).json({ message: canUse.reason });
        }
        
        // Calculate discount
        const discount = voucher.calculateDiscount(orderAmount);
        
        // Prepare response
        const response = {
            valid: true,
            voucherCode: voucher.code,
            voucherName: voucher.name,
            discountType: voucher.discountType,
            discountValue: voucher.discountValue,
            discount,
            finalAmount: orderAmount - discount,
            freeShipping: voucher.discountType === 'free_shipping'
        };
        
        res.json(response);
    } catch (error) {
        console.error('Apply voucher error:', error);
        res.status(500).json({ error: error.message });
    }
};

// Mark voucher as used (called after order completion)
exports.useVoucher = async (req, res) => {
    try {
        const { voucherCode, orderId, discountApplied, orderAmount } = req.body;
        
        const voucher = await Voucher.findOne({ code: voucherCode.toUpperCase() });
        if (!voucher) {
            return res.status(404).json({ message: 'Voucher not found' });
        }
        
        const userVoucher = await UserVoucher.findOne({
            user: req.user.id,
            voucher: voucher._id,
            status: 'available'
        });
        
        if (!userVoucher) {
            return res.status(404).json({ message: 'User voucher not found' });
        }
        
        // Update user voucher
        userVoucher.status = 'used';
        userVoucher.usageHistory.push({
            order: orderId,
            usedAt: new Date(),
            discountApplied,
            orderAmount
        });
        
        await userVoucher.save();
        
        // Update voucher usage count
        voucher.usageLimit.currentUsage += 1;
        await voucher.save();
        
        res.json({ message: 'Voucher used successfully' });
    } catch (error) {
        console.error('Use voucher error:', error);
        res.status(500).json({ error: error.message });
    }
};

// ==================== ADMIN VOUCHER MANAGEMENT ====================

// Create voucher (Admin only)
exports.createVoucher = async (req, res) => {
    try {
        const voucherData = {
            ...req.body,
            createdBy: req.user.id
        };
        
        const voucher = new Voucher(voucherData);
        await voucher.save();
        
        res.status(201).json({
            message: 'Voucher created successfully',
            voucher
        });
    } catch (error) {
        console.error('Create voucher error:', error);
        res.status(500).json({ error: error.message });
    }
};

// Update voucher (Admin only)
exports.updateVoucher = async (req, res) => {
    try {
        const { voucherId } = req.params;
        
        const voucher = await Voucher.findByIdAndUpdate(
            voucherId,
            req.body,
            { new: true, runValidators: true }
        );
        
        if (!voucher) {
            return res.status(404).json({ message: 'Voucher not found' });
        }
        
        res.json({
            message: 'Voucher updated successfully',
            voucher
        });
    } catch (error) {
        console.error('Update voucher error:', error);
        res.status(500).json({ error: error.message });
    }
};

// Get all vouchers (Admin only)
exports.getAllVouchers = async (req, res) => {
    try {
        const { page = 1, limit = 20, isActive } = req.query;
        
        const filter = {};
        if (typeof isActive !== 'undefined') {
            filter['validity.isActive'] = isActive === 'true';
        }
        
        const skip = (parseInt(page) - 1) * parseInt(limit);
        
        const vouchers = await Voucher.find(filter)
            .populate('createdBy', 'username email')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));
        
        const total = await Voucher.countDocuments(filter);
        
        res.json({
            vouchers,
            currentPage: parseInt(page),
            totalPages: Math.ceil(total / parseInt(limit)),
            total
        });
    } catch (error) {
        console.error('Get all vouchers error:', error);
        res.status(500).json({ error: error.message });
    }
};

// Deactivate voucher (Admin only)
exports.deactivateVoucher = async (req, res) => {
    try {
        const { voucherId } = req.params;
        
        const voucher = await Voucher.findByIdAndUpdate(
            voucherId,
            { 'validity.isActive': false },
            { new: true }
        );
        
        if (!voucher) {
            return res.status(404).json({ message: 'Voucher not found' });
        }
        
        res.json({
            message: 'Voucher deactivated successfully',
            voucher
        });
    } catch (error) {
        console.error('Deactivate voucher error:', error);
        res.status(500).json({ error: error.message });
    }
};

// Grant voucher to specific users (Admin only)
exports.grantVoucherToUsers = async (req, res) => {
    try {
        const { voucherId, userIds, obtainedFrom } = req.body;
        
        const voucher = await Voucher.findById(voucherId);
        if (!voucher) {
            return res.status(404).json({ message: 'Voucher not found' });
        }
        
        const results = [];
        
        for (const userId of userIds) {
            // Check if user already has this voucher
            const existing = await UserVoucher.findOne({
                user: userId,
                voucher: voucherId,
                status: { $in: ['available', 'used'] }
            });
            
            if (!existing) {
                const userVoucher = new UserVoucher({
                    user: userId,
                    voucher: voucherId,
                    status: 'available',
                    obtainedFrom: obtainedFrom || 'admin_grant',
                    expiresAt: voucher.validity.endDate
                });
                
                await userVoucher.save();
                results.push({ userId, status: 'granted' });
                
                // Send notification
                await Notification.createNotification({
                    user: userId,
                    type: 'voucher_received',
                    title: '🎁 Bạn nhận được quà tặng!',
                    message: `Admin đã tặng bạn voucher "${voucher.name}"`,
                    actionUrl: '/profile/vouchers',
                    actionText: 'Xem ngay',
                    priority: 'high'
                });
            } else {
                results.push({ userId, status: 'already_has' });
            }
        }
        
        res.json({
            message: 'Vouchers granted',
            results
        });
    } catch (error) {
        console.error('Grant voucher error:', error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = exports;
