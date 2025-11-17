# 🚀 LAPTOP MARKETPLACE - HƯỚNG DẪN SỬ DỤNG HOÀN CHỈNH

## ⚡ KHỞI ĐỘNG NHANH

### Cách 1: Sử dụng file START.bat (Khuyến nghị)
```bash
# Chỉ cần double-click file này:
START.bat
```
File này sẽ tự động:
- ✅ Dừng các tiến trình Node.js cũ
- ✅ Khởi động MongoDB (nếu chưa chạy)
- ✅ Khởi động Backend Server (Port 5000)
- ✅ Khởi động Frontend Client (Port 3000)

### Cách 2: Khởi động thủ công

**Terminal 1 - Backend:**
```bash
cd server
node server.js
```

**Terminal 2 - Frontend:**
```bash
cd client
npm start
```

---

## 🎯 TÍNH NĂNG HOÀN CHỈNH

### ✅ 1. HỆ THỐNG XÁC THỰC
- ✅ Đăng ký tài khoản (Client, Partner, Admin)
- ✅ Đăng nhập với JWT (24h token)
- ✅ Phân quyền theo Role
- ✅ Partner cần Admin phê duyệt

### ✅ 2. TRANG HỒ SƠ NGƯỜI DÙNG (PROFILE)
**Đã hoàn thành 100%!**

**Truy cập:** `/profile` (yêu cầu đăng nhập)

**Tính năng:**
- ✅ Upload ảnh đại diện (Avatar)
  - Kích thước tối đa: 5MB
  - Định dạng: JPG, PNG, GIF, WEBP
  - Xem trước ảnh trước khi upload
  - Nút xóa ảnh đã chọn
- ✅ Cập nhật thông tin cá nhân:
  - Tên đầy đủ
  - Tên đăng nhập (kiểm tra trùng)
  - Email (kiểm tra trùng)
  - Số điện thoại
  - Địa chỉ
  - Tên cửa hàng (dành cho Partner)
- ✅ Đổi mật khẩu:
  - Nhập mật khẩu hiện tại
  - Nhập mật khẩu mới (tối thiểu 6 ký tự)
  - Xác nhận mật khẩu mới
- ✅ Hiển thị vai trò với badge màu sắc
- ✅ Toast thông báo thành công/lỗi
- ✅ Responsive design (Mobile, Tablet, Desktop)

**API Endpoint:**
```
PUT /api/auth/profile
- Middleware: auth (JWT verification)
- Upload: multer.single('avatar')
- Lưu file tại: server/uploads/avatars/
```

### ✅ 3. ADMIN DASHBOARD - DOANH THU
**Đã hoàn thành 100%!**

**Truy cập:** `/dashboard/admin` (chỉ Admin)

**Hiển thị Doanh Thu ở 2 nơi:**

#### A. Card "SYSTEM REVENUE" (Tab Overview)
- 💰 Tổng doanh thu toàn hệ thống
- 📊 Hiển thị số tiền từ tất cả đơn hàng "delivered"
- 🔄 Cập nhật real-time khi load trang

#### B. Tab "Revenue" chuyên biệt
- 📋 Bảng chi tiết doanh thu từng Partner
- 📈 Thông tin mỗi Partner:
  - Tên Partner
  - Số sản phẩm
  - Số đơn hàng
  - Tổng doanh thu
  - Trạng thái (Active/Inactive)
  - Thời gian tham gia
- 🔍 Giúp Admin theo dõi hiệu suất từng đối tác

**API Endpoints:**
```
GET /api/admin/stats
- Trả về: { revenue: { total, average }, orders, products, users }

GET /api/admin/revenue-by-shop
- Trả về: [{ partnerId, shopName, revenue, products, orders, ... }]
```

### ✅ 4. QUẢN LÝ SẢN PHẨM
- Thêm/Sửa/Xóa sản phẩm
- Upload nhiều ảnh
- Quản lý tồn kho
- Lọc theo danh mục, giá, RAM, CPU

### ✅ 5. GIỎ HÀNG & THANH TOÁN
- Thêm vào giỏ hàng
- Cập nhật số lượng
- Tính tổng tiền tự động
- Thanh toán và tạo đơn hàng

### ✅ 6. QUẢN LÝ ĐƠN HÀNG
- Xem lịch sử đơn hàng
- Theo dõi trạng thái
- Partner cập nhật trạng thái giao hàng
- Admin quản lý toàn bộ đơn hàng

---

## 🔐 TÀI KHOẢN MẪU

### Admin
```
Email: admin@example.com
Password: admin123
```

### Partner
```
Email: partner@example.com
Password: partner123
```

### Client
```
Email: client@example.com
Password: client123
```

---

## 🌐 ĐƯỜNG DẪN QUAN TRỌNG

### Frontend
- Trang chủ: `http://localhost:3000`
- Đăng nhập: `http://localhost:3000/login`
- Đăng ký: `http://localhost:3000/register`
- **Profile: `http://localhost:3000/profile`** ⭐ MỚI
- Sản phẩm: `http://localhost:3000/products`
- Giỏ hàng: `http://localhost:3000/cart`
- Đơn hàng: `http://localhost:3000/orders`

### Admin
- **Dashboard: `http://localhost:3000/dashboard/admin`** ⭐ Xem doanh thu
- Quản lý Users: Tab "Users"
- Quản lý Products: Tab "Products"
- Quản lý Orders: Tab "Orders"
- **Xem Revenue: Tab "Revenue"** ⭐ MỚI

