# 🎭 Hướng Dẫn Phân Quyền & Vai Trò Hệ Thống

## 📋 Tổng Quan

Hệ thống Laptop Marketplace có **3 vai trò chính**:
1. **Client (Khách hàng)** - Người mua hàng
2. **Partner (Đối tác)** - Người bán hàng
3. **Admin (Quản trị viên)** - Quản lý toàn bộ hệ thống

---

## 👤 1. CLIENT - KHÁCH HÀNG

### Quyền Hạn
✅ Xem danh sách sản phẩm  
✅ Tìm kiếm & lọc sản phẩm  
✅ Xem chi tiết sản phẩm  
✅ Thêm sản phẩm vào giỏ hàng  
✅ Thêm sản phẩm vào wishlist  
✅ Đặt hàng  
✅ Xem lịch sử đơn hàng  
✅ Viết đánh giá sản phẩm (sau khi mua)  
✅ So sánh sản phẩm  

### Giới Hạn
❌ Không thể thêm/sửa/xóa sản phẩm  
❌ Không thể truy cập dashboard quản lý  
❌ Không thể xem thông tin đơn hàng của người khác  

### Đăng Ký
```
- Điền form đăng ký với role: "client"
- Email phải hợp lệ
- Mật khẩu tối thiểu 6 ký tự
- Tài khoản được kích hoạt ngay lập tức
```

### Routes Truy Cập
- `/` - Trang chủ
- `/product/:id` - Chi tiết sản phẩm
- `/cart` - Giỏ hàng
- `/wishlist` - Danh sách yêu thích
- `/orders` - Đơn hàng của tôi (cần đăng nhập)
- `/deals` - Ưu đãi
- `/best-sellers` - Bán chạy

---

## 🏪 2. PARTNER - ĐỐI TÁC BÁN HÀNG

### Quyền Hạn
✅ Tất cả quyền của Client  
✅ Thêm sản phẩm mới (sau khi được duyệt)  
✅ Sửa sản phẩm của mình  
✅ Xóa sản phẩm của mình  
✅ Bật/tắt trạng thái sản phẩm  
✅ Xem dashboard quản lý sản phẩm  
✅ Xem thống kê doanh thu của mình  
✅ Xem sản phẩm bán chạy của mình  

### Giới Hạn
❌ Không thể sửa/xóa sản phẩm của partner khác  
❌ Không thể xem doanh thu của partner khác  
❌ Không thể quản lý người dùng  
❌ Không thể duyệt sản phẩm/đánh giá  
❌ **Cần Admin phê duyệt tài khoản trước khi thêm sản phẩm**

### Đăng Ký
```
- Điền form đăng ký với role: "partner"
- Email phải hợp lệ
- Mật khẩu tối thiểu 6 ký tự
- Tên cửa hàng (shopName) là BẮT BUỘC
- Mô tả cửa hàng (shopDescription) tùy chọn
- Tài khoản ở trạng thái "Chờ duyệt"
- Chờ Admin phê duyệt (isApproved = true)
- Sau khi duyệt, có thể thêm sản phẩm
```

### Quy Trình Làm Việc
1. **Đăng ký tài khoản Partner**
   - Cung cấp thông tin cửa hàng
   - Hệ thống tạo tài khoản với `isApproved = false`

2. **Chờ Admin phê duyệt**
   - Đăng nhập được nhưng chỉ xem
   - Hiển thị banner: "Tài khoản đang chờ phê duyệt"
   - Không thể thêm sản phẩm

3. **Sau khi được duyệt**
   - Có thể thêm sản phẩm
   - Quản lý kho hàng
   - Xem thống kê doanh thu

4. **Quản lý sản phẩm**
   - Thêm sản phẩm mới
   - Cập nhật giá, tồn kho
   - Bật/tắt sản phẩm
   - Xóa sản phẩm

### Routes Truy Cập
- Tất cả routes của Client
- `/dashboard/partner` - Dashboard quản lý (cần đăng nhập)

### API Endpoints Partner
```
GET    /api/partner/my-products        - Lấy danh sách sản phẩm của mình
GET    /api/partner/stats              - Thống kê tổng quan
GET    /api/partner/revenue            - Doanh thu theo tháng
GET    /api/partner/revenue-by-brand   - Doanh thu theo thương hiệu
PATCH  /api/partner/products/:id/toggle-status - Bật/tắt sản phẩm
```

---

