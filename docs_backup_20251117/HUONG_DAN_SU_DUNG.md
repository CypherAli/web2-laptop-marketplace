# 🚀 HƯỚNG DẪN SỬ DỤNG HỆ THỐNG LAPTOP MARKETPLACE

## 📦 CÀI ĐẶT VÀ KHỞI ĐỘNG

### 1. Cài đặt Dependencies
```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

### 2. Khởi động hệ thống
```powershell
# Terminal 1 - Server (Port 5000)
cd server
node server.js

# Terminal 2 - Client (Port 3000)
cd client
npm start
```

## 👥 TÀI KHOẢN TEST

### 👤 CLIENT (Khách hàng)
- **Email:** client@laptop.com
- **Password:** client123
- **Quyền:** Xem sản phẩm, đặt hàng

### 🏪 PARTNER 1 (Nhà bán hàng)
- **Email:** partner1@laptop.com
- **Password:** partner123
- **Shop:** Tech Solutions Store
- **Quyền:** CRUD sản phẩm của mình, xem doanh thu

### 🏪 PARTNER 2 (Nhà bán hàng)
- **Email:** partner2@laptop.com
- **Password:** partner123
- **Shop:** Gaming Hub
- **Quyền:** CRUD sản phẩm của mình, xem doanh thu

### 👑 ADMIN (Quản trị viên)
- **Email:** admin@laptop.com
- **Password:** admin123
- **Quyền:** Toàn quyền hệ thống

---

## 🔧 MONGODB COMPASS

### Kết nối
1. Mở MongoDB Compass
2. Connection String: `mongodb://localhost:27017`
3. Database name: `laptop-db`

### Collections để xem
```
📁 laptop-db
  ├── 📄 users (Danh sách users: client, partner, admin)
  ├── 📄 products (Sản phẩm laptop)
  └── 📄 orders (Đơn hàng)
```

### Queries hữu ích

#### Xem tất cả products của 1 partner
```javascript
{ createdBy: ObjectId("PARTNER_ID_HERE") }
```

#### Xem sản phẩm theo brand
```javascript
{ brand: "Dell" }
```

#### Xem sản phẩm còn hàng
```javascript
{ stock: { $gt: 0 } }
```

#### Xem đơn hàng đã hoàn thành
```javascript
{ status: "delivered" }
```

---

## 📮 POSTMAN

### Import Collection
1. Mở Postman
2. Click **Import**
3. Chọn file: `Laptop_Marketplace_API.postman_collection.json`
4. Collection đã có sẵn tất cả endpoints!

### Sử dụng Collection

#### Bước 1: Login để lấy token
1. Vào folder **Authentication**
2. Chọn **Login - Partner1** (hoặc Admin, Client)
3. Click **Send**
4. Token sẽ tự động lưu vào biến `{{authToken}}`

#### Bước 2: Test các API
- **Products:** CRUD sản phẩm, filter, search
- **Partner Dashboard:** Xem stats, revenue theo brand/tháng
- **Admin Dashboard:** Quản lý users, xem revenue tất cả shop
- **Orders:** Tạo đơn hàng, xem lịch sử

### Các biến quan trọng
```
{{baseUrl}} = http://localhost:5000/api
{{authToken}} = JWT token (tự động set sau khi login)
```

---

## 🧪 TEST SCENARIOS

### Scenario 1: Partner tạo sản phẩm mới
```
1. Login as Partner1
2. POST /products với body:
{
  "name": "Dell G15 Gaming",
  "description": "15.6\" FHD 120Hz, i5-12500H, RTX 3050",
  "price": 24990000,
  "stock": 10,
  "brand": "Dell",
  "imageUrl": "https://via.placeholder.com/300x200"
}
3. Verify: Product có createdBy = Partner1._id
```

### Scenario 2: Partner xem doanh thu theo brand
```
1. Login as Partner1
2. GET /partner/revenue-by-brand
3. Response:
[
  { brand: "Dell", revenue: 85000000, soldCount: 3 },
  { brand: "HP", revenue: 45000000, soldCount: 2 }
]
```

### Scenario 3: Admin xem doanh thu tất cả shop
```
1. Login as Admin
2. GET /admin/revenue-by-shop
3. Response:
[
  {
    partnerId: "...",
    partnerName: "Tech Solutions Store",
    totalRevenue: 150000000,
    soldCount: 8,
    orderCount: 6
  },
  ...
]
```

