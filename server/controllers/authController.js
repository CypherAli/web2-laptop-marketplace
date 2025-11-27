const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

// Store reset codes temporarily (in production, use Redis or database)
const resetCodes = new Map();

exports.register = async (req, res) => {
    try {
        const { username, email, password, role, shopName } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ message: "Tên, email và mật khẩu là bắt buộc" });
        }
        let user = await User.findOne({ $or: [{ email }, { username }] });
        if (user) return res.status(400).json({ message: "Email hoặc tên người dùng đã tồn tại" });
        const userData = { username, email, password, role: role || "client" };
        if (role === "partner") {
            if (!shopName) return res.status(400).json({ message: "Tên cửa hàng là bắt buộc" });
            userData.shopName = shopName;
            userData.isApproved = false;
        }
        user = new User(userData);
        await user.save();
        res.status(201).json({ message: "Đăng ký thành công!", user: { id: user._id, username: user.username, email: user.email, role: user.role } });
    } catch (err) {
        res.status(500).json({ message: "Lỗi server", error: err.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Validate input
        if (!email || !password) {
            return res.status(400).json({ message: "Email và mật khẩu là bắt buộc" });
        }
        
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Email hoặc mật khẩu không đúng" });
        }
        
        // Check if account is active
        if (!user.isActive) {
            return res.status(403).json({ message: "Tài khoản đã bị khóa" });
        }
        
        // Compare password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: "Email hoặc mật khẩu không đúng" });
        }
        
        // Generate JWT token (include isApproved for partners)
        const token = jwt.sign(
            { 
                id: user._id, 
                role: user.role, 
                username: user.username, 
                email: user.email,
                isApproved: user.isApproved || true // Include approval status
            }, 
            process.env.JWT_SECRET, 
            { expiresIn: "24h" }
        );
        
        // Send response (allow partner login even if not approved)
        const responseData = { 
            token, 
            user: { 
                id: user._id, 
                username: user.username, 
                email: user.email, 
                role: user.role, 
                shopName: user.shopName, 
                avatar: user.avatar,
                isApproved: user.isApproved
            }, 
            message: "Đăng nhập thành công!" 
        };
        
        // Add warning if partner not approved
        if (user.role === "partner" && !user.isApproved) {
            responseData.warning = "Tài khoản Partner đang chờ phê duyệt. Một số tính năng có thể bị giới hạn.";
        }
        
        res.json(responseData);
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ message: "Lỗi server", error: err.message });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { name, username, email, phone, address, shopName, currentPassword, newPassword } = req.body;
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "Người dùng không tồn tại" });
        if (email && email !== user.email) {
            const exists = await User.findOne({ email, _id: { $ne: userId } });
            if (exists) return res.status(400).json({ message: "Email đã được sử dụng" });
        }
        if (username && username !== user.username) {
            const exists = await User.findOne({ username, _id: { $ne: userId } });
            if (exists) return res.status(400).json({ message: "Tên đăng nhập đã tồn tại" });
        }
        if (name) user.name = name.trim();
        if (username) user.username = username.trim();
        if (email) user.email = email.trim();
        if (phone !== undefined) user.phone = phone.trim();
        if (address !== undefined) user.address = address.trim();
        if (shopName !== undefined && user.role === "partner") user.shopName = shopName.trim();
        // Update password if provided
        if (currentPassword && newPassword) {
            const isMatch = await user.comparePassword(currentPassword);
            if (!isMatch) {
                return res.status(400).json({ message: "Mật khẩu hiện tại không đúng" });
            }
            if (newPassword.length < 6) {
                return res.status(400).json({ message: "Mật khẩu mới phải có ít nhất 6 ký tự" });
            }
            user.password = newPassword;
        }
        if (req.file) user.avatar = "/uploads/avatars/" + req.file.filename;
        await user.save();
        
        console.log('✅ Profile updated successfully');
        console.log('   User ID:', user._id);
        console.log('   Avatar:', user.avatar);
        
        res.json({ 
            success: true,
            message: "Cập nhật hồ sơ thành công!", 
            user: { 
                id: user._id, 
                name: user.name, 
                username: user.username, 
                email: user.email, 
                phone: user.phone, 
                address: user.address, 
                role: user.role, 
                shopName: user.shopName, 
                avatar: user.avatar 
            } 
        });
    } catch (err) {
        res.status(500).json({ message: "Lỗi server", error: err.message });
    }
};

