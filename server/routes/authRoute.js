const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const { register, login, updateProfile, forgotPassword, resetPassword } = authController;

const uploadDir = path.join(__dirname, '../uploads/avatars');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, `avatar-${req.user.id}-${uniqueSuffix}${ext}`);
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Chỉ chấp nhận file ảnh!'));
    }
};

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: fileFilter
});

router.post('/register', register);
router.post('/login', login);
router.put('/profile', auth, upload.single('avatar'), updateProfile);

// Forgot Password & Reset Password
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Address Management
router.post('/profile/addresses', auth, authController.addAddress);
router.delete('/profile/addresses/:addressId', auth, authController.deleteAddress);
router.put('/profile/addresses/:addressId/default', auth, authController.setDefaultAddress);

// Preferences Management
router.put('/profile/preferences', auth, authController.updatePreferences);

module.exports = router;