### Scenario 4: Client đặt hàng
```
1. Login as Client
2. GET /products (lấy product IDs)
3. POST /orders với body:
{
  "items": [
    { "product": "PRODUCT_ID", "quantity": 1 }
  ],
  "shippingAddress": "123 Nguyen Hue, Q1, HCM",
  "totalPrice": 25000000
}
4. Verify: Stock giảm, order được tạo
```

---

## 🔍 DEBUGGING TIPS

### Kiểm tra server đang chạy
```powershell
curl http://localhost:5000/api/products
```

### Xem logs MongoDB
```javascript
// Trong MongoDB Compass, chạy aggregation:
db.products.aggregate([
  { $group: { _id: "$brand", count: { $sum: 1 } } }
])
```

### Reset database
```powershell
cd server
node -e "require('dotenv').config(); const mongoose = require('mongoose'); mongoose.connect(process.env.MONGO_URI).then(async () => { await mongoose.connection.dropDatabase(); console.log('Database dropped'); process.exit(0); })"
node createUsers.js
node seedProducts.js
```

---

## 📊 DASHBOARD APIS (Đã hoàn thành)

### Partner Dashboard
✅ GET /partner/my-products - Sản phẩm của mình
✅ GET /partner/stats - Tổng doanh thu, sản phẩm, đã bán
✅ GET /partner/revenue - Doanh thu theo tháng (6 tháng gần nhất)
✅ GET /partner/revenue-by-brand - Doanh thu theo brand (Dell, HP, Lenovo...)
✅ PATCH /partner/products/:id/toggle-status - Bật/tắt sản phẩm

### Admin Dashboard
✅ GET /admin/users - Danh sách users (có filter, search, pagination)
✅ GET /admin/users/:id - Chi tiết 1 user
✅ PUT /admin/users/:id - Cập nhật user (role, isApproved...)
✅ DELETE /admin/users/:id - Xóa user (bảo vệ admin cuối cùng)
✅ GET /admin/stats - Thống kê tổng quan hệ thống
✅ GET /admin/revenue - Doanh thu hệ thống theo tháng
✅ GET /admin/revenue-by-shop - So sánh doanh thu các shop
✅ GET /admin/partners/:id/revenue - Chi tiết doanh thu 1 partner (monthly, brand, best sellers)

---

## 🎯 TÍNH NĂNG ĐANG HOÀN THIỆN

### Frontend Components (TODO)
- [ ] PartnerDashboard.js - Trang quản lý cho partner
- [ ] AdminDashboard.js - Trang quản trị cho admin
- [ ] Advanced Filters - Price slider, brand checkboxes, stock filter

### Backend (Đã xong 100%)
- ✅ Multi-vendor system với ownership validation
- ✅ Role-based authorization (client, partner, admin)
- ✅ Revenue analytics APIs
- ✅ Product filtering và search
- ✅ Order management

---

## 🐳 DOCKER (Optional - Tương lai)

### Docker Compose Setup
```yaml
version: '3.8'
services:
  mongodb:
    image: mongo:6
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db
      
  backend:
    build: ./server
    ports:
      - "5000:5000"
    depends_on:
      - mongodb
    environment:
      - MONGO_URI=mongodb://mongodb:27017/laptop-db
      
  frontend:
    build: ./client
    ports:
      - "3000:3000"
    depends_on:
      - backend

volumes:
  mongo-data:
```

---

## 📞 HỖ TRỢ

### Lỗi thường gặp

**Lỗi: Cannot connect to MongoDB**
```
Solution: Kiểm tra MongoDB đang chạy
- Windows: MongoDB Compass > Connect
- Hoặc: mongod --dbpath "C:\data\db"
```

**Lỗi: 400 Bad Request khi login**
```
Solution: Chạy lại createUsers.js để tạo users
cd server
node createUsers.js
```

**Lỗi: 403 Forbidden khi CRUD product**
```
Solution: Đảm bảo đã login với đúng role (partner/admin)
- Partner chỉ edit được product của mình
- Admin edit được tất cả
```

---

## 🎓 KIẾN THỨC BỔ SUNG

### JWT Token Structure
```javascript
{
  "id": "user_id",
  "role": "partner",
  "username": "tech_seller",
  "iat": 1234567890,
  "exp": 1234571490  // 1 hour
}
```

### MongoDB Indexes (Tối ưu hóa)
```javascript
// Products collection
{ brand: 1, price: 1 }
{ createdBy: 1 }
{ name: "text", description: "text" }

// Orders collection
{ userId: 1, createdAt: -1 }
{ status: 1 }
```

---

**🎉 HỆ THỐNG SẴN SÀNG! Hãy bắt đầu test với Postman và MongoDB Compass!**
