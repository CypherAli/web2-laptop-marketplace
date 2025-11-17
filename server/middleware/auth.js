const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async function(req, res, next) {
    const token = req.header('Authorization')?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ 
            message: 'Không có token, vui lòng đăng nhập',
            code: 'NO_TOKEN'
        });
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Verify user still exists and is active
        const user = await User.findById(decoded.id).select('-password');
        if (!user) {
            return res.status(401).json({ 
                message: 'Người dùng không tồn tại',
                code: 'USER_NOT_FOUND'
            });
        }
        
        if (!user.isActive) {
            return res.status(403).json({ 
                message: 'Tài khoản đã bị khóa',
                code: 'ACCOUNT_INACTIVE'
            });
        }
        
        // For partners, check if approved
        if (user.role === 'partner' && !user.isApproved) {
            return res.status(403).json({ 
                message: 'Tài khoản Partner đang chờ duyệt từ Admin',
                code: 'PARTNER_NOT_APPROVED'
            });
        }
        
        req.user = {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            isApproved: user.isApproved,
            shopName: user.shopName
        };
        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ 
                message: 'Token đã hết hạn, vui lòng đăng nhập lại',
                code: 'TOKEN_EXPIRED'
            });
        }
        res.status(401).json({ 
            message: 'Token không hợp lệ',
            code: 'INVALID_TOKEN'
        });
    }
};