// Forgot Password - Send reset code
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        
        if (!email) {
            return res.status(400).json({ message: "Email là bắt buộc" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "Email không tồn tại trong hệ thống" });
        }

        // Generate 6-digit code
        const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
        
        // Store code with 15 minutes expiry
        resetCodes.set(email, {
            code: resetCode,
            expiresAt: Date.now() + 15 * 60 * 1000 // 15 minutes
        });

        // In production, send email here
        console.log(`Reset code for ${email}: ${resetCode}`);
        
        // For development, return code in response (remove in production!)
        res.json({ 
            message: "Mã xác nhận đã được gửi đến email của bạn",
            resetCode: resetCode // Remove this in production
        });
    } catch (err) {
        res.status(500).json({ message: "Lỗi server", error: err.message });
    }
};

// Reset Password
exports.resetPassword = async (req, res) => {
    try {
        const { email, resetCode, newPassword } = req.body;
        
        if (!email || !resetCode || !newPassword) {
            return res.status(400).json({ message: "Vui lòng điền đầy đủ thông tin" });
        }

        // Check if code exists and not expired
        const storedData = resetCodes.get(email);
        if (!storedData) {
            return res.status(400).json({ message: "Mã xác nhận không hợp lệ hoặc đã hết hạn" });
        }

        if (Date.now() > storedData.expiresAt) {
            resetCodes.delete(email);
            return res.status(400).json({ message: "Mã xác nhận đã hết hạn" });
        }

        if (storedData.code !== resetCode) {
            return res.status(400).json({ message: "Mã xác nhận không đúng" });
        }

        // Validate password
        if (newPassword.length < 6) {
            return res.status(400).json({ message: "Mật khẩu mới phải có ít nhất 6 ký tự" });
        }

        // Update password
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "Người dùng không tồn tại" });
        }

        user.password = newPassword;
        await user.save();

        // Delete used code
        resetCodes.delete(email);

        res.json({ message: "Đặt lại mật khẩu thành công!" });
    } catch (err) {
        res.status(500).json({ message: "Lỗi server", error: err.message });
    }
};

// Add new address
exports.addAddress = async (req, res) => {
    try {
        const userId = req.user.id;
        const addressData = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "Người dùng không tồn tại" });
        }

        // If this is set as default, unset others
        if (addressData.isDefault) {
            user.addresses.forEach(addr => addr.isDefault = false);
        }

        user.addresses.push(addressData);
        await user.save();

        res.json({ 
            success: true,
            message: "Thêm địa chỉ thành công!",
            addresses: user.addresses
        });
    } catch (err) {
        res.status(500).json({ message: "Lỗi server", error: err.message });
    }
};

// Delete address
exports.deleteAddress = async (req, res) => {
    try {
        const userId = req.user.id;
        const { addressId } = req.params;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "Người dùng không tồn tại" });
        }

        user.addresses = user.addresses.filter(addr => addr._id.toString() !== addressId);
        await user.save();

        res.json({ 
            success: true,
            message: "Xóa địa chỉ thành công!",
            addresses: user.addresses
        });
    } catch (err) {
        res.status(500).json({ message: "Lỗi server", error: err.message });
    }
};

// Set default address
exports.setDefaultAddress = async (req, res) => {
    try {
        const userId = req.user.id;
        const { addressId } = req.params;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "Người dùng không tồn tại" });
        }

        // Unset all defaults
        user.addresses.forEach(addr => addr.isDefault = false);

        // Set new default
        const targetAddress = user.addresses.find(addr => addr._id.toString() === addressId);
        if (targetAddress) {
            targetAddress.isDefault = true;
        }

        await user.save();

        res.json({ 
            success: true,
            message: "Đặt địa chỉ mặc định thành công!",
            addresses: user.addresses
        });
    } catch (err) {
        res.status(500).json({ message: "Lỗi server", error: err.message });
    }
};

// Update preferences
exports.updatePreferences = async (req, res) => {
    try {
        const userId = req.user.id;
        const preferencesData = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "Người dùng không tồn tại" });
        }

        user.preferences = {
            ...user.preferences,
            ...preferencesData
        };

        await user.save();

        res.json({ 
            success: true,
            message: "Cập nhật tùy chọn thành công!",
            preferences: user.preferences
        });
    } catch (err) {
        res.status(500).json({ message: "Lỗi server", error: err.message });
    }
};