### Partner
- Dashboard: `http://localhost:3000/dashboard/partner`
- Quản lý sản phẩm của Partner
- Quản lý đơn hàng của Partner

### Backend API
- Base URL: `http://localhost:5000/api`
- Health check: `http://localhost:5000`

---

## 📁 CẤU TRÚC THỨ MỤC

```
laptop-marketplace/
├── START.bat                      ⭐ Script khởi động tổng hợp
├── server/
│   ├── server.js                  Server chính
│   ├── controllers/
│   │   ├── authController.js      ✅ Có updateProfile
│   │   ├── adminController.js     ✅ Có getDashboardStats, getRevenueByShop
│   │   └── ...
│   ├── routes/
│   │   ├── authRoute.js           ✅ Route PUT /profile với multer
│   │   └── ...
│   ├── middleware/
│   │   ├── auth.js                JWT verification
│   │   └── authorize.js           Role-based access
│   ├── models/
│   │   ├── User.js                Schema với avatar field
│   │   └── ...
│   └── uploads/
│       └── avatars/               ✅ Lưu trữ ảnh đại diện
│
└── client/
    ├── src/
    │   ├── App.js                 ✅ Route /profile đã enable
    │   ├── pages/
    │   │   ├── ProfilePage.js     ✅ Trang profile hoàn chỉnh
    │   │   ├── ProfilePage.css    ✅ Styling chuyên nghiệp
    │   │   └── AdminDashboard.js  ✅ Hiển thị revenue
    │   └── components/
    │       └── Header.js          ✅ Link đến /profile trong dropdown
    └── ...
```

---

## 🛠️ TROUBLESHOOTING

### Vấn đề: Backend không khởi động
**Giải pháp:**
```bash
# Kiểm tra MongoDB có chạy không
net start MongoDB

# Kiểm tra port 5000 có bị chiếm không
netstat -ano | findstr :5000

# Kill tiến trình nếu cần
taskkill /F /PID <PID>
```

### Vấn đề: Frontend không kết nối Backend
**Giải pháp:**
```bash
# Kiểm tra file client/package.json có proxy
"proxy": "http://localhost:5000"

# Restart frontend
cd client
npm start
```

### Vấn đề: Upload avatar không hoạt động
**Giải pháp:**
```bash
# Kiểm tra thư mục uploads tồn tại
# Tự động tạo bởi authRoute.js khi server khởi động

# Kiểm tra quyền ghi file
# Windows thường không có vấn đề này
```

### Vấn đề: Profile page hiển thị 404
**Giải pháp:**
- ✅ Đảm bảo đã đăng nhập
- ✅ Kiểm tra route trong `App.js` đã uncomment
- ✅ Kiểm tra backend API `/api/auth/profile` hoạt động
- ✅ Clear browser cache và reload

---

## 🎨 DESIGN HIGHLIGHTS

### Profile Page
- **Gradient Header:** Purple to Pink (#667eea → #764ba2)
- **Avatar Section:** 150px circular với hover effects
- **Form Layout:** 2-column responsive grid
- **Role Badges:** Color-coded (Admin: Red, Partner: Blue, Client: Green)
- **Buttons:** Primary actions với hover animations

### Admin Dashboard
- **Sidebar Navigation:** Fixed left sidebar với icons
- **Metric Cards:** Grid layout với icons và real-time data
- **Revenue Tab:** Professional table với sorting capabilities
- **Color Scheme:** Professional blue/gray palette

---

## 📝 CHANGELOG

### Version 1.0.0 (Current)
✅ **HOÀN THÀNH 100%**

**Tính năng mới:**
1. ✅ Profile Page với upload avatar
2. ✅ Admin Revenue Dashboard
3. ✅ Backend API updateProfile
4. ✅ Multer file upload integration
5. ✅ Revenue by Partner statistics

**Bug Fixes:**
1. ✅ Fix authController.js export issue
2. ✅ Fix authRoute.js multer configuration
3. ✅ Enable profile route in App.js
4. ✅ Clean up file duplication issues

**Improvements:**
1. ✅ Professional UI/UX design
2. ✅ Responsive mobile layout
3. ✅ Toast notifications
4. ✅ Form validation
5. ✅ Error handling

---

## 🚀 NEXT STEPS (Tùy chọn)

### Tính năng có thể mở rộng:
1. 📧 Email verification
2. 🔄 Password reset via email
3. 📊 Advanced analytics charts
4. 🖼️ Multiple avatar formats
5. 🌍 Multi-language support
6. 📱 PWA support
7. 🔔 Real-time notifications

---

## 📞 HỖ TRỢ

Nếu gặp vấn đề:
1. Kiểm tra console logs (F12 trong browser)
2. Kiểm tra terminal logs (backend và frontend)
3. Xem file này để troubleshoot
4. Restart cả backend và frontend

---

## ✅ CHECKLIST HOÀN THÀNH

- [x] Backend server chạy ổn định
- [x] Frontend client chạy ổn định
- [x] Profile page hoàn chỉnh
- [x] Avatar upload working
- [x] Admin revenue dashboard working
- [x] All API endpoints tested
- [x] Responsive design verified
- [x] Authentication working
- [x] Authorization working
- [x] File uploads working
- [x] Database connected
- [x] Error handling implemented
- [x] Toast notifications working
- [x] START.bat script created
- [x] Documentation completed

**🎉 HỆ THỐNG ĐÃ HOÀN THIỆN 100%! 🎉**
