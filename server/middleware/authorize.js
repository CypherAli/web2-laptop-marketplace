module.exports = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ 
                message: 'Vui lòng đăng nhập để tiếp tục',
                code: 'NOT_AUTHENTICATED'
            });
        }
        
        if (!roles.includes(req.user.role)) {
            const roleNames = {
                'client': 'Khách hàng',
                'partner': 'Đối tác',
                'admin': 'Quản trị viên'
            };
            
            return res.status(403).json({ 
                message: `Chức năng này chỉ dành cho: ${roles.map(r => roleNames[r]).join(', ')}`,
                code: 'INSUFFICIENT_PERMISSIONS',
                requiredRoles: roles,
                userRole: req.user.role
            });
        }
        next();
    };
};