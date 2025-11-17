/**
 * Script kiểm tra chi tiết tài khoản trong database
 */

const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/laptop-marketplace', {
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
    stats: Object,
    createdAt: Date,
    updatedAt: Date
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);

async function showAllUsersDetailed() {
    try {
        const users = await User.find({}).sort({ createdAt: -1 }).lean();
        
        console.log('\n📊 CHI TIẾT TẤT CẢ TÀI KHOẢN TRONG DATABASE');
        console.log('='.repeat(80));
        console.log(`Tổng số tài khoản: ${users.length}`);
        console.log('='.repeat(80));
        
        users.forEach((user, index) => {
            console.log(`\n${index + 1}. 👤 ${user.username.toUpperCase()}`);
            console.log('─'.repeat(80));
            console.log(`   📧 Email:        ${user.email}`);
            console.log(`   🔑 User ID:      ${user._id}`);
            console.log(`   👔 Role:         ${user.role}`);
            console.log(`   🔒 Password:     ${user.password.substring(0, 30)}...`);
            console.log(`   ⏰ Tạo lúc:      ${user.createdAt ? new Date(user.createdAt).toLocaleString('vi-VN') : 'N/A'}`);
            console.log(`   🔄 Cập nhật:     ${user.updatedAt ? new Date(user.updatedAt).toLocaleString('vi-VN') : 'N/A'}`);
            console.log(`   ✅ Active:       ${user.isActive ? 'Yes' : 'No'}`);
            
            if (user.role === 'partner') {
                console.log(`   🏪 Shop Name:    ${user.shopName || 'N/A'}`);
                console.log(`   ✓ Approved:      ${user.isApproved ? 'Yes' : 'No (Đang chờ Admin duyệt)'}`);
            }
            
            if (user.phone) {
                console.log(`   📱 Phone:        ${user.phone}`);
            }
            
            if (user.avatar) {
                console.log(`   🖼️  Avatar:       ${user.avatar}`);
            }
            
            // Show stats
            if (user.stats) {
                console.log(`   📈 Stats:`);
                console.log(`      - Orders:     ${user.stats.totalOrders || 0}`);
                console.log(`      - Spent:      ${(user.stats.totalSpent || 0).toLocaleString('vi-VN')} VNĐ`);
                console.log(`      - Reviews:    ${user.stats.totalReviews || 0}`);
            }
            
            // Show addresses count
            if (user.addresses && user.addresses.length > 0) {
                console.log(`   📍 Addresses:    ${user.addresses.length} địa chỉ`);
            }
            
            // Show wishlist count
            if (user.wishlist && user.wishlist.length > 0) {
                console.log(`   ❤️  Wishlist:     ${user.wishlist.length} sản phẩm`);
            }
        });
        
        console.log('\n' + '='.repeat(80));
        
        // Thống kê
        const clientCount = users.filter(u => u.role === 'client').length;
        const partnerCount = users.filter(u => u.role === 'partner').length;
        const adminCount = users.filter(u => u.role === 'admin').length;
        const approvedPartners = users.filter(u => u.role === 'partner' && u.isApproved).length;
        const pendingPartners = users.filter(u => u.role === 'partner' && !u.isApproved).length;
        
        console.log('\n📊 THỐNG KÊ:');
        console.log('─'.repeat(40));
        console.log(`   👥 Client:               ${clientCount}`);
        console.log(`   🏪 Partner:              ${partnerCount}`);
        console.log(`      - Đã duyệt:           ${approvedPartners}`);
        console.log(`      - Chờ duyệt:          ${pendingPartners}`);
        console.log(`   👑 Admin:                ${adminCount}`);
        console.log('─'.repeat(40));
        console.log(`   🔢 TỔNG CỘNG:            ${users.length}`);
        console.log('─'.repeat(40));
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

async function findUserByEmail(email) {
    try {
        const user = await User.findOne({ email }).lean();
        
        if (!user) {
            console.log(`\n❌ Không tìm thấy user với email: ${email}`);
            return;
        }
        
        console.log('\n✅ TÌM THẤY TÀI KHOẢN:');
        console.log('='.repeat(80));
        console.log(JSON.stringify(user, null, 2));
        console.log('='.repeat(80));
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

async function checkPasswordHash(email) {
    try {
        const user = await User.findOne({ email }).lean();
        
        if (!user) {
            console.log(`\n❌ Không tìm thấy user với email: ${email}`);
            return;
        }
        
        console.log('\n🔒 KIỂM TRA PASSWORD HASH:');
        console.log('='.repeat(80));
        console.log(`Email:           ${user.email}`);
        console.log(`Password Hash:   ${user.password}`);
        console.log(`Hash starts:     ${user.password.substring(0, 10)}`);
        console.log(`Hash length:     ${user.password.length}`);
        
        // Check if it's bcrypt hash
        const isBcryptHash = user.password.startsWith('$2a$') || 
                            user.password.startsWith('$2b$') || 
                            user.password.startsWith('$2y$');
        
        console.log(`Is bcrypt hash:  ${isBcryptHash ? '✅ Yes' : '❌ No - PROBLEM!'}`);
        console.log('='.repeat(80));
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

async function searchUsers(searchTerm) {
    try {
        const users = await User.find({
            $or: [
                { username: new RegExp(searchTerm, 'i') },
                { email: new RegExp(searchTerm, 'i') },
                { shopName: new RegExp(searchTerm, 'i') }
            ]
        }).lean();
        
        console.log(`\n🔍 Tìm thấy ${users.length} kết quả cho: "${searchTerm}"`);
        console.log('='.repeat(80));
        
        users.forEach((user, index) => {
            console.log(`${index + 1}. ${user.username} (${user.email}) - Role: ${user.role}`);
        });
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

// Main function
async function main() {
    const args = process.argv.slice(2);
    const command = args[0];
    
    if (command === 'all' || !command) {
        await showAllUsersDetailed();
    } else if (command === 'find') {
        const email = args[1];
        if (!email) {
            console.log('❌ Usage: node check-users.js find <email>');
        } else {
            await findUserByEmail(email);
        }
    } else if (command === 'check-hash') {
        const email = args[1];
        if (!email) {
            console.log('❌ Usage: node check-users.js check-hash <email>');
        } else {
            await checkPasswordHash(email);
        }
    } else if (command === 'search') {
        const searchTerm = args[1];
        if (!searchTerm) {
            console.log('❌ Usage: node check-users.js search <term>');
        } else {
            await searchUsers(searchTerm);
        }
    } else {
        console.log('\n📖 HƯỚNG DẪN SỬ DỤNG:');
        console.log('─'.repeat(50));
        console.log('  node check-users.js                     - Xem tất cả users');
        console.log('  node check-users.js all                 - Xem tất cả users');
        console.log('  node check-users.js find <email>        - Tìm user theo email');
        console.log('  node check-users.js check-hash <email>  - Kiểm tra password hash');
        console.log('  node check-users.js search <term>       - Tìm kiếm user');
        console.log('\n📝 VÍ DỤ:');
        console.log('─'.repeat(50));
        console.log('  node check-users.js all');
        console.log('  node check-users.js find test@example.com');
        console.log('  node check-users.js check-hash contact@digitalhub.vn');
        console.log('  node check-users.js search laptop');
        console.log('');
    }
    
    await mongoose.connection.close();
    process.exit(0);
}

main().catch(err => {
    console.error('❌ Script error:', err);
    process.exit(1);
});
