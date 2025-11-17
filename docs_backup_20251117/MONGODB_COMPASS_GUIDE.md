# 🗄️ HƯỚNG DẪN SỬ DỤNG MONGODB COMPASS

## 📋 Thông Tin Kết Nối

**Connection String:** `mongodb://localhost:27017`  
**Database Name:** `laptop-db`  
**Collections chính:**
- `users` - Quản lý tài khoản người dùng
- `products` - Quản lý sản phẩm laptop
- `orders` - Quản lý đơn hàng
- `reviews` - Quản lý đánh giá
- `carts` - Quản lý giỏ hàng
- `warranties` - Quản lý bảo hành

---

## 🚀 BƯỚC 1: KẾT NỐI MONGODB COMPASS

### Cách 1: Kết nối nhanh
1. Mở **MongoDB Compass**
2. Ở màn hình kết nối, nhập:
   ```
   mongodb://localhost:27017
   ```
3. Click **"Connect"**

### Cách 2: Kết nối chi tiết
1. Mở MongoDB Compass
2. Click **"New Connection"**
3. Điền thông tin:
   - **Connection String:** `mongodb://localhost:27017`
   - **Hoặc** điền thủ công:
     - Host: `localhost`
     - Port: `27017`
     - Authentication: `None` (nếu không có password)
4. Click **"Connect"**

---

## 📂 BƯỚC 2: CHỌN DATABASE

1. Sau khi kết nối, bạn sẽ thấy danh sách databases bên trái
2. Click vào database: **`laptop-db`**
3. Bạn sẽ thấy các collections bên trong

---

## 👥 THAO TÁC VỚI COLLECTION `users`

### ✅ XEM TẤT CẢ USERS

1. Click vào collection **`users`**
2. Tab **"Documents"** sẽ hiển thị tất cả users
3. Bạn sẽ thấy:
   - username
   - email
   - password (đã hash)
   - role (client, partner, admin)
   - shopName (nếu là partner)
   - createdAt, updatedAt

### ➕ THÊM USER MỚI (INSERT)

**Cách 1: Dùng GUI**
1. Trong collection `users`, click nút **"ADD DATA"**
2. Chọn **"Insert Document"**
3. Nhập JSON (ví dụ):
   ```json
   {
     "username": "newuser123",
     "email": "newuser@example.com",
     "password": "$2b$10$abcdefghijklmnopqrstuvwxyz1234567890",
     "role": "client",
     "isActive": true,
     "isApproved": true,
     "createdAt": "2025-11-17T00:00:00.000Z",
     "updatedAt": "2025-11-17T00:00:00.000Z"
   }
   ```
4. Click **"Insert"**

**⚠️ LƯU Ý:** Password phải là hash bcrypt, không phải plain text!

**Cách 2: Tạo password hash**
- Chạy script tạo hash:
  ```bash
  cd e:\laptop-marketplace\server
  node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('123456', 10).then(hash => console.log(hash));"
  ```
- Copy hash vừa tạo và dán vào trường password

### ✏️ SỬA USER (UPDATE)

**Cách 1: Sửa trực tiếp trong Compass**
1. Click vào collection `users`
2. Tìm user muốn sửa
3. Click vào document đó
4. Click vào field muốn sửa (ví dụ: email, username, role)
5. Sửa giá trị
6. Click **"UPDATE"** ở góc dưới bên phải

**Cách 2: Dùng Filter**
1. Trong collection `users`, dùng **Filter** để tìm user:
   ```json
   { "email": "test@example.com" }
   ```
2. Click vào user trong kết quả
3. Sửa các field cần thiết
4. Click **"UPDATE"**

**Các field thường sửa:**
- `username` - Đổi tên người dùng
- `email` - Đổi email
- `role` - Đổi vai trò (client, partner, admin)
- `isActive` - Kích hoạt/khóa tài khoản (true/false)
- `isApproved` - Duyệt partner (true/false)
- `shopName` - Đổi tên shop (cho partner)
- `phone` - Thêm/sửa số điện thoại
- `avatar` - Thêm/sửa avatar

### 🔑 RESET PASSWORD

**⚠️ QUAN TRỌNG:** Không thể sửa password trực tiếp thành plain text!

**Cách 1: Dùng script (Khuyến nghị)**
```bash
cd e:\laptop-marketplace\server
node scripts/fix-passwords.js reset user@example.com 123456
```

**Cách 2: Tạo hash mới rồi update trong Compass**
```bash
# Tạo hash
node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('newpassword', 10).then(hash => console.log(hash));"

# Copy hash, vào Compass:
# 1. Tìm user
# 2. Click vào field "password"
# 3. Paste hash vừa tạo
# 4. Click UPDATE
```

### ❌ XÓA USER (DELETE)

**Cách 1: Xóa một user**
1. Trong collection `users`, tìm user cần xóa
2. Hover vào document đó
3. Click icon **"🗑️ Delete"** bên phải
4. Confirm **"Delete"**

**Cách 2: Xóa nhiều users cùng lúc**
1. Dùng Filter để tìm users cần xóa:
   ```json
   { "role": "client" }
   ```
2. Click nút **"Delete"** ở top bar
3. Confirm xóa

