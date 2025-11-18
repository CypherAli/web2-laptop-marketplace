/**
 * Script để fix mật khẩu cho các tài khoản đã tồn tại
 * Chạy script này nếu bạn gặp vấn đề đăng nhập sau khi đăng ký
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/laptop-db', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
});

const UserSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    role: String,
    shopName: String,
    isApproved: Boolean,
    phone: String,
    avatar: String,
    isActive: Boolean,
    addresses: Array,
    paymentMethods: Array,
    preferences: Object,
    wishlist: Array,
    recentViews: Array,
    searchHistory: Array,
    comparisonHistory: Array,
    loyaltyPoints: Object,
    membershipTier: String,
    stats: Object
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);

async function resetPassword(email, newPassword) {
    try {
        const user = await User.findOne({ email });
        
        if (!user) {
            console.log(`❌ User with email ${email} not found`);
            return false;
        }

        // Hash password manually
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        
        // Update directly without triggering middleware
        await User.updateOne(
            { email },
            { $set: { password: hashedPassword } }
        );
        
        console.log(`✅ Password updated for user: ${email}`);
        return true;
    } catch (error) {
        console.error(`❌ Error updating password for ${email}:`, error.message);
        return false;
    }
}

async function listAllUsers() {
    try {
        const users = await User.find({}, 'email username role').lean();
        console.log('\n📋 All users in database:');
        console.log('=====================================');
        users.forEach((user, index) => {
            console.log(`${index + 1}. Email: ${user.email} | Username: ${user.username} | Role: ${user.role}`);
        });
        console.log('=====================================\n');
        return users;
    } catch (error) {
        console.error('❌ Error listing users:', error.message);
        return [];
    }
}

async function resetAllPasswords(defaultPassword = '123456') {
    try {
        const users = await User.find({});
        console.log(`\n🔄 Resetting passwords for ${users.length} users...`);
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(defaultPassword, salt);
        
        for (const user of users) {
            await User.updateOne(
                { _id: user._id },
                { $set: { password: hashedPassword } }
            );
            console.log(`✅ Password reset for: ${user.email}`);
        }
        
        console.log(`\n✅ All passwords have been reset to: ${defaultPassword}`);
        console.log('⚠️  Please remind users to change their passwords after logging in!');
    } catch (error) {
        console.error('❌ Error resetting all passwords:', error.message);
    }
}

// Main function
async function main() {
    console.log('\n🔧 Password Fix Script');
    console.log('======================\n');
    
    const args = process.argv.slice(2);
    const command = args[0];
    
    if (command === 'list') {
        await listAllUsers();
    } else if (command === 'reset') {
        const email = args[1];
        const newPassword = args[2];
        
        if (!email || !newPassword) {
            console.log('❌ Usage: node fix-passwords.js reset <email> <new-password>');
            console.log('Example: node fix-passwords.js reset user@example.com 123456');
        } else {
            await resetPassword(email, newPassword);
        }
    } else if (command === 'reset-all') {
        const defaultPassword = args[1] || '123456';
        console.log(`⚠️  WARNING: This will reset ALL user passwords to: ${defaultPassword}`);
        console.log('Press Ctrl+C to cancel, or wait 5 seconds to continue...\n');
        
        await new Promise(resolve => setTimeout(resolve, 5000));
        await resetAllPasswords(defaultPassword);
    } else {
        console.log('📖 Available commands:');
        console.log('  list                                    - List all users');
        console.log('  reset <email> <password>                - Reset password for a specific user');
        console.log('  reset-all [password]                    - Reset all passwords (default: 123456)');
        console.log('\nExamples:');
        console.log('  node fix-passwords.js list');
        console.log('  node fix-passwords.js reset user@example.com 123456');
        console.log('  node fix-passwords.js reset-all newpassword');
    }
    
    await mongoose.connection.close();
    console.log('\n✅ Script completed\n');
    process.exit(0);
}

main().catch(err => {
    console.error('❌ Script error:', err);
    process.exit(1);
});