## 🛡️ 3. ADMIN - QUẢN TRỊ VIÊN

### Quyền Hạn (FULL ACCESS)
✅ Tất cả quyền của Client và Partner  
✅ Xem dashboard admin  
✅ Quản lý tất cả người dùng  
✅ Phê duyệt tài khoản Partner  
✅ Thay đổi role người dùng  
✅ Khóa/mở khóa tài khoản  
✅ Xóa người dùng  
✅ Quản lý tất cả sản phẩm (của mọi partner)  
✅ Duyệt/từ chối sản phẩm  
✅ Xóa bất kỳ sản phẩm nào  
✅ Quản lý đơn hàng  
✅ Cập nhật trạng thái đơn hàng  
✅ Quản lý đánh giá  
✅ Duyệt/từ chối đánh giá  
✅ Xem thống kê toàn hệ thống  
✅ Xem doanh thu tất cả partner  
✅ Xem chi tiết doanh thu từng partner  

### Trách Nhiệm
1. **Quản lý Partner**
   - Duyệt tài khoản partner mới
   - Kiểm tra thông tin cửa hàng
   - Khóa/mở khóa partner vi phạm

2. **Quản lý Sản phẩm**
   - Giám sát chất lượng sản phẩm
   - Xóa sản phẩm vi phạm
   - Đảm bảo thông tin chính xác

3. **Quản lý Đơn hàng**
   - Xử lý khiếu nại
   - Cập nhật trạng thái giao hàng
   - Giải quyết tranh chấp

4. **Quản lý Đánh giá**
   - Duyệt đánh giá của khách hàng
   - Xóa đánh giá spam/không phù hợp

### Routes Truy Cập
- Tất cả routes trong hệ thống
- `/dashboard/admin` - Dashboard quản trị (chỉ admin)

### API Endpoints Admin
```
# User Management
GET    /api/admin/users              - Danh sách người dùng (có filter)
GET    /api/admin/users/:id          - Chi tiết người dùng
PUT    /api/admin/users/:id          - Cập nhật người dùng (role, approval)
DELETE /api/admin/users/:id          - Xóa người dùng

# System Stats
GET    /api/admin/stats              - Thống kê tổng quan hệ thống
GET    /api/admin/revenue            - Doanh thu hệ thống theo tháng
GET    /api/admin/revenue-by-shop    - Doanh thu từng partner
GET    /api/admin/partners/:id/revenue - Chi tiết doanh thu 1 partner
```

---

## 🔐 Xác Thực & Phân Quyền

### Flow Đăng Nhập
```
1. User gửi email + password
2. Server kiểm tra:
   - Email tồn tại?
   - Password đúng?
   - Account isActive = true?
   - (Nếu partner) isApproved = true?
3. Tạo JWT token (expires 24h)
4. Trả về: token + user info
5. Client lưu token vào localStorage
6. Client decode token → AuthContext
```

### Middleware Auth
```javascript
// auth.js - Kiểm tra token
- Có token không?
- Token hợp lệ không?
- User còn tồn tại không?
- User isActive = true?
- (Partner) isApproved = true?
→ OK: req.user = decoded
→ FAIL: 401/403 error
```

### Middleware Authorize
```javascript
// authorize.js - Kiểm tra role
authorize('admin', 'partner')
→ Chỉ admin và partner mới pass
→ Client → 403 Forbidden
```

### Protected Routes
```javascript
// Backend
router.post('/products', 
    auth,                           // 1. Kiểm tra đăng nhập
    authorize('partner', 'admin'),  // 2. Kiểm tra role
    productController.createProduct // 3. Thực thi
);

// Frontend
<Route element={<PrivateRoute allowedRoles={['admin']} />}>
    <Route path="/dashboard/admin" element={<AdminDashboard />} />
</Route>
```

---

## 📊 Dashboard Features

### Client Dashboard (Orders Page)
- Xem đơn hàng của mình
- Track trạng thái đơn hàng
- Xem lịch sử mua hàng

### Partner Dashboard
**Tabs:**
1. **Tổng quan**
   - Tổng sản phẩm
   - Sản phẩm đang hoạt động
   - Hết hàng
   - Tổng doanh thu
   - Số lượng đã bán

2. **Sản phẩm của tôi**
   - Danh sách sản phẩm
   - Thêm/Sửa/Xóa
   - Bật/Tắt sản phẩm

3. **Thống kê**
   - Doanh thu theo tháng (6 tháng)
   - Doanh thu theo thương hiệu
   - Top sản phẩm bán chạy

