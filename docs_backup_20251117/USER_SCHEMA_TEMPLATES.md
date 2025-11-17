# 📋 USER SCHEMA - TEMPLATE ĐỂ COPY VÀO MONGODB COMPASS

## ✅ Template Client (Khách Hàng)

```json
{
  "username": "client_user",
  "email": "client@example.com",
  "password": "$2b$10$abcd...xyz (dùng script generate-hash.js)",
  "role": "client",
  "isActive": true,
  "isApproved": true,
  "phone": "0901234567",
  "avatar": "",
  "addresses": [],
  "paymentMethods": [],
  "preferences": {
    "notifications": {
      "email": {
        "orderUpdates": true,
        "priceAlerts": true,
        "promotions": true,
        "warrantyReminders": true
      },
      "push": {
        "orderUpdates": true,
        "priceAlerts": false,
        "promotions": false
      }
    },
    "language": "vi",
    "currency": "VND"
  },
  "wishlist": [],
  "recentViews": [],
  "searchHistory": [],
  "comparisonHistory": [],
  "loyaltyPoints": {
    "total": 0,
    "available": 0,
    "used": 0
  },
  "membershipTier": "bronze",
  "stats": {
    "totalOrders": 0,
    "totalSpent": 0,
    "totalReviews": 0,
    "averageRating": 0
  }
}
```

---

## 🏪 Template Partner (Đối Tác Bán Hàng)

```json
{
  "username": "partner_shop",
  "email": "partner@shop.vn",
  "password": "$2b$10$abcd...xyz (dùng script generate-hash.js)",
  "role": "partner",
  "shopName": "Laptop Pro Store",
  "shopDescription": "Chuyên cung cấp laptop chính hãng",
  "isActive": true,
  "isApproved": false,
  "phone": "0909876543",
  "avatar": "",
  "addresses": [
    {
      "label": "office",
      "fullName": "Shop Owner",
      "phone": "0909876543",
      "address": {
        "street": "123 Nguyễn Huệ",
        "ward": "Phường Bến Nghé",
        "district": "Quận 1",
        "city": "TP. Hồ Chí Minh",
        "zipCode": "700000"
      },
      "isDefault": true
    }
  ],
  "preferences": {
    "notifications": {
      "email": {
        "orderUpdates": true,
        "priceAlerts": true,
        "promotions": true,
        "warrantyReminders": true
      }
    },
    "language": "vi",
    "currency": "VND"
  },
  "stats": {
    "totalOrders": 0,
    "totalSpent": 0,
    "totalReviews": 0,
    "averageRating": 0
  }
}
```

---

## 👑 Template Admin

```json
{
  "username": "admin",
  "email": "admin@laptop.vn",
  "password": "$2b$10$abcd...xyz (dùng script generate-hash.js)",
  "role": "admin",
  "isActive": true,
  "isApproved": true,
  "phone": "0900000000",
  "avatar": "/uploads/avatars/admin.jpg"
}
```

---

## 🔧 CÁCH TẠO PASSWORD HASH

### Cách 1: Dùng Script
```bash
cd e:\laptop-marketplace\server
node scripts\generate-hash.js 123456
```

### Cách 2: Dùng Node.js trực tiếp
```bash
cd e:\laptop-marketplace\server
node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('your_password', 10).then(hash => console.log(hash));"
```

**Copy hash và paste vào field "password"**

---

## 📝 CÁC FIELD QUAN TRỌNG

### Bắt buộc (Required):
- `username` - Tên đăng nhập, unique
- `email` - Email, unique
- `password` - Mật khẩu đã hash (bcrypt)

### Quan trọng:
- `role` - Giá trị: "client", "partner", hoặc "admin"
- `isActive` - true (hoạt động) hoặc false (bị khóa)
- `isApproved` - Chỉ dùng cho partner, true để duyệt

### Tùy chọn:
- `shopName` - Tên shop (bắt buộc nếu role = "partner")
- `phone` - Số điện thoại
- `avatar` - Đường dẫn ảnh đại diện
- `addresses` - Mảng địa chỉ giao hàng
- Các field khác sẽ tự động tạo khi cần

---

## 🎯 EXAMPLES - COPY & PASTE

### 1. Tạo client đơn giản
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "$2b$10$EixZaYVK1fsbw1ZfbX3OXe.PzZZ.m8cNYQN9YK1cIZPQzT8h5vZAO",
  "role": "client",
  "isActive": true
}
```

### 2. Tạo partner (chờ duyệt)
```json
{
  "username": "laptop_store_123",
  "email": "store123@example.com",
  "password": "$2b$10$EixZaYVK1fsbw1ZfbX3OXe.PzZZ.m8cNYQN9YK1cIZPQzT8h5vZAO",
  "role": "partner",
  "shopName": "Laptop Store 123",
  "isActive": true,
  "isApproved": false
}
```

### 3. Tạo admin
```json
{
  "username": "superadmin",
  "email": "superadmin@laptop.vn",
  "password": "$2b$10$EixZaYVK1fsbw1ZfbX3OXe.PzZZ.m8cNYQN9YK1cIZPQzT8h5vZAO",
  "role": "admin",
  "isActive": true,
  "isApproved": true
}
```

**⚠️ LƯU Ý:** Hash trên là của password "123456", chỉ dùng để test!

---

## 🔄 UPDATE QUERIES

### 1. Duyệt partner
```json
// Filter
{ "email": "partner@shop.vn" }

// Update
{ "$set": { "isApproved": true } }
```

### 2. Khóa tài khoản
```json
// Filter
{ "email": "baduser@example.com" }

// Update
{ "$set": { "isActive": false } }
```

### 3. Nâng cấp thành admin
```json
// Filter
{ "email": "user@example.com" }

// Update
{ "$set": { "role": "admin" } }
```

### 4. Thêm số điện thoại
```json
// Filter
{ "email": "user@example.com" }

// Update
{ "$set": { "phone": "0901234567" } }
```

### 5. Reset loyalty points
```json
// Filter
{ "email": "user@example.com" }

// Update
{ 
  "$set": { 
    "loyaltyPoints": {
      "total": 1000,
      "available": 1000,
      "used": 0
    }
  }
}
```

---

## 🗑️ DELETE QUERIES

### 1. Xóa user theo email
```json
{ "email": "user_to_delete@example.com" }
```

### 2. Xóa tất cả partners chưa duyệt
```json
{ "role": "partner", "isApproved": false }
```

### 3. Xóa tất cả tài khoản bị khóa
```json
{ "isActive": false }
```

**⚠️ CẨN THẬN:** Backup trước khi xóa hàng loạt!

---

## 🔍 FIND QUERIES

### 1. Tìm tất cả admins
```json
{ "role": "admin" }
```

### 2. Tìm partners đã duyệt
```json
{ "role": "partner", "isApproved": true }
```

### 3. Tìm users có email Gmail
```json
{ "email": { "$regex": "@gmail.com$", "$options": "i" } }
```

### 4. Tìm users tạo hôm nay
```json
{ 
  "createdAt": { 
    "$gte": { "$date": "2025-11-17T00:00:00.000Z" },
    "$lt": { "$date": "2025-11-18T00:00:00.000Z" }
  }
}
```

### 5. Tìm users có loyalty points > 1000
```json
{ "loyaltyPoints.available": { "$gt": 1000 } }
```

---

✅ **Copy templates trên và paste vào MongoDB Compass!**
