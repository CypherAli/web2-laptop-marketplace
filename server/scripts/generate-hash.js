const bcrypt = require('bcryptjs');

const args = process.argv.slice(2);
const password = args[0];

if (!password) {
    console.log('\n❌ Vui lòng nhập mật khẩu!');
    console.log('\n📖 Cách sử dụng:');
    console.log('   node generate-hash.js <password>');
    console.log('\n📝 Ví dụ:');
    console.log('   node generate-hash.js 123456');
    console.log('   node generate-hash.js mySecurePassword\n');
    process.exit(1);
}

console.log('\n🔐 GENERATE PASSWORD HASH');
console.log('='.repeat(60));
console.log(`\n📝 Password: ${password}`);
console.log('⏳ Đang tạo hash...\n');

bcrypt.hash(password, 10)
    .then(hash => {
        console.log('✅ THÀNH CÔNG!');
        console.log('─'.repeat(60));
        console.log('\n🔑 Password Hash (copy dòng dưới):');
        console.log('\n' + hash);
        console.log('\n' + '─'.repeat(60));
        console.log('\n💡 Cách sử dụng trong MongoDB Compass:');
        console.log('   1. Mở collection "users"');
        console.log('   2. Click "ADD DATA" → "Insert Document"');
        console.log('   3. Hoặc tìm user cần sửa → click vào field "password"');
        console.log('   4. Paste hash ở trên vào field "password"');
        console.log('   5. Click "Insert" hoặc "Update"');
        console.log('\n' + '='.repeat(60) + '\n');
    })
    .catch(err => {
        console.error('❌ Lỗi:', err.message);
    });