### Admin Dashboard
**Tabs:**
1. **Tổng quan**
   - Cards: Revenue, Orders, Products, Users
   - Best sellers (top 5)
   - Low stock alerts
   - Recent activity

2. **Sản phẩm**
   - Danh sách tất cả sản phẩm
   - Filter by status/brand
   - Duyệt/Từ chối/Xóa

3. **Đơn hàng**
   - Tất cả đơn hàng
   - Cập nhật trạng thái
   - Xem chi tiết

4. **Người dùng**
   - Danh sách người dùng
   - Phê duyệt Partner
   - Thay đổi role
   - Xóa người dùng
   - Filter: All / Pending Partners

5. **Đánh giá**
   - Danh sách reviews
   - Duyệt/Từ chối

---

## 🎯 Best Practices

### Cho Partner
✅ Điền đầy đủ thông tin sản phẩm  
✅ Upload hình ảnh chất lượng cao  
✅ Cập nhật tồn kho thường xuyên  
✅ Trả lời đánh giá của khách hàng  
✅ Giá cả cạnh tranh  

### Cho Admin
✅ Duyệt partner trong 24h  
✅ Kiểm tra kỹ thông tin cửa hàng  
✅ Giám sát chất lượng sản phẩm  
✅ Xử lý khiếu nại nhanh chóng  
✅ Backup dữ liệu thường xuyên  

### Security
🔒 JWT token expires 24h  
🔒 Password hash với bcrypt  
🔒 Validation đầu vào  
🔒 CORS configured  
🔒 Rate limiting (nếu có)  
🔒 SQL Injection prevention (Mongoose)  

---

## 🧪 Testing Scenarios

### Test Partner Flow
```
1. Đăng ký tài khoản partner
2. Đăng nhập → Thấy banner "Chờ duyệt"
3. Admin login → Vào Users → Approve partner
4. Partner login lại → Banner biến mất
5. Thêm sản phẩm → Success
6. Xem dashboard → Thấy sản phẩm
7. Sửa giá → Success
8. Toggle active/inactive → Success
9. Xóa sản phẩm → Success
```

### Test Admin Flow
```
1. Admin login → Dashboard
2. Xem stats → Dữ liệu hiển thị
3. Vào Users → Thấy pending partners
4. Approve partner → Success
5. Vào Products → Thấy tất cả
6. Xóa sản phẩm bất kỳ → Success
7. Vào Orders → Cập nhật status → Success
8. Vào Reviews → Duyệt → Success
```

### Test Security
```
1. Client cố truy cập /dashboard/partner → Redirect
2. Partner cố truy cập /dashboard/admin → Redirect
3. Unapproved partner cố POST /products → 403
4. Invalid token → 401
5. Expired token → 401
6. No token → 401
```

---

## 📱 API Response Codes

### Success
- `200 OK` - Request thành công
- `201 Created` - Tạo mới thành công

### Client Errors
- `400 Bad Request` - Dữ liệu không hợp lệ
- `401 Unauthorized` - Chưa đăng nhập / Token invalid
- `403 Forbidden` - Không có quyền / Partner chưa duyệt
- `404 Not Found` - Không tìm thấy resource

### Server Errors
- `500 Internal Server Error` - Lỗi server

### Error Response Format
```json
{
    "message": "Mô tả lỗi bằng tiếng Việt",
    "code": "ERROR_CODE",
    "details": "Chi tiết bổ sung (optional)"
}
```

---

## 🚀 Quick Start Guide

### Cho Developer
```bash
# 1. Clone & Install
git clone <repo>
cd laptop-marketplace
npm install

# 2. Setup Environment
# Tạo .env trong thư mục server
MONGO_URI=mongodb://localhost:27017/laptop-marketplace
JWT_SECRET=your_secret_key_here
PORT=5000

# 3. Start Server
cd server
npm run dev

# 4. Start Client
cd client
npm start

# 5. Tạo Admin User (chạy script)
node server/createAdminUser.js
```

### Default Admin Account
```
Email: admin@laptop.com
Password: admin123
Role: admin
```

---

## 📞 Support

Nếu có vấn đề, liên hệ:
- Email: support@laptop-marketplace.com
- Phone: 1900-xxxx

---

**Cập nhật lần cuối:** 2025-11-10  
**Phiên bản:** 2.0  
**Tác giả:** Development Team
