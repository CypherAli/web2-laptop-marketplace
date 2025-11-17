# 🔐 FIX: Vấn Đề Đăng Nhập Sau Khi Đăng Ký

## 📋 Vấn Đề

Sau khi đăng ký tài khoản thành công, người dùng không thể đăng nhập với mật khẩu đã đăng ký.

## 🔍 Nguyên Nhân

Mật khẩu bị mã hóa (hash) **hai lần** do:
1. Middleware `pre('save')` trong User model tự động hash mật khẩu
2. Khi so sánh mật khẩu, hệ thống không thể match được do mật khẩu đã bị hash sai

## ✅ Giải Pháp Đã Thực Hiện

### 1. Cập nhật User Model (`server/models/User.js`)

**Thêm method `comparePassword`:**
```javascript
UserSchema.methods.comparePassword = async function(candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        throw error;
    }
};
```

### 2. Cập nhật Auth Controller (`server/controllers/authController.js`)

**Sử dụng method `comparePassword` thay vì gọi trực tiếp `bcrypt.compare`:**
```javascript
// Trước đây:
const isMatch = await bcrypt.compare(password, user.password);

// Bây giờ:
const isMatch = await user.comparePassword(password);
```

### 3. Tạo Script Fix Mật Khẩu

File: `server/scripts/fix-passwords.js`

Script này giúp reset mật khẩu cho các tài khoản đã tồn tại.

## 🚀 Cách Sử Dụng

### A. Với Tài Khoản Mới (Sau Khi Fix)

✅ Đăng ký và đăng nhập bình thường - không cần làm gì thêm!

### B. Với Tài Khoản Cũ (Đã Đăng Ký Trước Khi Fix)

**Bước 1: Liệt kê tất cả user**
```bash
cd server
node scripts/fix-passwords.js list
```

**Bước 2: Reset mật khẩu cho một user cụ thể**
```bash
node scripts/fix-passwords.js reset user@example.com 123456
```

**Bước 3: Hoặc reset tất cả mật khẩu (cẩn thận!)**
```bash
node scripts/fix-passwords.js reset-all 123456
```

## 🧪 Kiểm Tra

### Test 1: Đăng Ký Tài Khoản Mới

1. Mở trình duyệt, vào `/register`
2. Điền thông tin:
   - Username: `testuser`
   - Email: `test@example.com`
   - Password: `123456`
   - Role: `client`
3. Click "Đăng ký"
4. Kiểm tra response - phải thành công

### Test 2: Đăng Nhập

1. Vào `/login`
2. Nhập:
   - Email: `test@example.com`
   - Password: `123456`
3. Click "Đăng nhập"
4. Phải đăng nhập thành công và nhận được token

### Test 3: Kiểm Tra Database

```javascript
// Trong MongoDB shell hoặc MongoDB Compass
db.users.findOne({ email: "test@example.com" })
```

Mật khẩu phải được hash (bắt đầu bằng `$2a$10$` hoặc `$2b$10$`)

## 📝 Lưu Ý Quan Trọng

### ⚠️ Cho Các Tài Khoản Hiện Có:

1. **Nếu có ít user:** Reset từng tài khoản
   ```bash
   node scripts/fix-passwords.js reset user1@email.com newpass123
   node scripts/fix-passwords.js reset user2@email.com newpass456
   ```

2. **Nếu có nhiều user:** Reset tất cả về password mặc định
   ```bash
   node scripts/fix-passwords.js reset-all 123456
   ```
   Sau đó thông báo cho users đổi mật khẩu sau khi đăng nhập.

### 🔒 Bảo Mật:

- Không bao giờ commit file `.env` có chứa JWT_SECRET
- Khuyến khích users đổi mật khẩu sau khi admin reset
- Sử dụng HTTPS trong production
- Implement rate limiting cho login endpoint

## 🎯 Kết Quả Mong Đợi

✅ Đăng ký tài khoản mới → Thành công  
✅ Đăng nhập với tài khoản vừa đăng ký → Thành công  
✅ Mật khẩu được hash đúng cách (1 lần)  
✅ So sánh mật khẩu hoạt động chính xác  
✅ Đổi mật khẩu hoạt động bình thường  

## 🔧 Các File Đã Được Sửa Đổi

1. ✅ `server/models/User.js` - Thêm method comparePassword
2. ✅ `server/controllers/authController.js` - Sử dụng comparePassword
3. ✅ `server/scripts/fix-passwords.js` - Script fix mật khẩu (MỚI)

## 💡 Tips Debug

Nếu vẫn gặp vấn đề:

1. **Kiểm tra log console:**
   ```javascript
   console.log("Password input:", password);
   console.log("Stored hash:", user.password);
   console.log("Match result:", isMatch);
   ```

2. **Test bcrypt trực tiếp:**
   ```javascript
   const bcrypt = require('bcryptjs');
   const testPassword = '123456';
   const salt = await bcrypt.genSalt(10);
   const hash = await bcrypt.hash(testPassword, salt);
   const isMatch = await bcrypt.compare(testPassword, hash);
   console.log("Test result:", isMatch); // Should be true
   ```

3. **Kiểm tra JWT_SECRET:**
   ```bash
   echo %JWT_SECRET%  # Windows CMD
   echo $env:JWT_SECRET  # Windows PowerShell
   ```

## 📞 Hỗ Trợ

Nếu vẫn gặp vấn đề, kiểm tra:
- MongoDB connection string
- JWT_SECRET trong file .env
- bcrypt và bcryptjs version compatibility
- Node.js version (nên dùng v14+)

---
**Cập nhật:** 17/11/2025  
**Trạng thái:** ✅ ĐÃ HOÀN THÀNH VÀ TEST