**Cách 3: Xóa tất cả users (CẨN THẬN!)**
1. Trong collection `users`
2. Click tab **"Indexes"** để đảm bảo không nhầm
3. Quay lại tab **"Documents"**
4. Collection Options → **"Drop Collection"**
5. Confirm (⚠️ Xóa toàn bộ!)

---

## 🔍 TÌM KIẾM & LỌC

### Tìm user theo email
```json
{ "email": "test@example.com" }
```

### Tìm tất cả partners
```json
{ "role": "partner" }
```

### Tìm partners đã duyệt
```json
{ "role": "partner", "isApproved": true }
```

### Tìm users bị khóa
```json
{ "isActive": false }
```

### Tìm users có email chứa "gmail"
```json
{ "email": { "$regex": "gmail", "$options": "i" } }
```

### Tìm users tạo sau ngày cụ thể
```json
{ "createdAt": { "$gte": { "$date": "2025-11-01T00:00:00.000Z" } } }
```

---

## 📊 MỘT SỐ QUERY HỮU ÍCH

### 1. Đếm số users theo role
- Tab **"Aggregations"**
```json
[
  {
    "$group": {
      "_id": "$role",
      "count": { "$sum": 1 }
    }
  }
]
```

### 2. Tìm users không có số điện thoại
```json
{ "phone": { "$exists": false } }
```
hoặc
```json
{ "phone": "" }
```

### 3. Update nhiều users cùng lúc
- Tab **"Update"** → **"Update Multiple Documents"**
```json
// Filter
{ "role": "client" }

// Update
{ "$set": { "membershipTier": "bronze" } }
```

---

## 🛠️ CÁC THAO TÁC NÂNG CAO

### Duplicate một user
1. Tìm user gốc
2. Click vào document
3. Click **"Clone Document"**
4. Sửa `_id`, `email`, `username` thành giá trị mới
5. Click **"Insert"**

### Export users
1. Collection `users` → Click **"Export Data"**
2. Chọn format: JSON hoặc CSV
3. Chọn nơi lưu file
4. Click **"Export"**

### Import users
1. Collection `users` → Click **"Add Data"**
2. Chọn **"Import File"**
3. Chọn file JSON/CSV
4. Map các fields
5. Click **"Import"**

---

## ⚠️ LƯU Ý QUAN TRỌNG

### 1. **Backup trước khi xóa**
```bash
# Export toàn bộ database
mongodump --db laptop-db --out e:\backup\
```

### 2. **Password luôn phải hash**
- KHÔNG BAO GIỜ lưu plain text password
- Dùng bcrypt với salt rounds = 10
- Format: `$2b$10$...` (60 ký tự)

### 3. **Indexes**
- Không xóa indexes của `email` và `username` (unique)
- Để maintain data integrity

### 4. **Validation**
- Email phải unique
- Username phải unique
- Role chỉ có 3 giá trị: client, partner, admin

### 5. **References**
- Nếu xóa user, cần xóa cả:
  - Orders của user đó
  - Cart của user đó
  - Reviews của user đó
  - Warranties của user đó

---

## 🔧 TROUBLESHOOTING

### Lỗi: "Duplicate key error"
→ Email hoặc username đã tồn tại. Dùng email/username khác.

### Lỗi: "Invalid password hash"
→ Password phải là bcrypt hash, không phải plain text.

### Không tìm thấy database `laptop-db`
→ Chạy server ít nhất 1 lần để tạo database và collections.

### Không kết nối được Compass
→ Kiểm tra MongoDB service đang chạy:
```bash
# Windows
net start MongoDB
```

---

## 📝 QUICK REFERENCE

### User Schema Fields:
- `_id` - MongoDB ObjectId (tự động)
- `username` - String, unique, required
- `email` - String, unique, required
- `password` - String (bcrypt hash), required
- `role` - String: "client" | "partner" | "admin"
- `shopName` - String (cho partner)
- `isApproved` - Boolean (cho partner)
- `isActive` - Boolean (active/locked)
- `phone` - String
- `avatar` - String (path)
- `addresses` - Array of objects
- `preferences` - Object
- `loyaltyPoints` - Object
- `membershipTier` - String
- `stats` - Object
- `createdAt` - Date (tự động)
- `updatedAt` - Date (tự động)

---

## 🎯 VÍ DỤ THỰC TẾ

### Tạo admin mới:
```json
{
  "username": "admin",
  "email": "admin@laptop.vn",
  "password": "$2b$10$xyz...", 
  "role": "admin",
  "isActive": true,
  "isApproved": true
}
```

### Duyệt partner:
```json
// Filter: { "email": "partner@shop.vn" }
// Update: { "$set": { "isApproved": true } }
```

### Khóa tài khoản:
```json
// Filter: { "email": "baduser@example.com" }
// Update: { "$set": { "isActive": false } }
```

---

**✅ Bây giờ bạn có thể:**
1. Mở MongoDB Compass
2. Kết nối với `mongodb://localhost:27017`
3. Chọn database `laptop-db`
4. Thao tác với collection `users` thoải mái!

🚀 Chúc bạn làm việc hiệu quả với MongoDB Compass!
