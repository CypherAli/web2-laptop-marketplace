/**
 * Script reset tất cả mật khẩu về 123456
 * Run: node server/scripts/reset-all-passwords.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/laptop-marketplace')
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
    isActive: Boolean
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);

async function resetAllPasswords() {
    try {
        console.log('\n🔄 Bắt đầu reset tất cả mật khẩu...\n');
        
        // Get all users
        const users = await User.find({});
        
        if (users.length === 0) {
            console.log('❌ Không tìm thấy user nào trong database!');
            mongoose.connection.close();
            return;
        }
        
        console.log(`📊 Tìm thấy ${users.length} tài khoản\n`);
        console.log('═'.repeat(70));
        
        // Hash new password
        const newPassword = '123456';
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        
        // Update all users
        let count = 0;
        for (const user of users) {
            await User.updateOne(
                { _id: user._id },
                { $set: { password: hashedPassword } }
            );
            
            count++;
            console.log(`${count}. ✅ ${user.email.padEnd(30)} | ${user.role.padEnd(10)} | ${user.username}`);
        }
        
        console.log('═'.repeat(70));
        console.log(`\n✅ Đã reset ${count} mật khẩu thành công!\n`);
        console.log('🔑 MẬT KHẨU MỚI CHO TẤT CẢ TÀI KHOẢN: 123456');
        console.log('═'.repeat(70));
        
        // Hiển thị danh sách tài khoản
        console.log('\n📋 DANH SÁCH TÀI KHOẢN:\n');
        
        const adminUsers = users.filter(u => u.role === 'admin');
        const partnerUsers = users.filter(u => u.role === 'partner');
        const clientUsers = users.filter(u => u.role === 'client');
        
        if (adminUsers.length > 0) {
            console.log('👑 ADMIN:');
            adminUsers.forEach(u => {
                console.log(`   📧 ${u.email} | 🔑 123456`);
            });
            console.log('');
        }
        
        if (partnerUsers.length > 0) {
            console.log('🏪 PARTNER:');
            partnerUsers.forEach(u => {
                console.log(`   📧 ${u.email} | 🏪 ${u.shopName || 'N/A'} | 🔑 123456`);
            });
            console.log('');
        }
        
        if (clientUsers.length > 0) {
            console.log('👤 CLIENT:');
            clientUsers.forEach(u => {
                console.log(`   📧 ${u.email} | 🔑 123456`);
            });
        }
        
        console.log('\n' + '═'.repeat(70));
        
        mongoose.connection.close();
        process.exit(0);
        
    } catch (error) {
        console.error('\n❌ Lỗi:', error.message);
        mongoose.connection.close();
        process.exit(1);
    }
}

// Confirm trước khi chạy
console.log('\n⚠️  CẢNH BÁO: Script này sẽ reset TẤT CẢ mật khẩu về "123456"');
console.log('   Điều này sẽ ảnh hưởng đến tất cả users trong database!\n');

const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

readline.question('Bạn có chắc chắn muốn tiếp tục? (yes/no): ', (answer) => {
    readline.close();
    
    if (answer.toLowerCase() === 'yes') {
        resetAllPasswords();
    } else {
        console.log('\n❌ Đã hủy thao tác!');
        mongoose.connection.close();
        process.exit(0);
    }
});
