# 🧪 HƯỚNG DẪN TEST HỆ THỐNG USER ROLE

## ✅ ĐÃ HOÀN THÀNH

### 1. ✅ Xóa Text "Khách Hàng" 
- **File**: `client/src/components/RoleBasedLayout.css`
- **Thay đổi**: Đã xóa text "Khách Hàng", chỉ giữ lại icon 🛒
- **Dòng 76**: `content: '🛒 Khách Hàng';` → `content: '🛒';`

### 2. ✅ Kiểm Tra Code Logic
| Component | Status | Mô tả |
|-----------|--------|-------|
| **AuthContext.js** | ✅ Tốt | Token decode, expiration check, role handling |
| **PrivateRoute.js** | ✅ Tốt | Role checking, redirect logic, partner approval |
| **auth.js middleware** | ✅ Tốt | Token verify, user validation, role check |
| **authorize.js middleware** | ✅ Tốt | Role-based authorization với error messages |
| **User Model** | ✅ Tốt | Role enum (client, partner, admin), isApproved logic |
| **App.js Routing** | ✅ Tốt | Protected routes theo role, RoleBasedLayout wrap |

---

## 🧪 HƯỚNG DẪN TEST THỰC TẾ

### 📍 Truy cập: http://localhost:3000

### 🎯 TEST FLOW CHO MỖI ROLE

## 1️⃣ TEST CLIENT ROLE (Khách hàng)

### A. Đăng ký tài khoản Client
1. Truy cập: http://localhost:3000/register
2. Điền thông tin:
   - Username: `test_client`
   - Email: `client@test.com`
   - Password: `123456`
   - Role: **Client** (default)
3. Nhấn "Đăng ký"
4. **Kết quả mong đợi**: Tài khoản được tạo thành công

### B. Đăng nhập Client
1. Truy cập: http://localhost:3000/login
2. Đăng nhập với:
   - Email: `client@test.com`
   - Password: `123456`
3. **Kết quả mong đợi**:
   - ✅ Đăng nhập thành công
   - ✅ Hiển thị badge **🛒** (KHÔNG có text "Khách Hàng") ở góc phải trên
   - ✅ Header hiển thị tên user: `test_client`
   - ✅ Menu dropdown có: Hồ sơ, Đơn hàng, Đăng xuất
   - ❌ KHÔNG hiển thị: Admin Dashboard, Quản lý sản phẩm

### C. Test Permissions Client
| Tính năng | Truy cập | Kết quả |
|-----------|---------|---------|
| Trang chủ | ✅ | OK |
| Xem sản phẩm | ✅ | OK |
| Giỏ hàng | ✅ | OK |
| Thanh toán | ✅ | OK |
| Đơn hàng của tôi | ✅ | OK |
| Hồ sơ | ✅ | OK |
| Dashboard Partner | ❌ | Redirect về home |
| Dashboard Admin | ❌ | Redirect về home |

### D. Test UI Client
- [ ] Badge 🛒 hiển thị ở góc phải trên (KHÔNG có text)
- [ ] Theme màu xanh dương (#3498db)
- [ ] Smooth animations
- [ ] Không có lỗi console

---

## 2️⃣ TEST PARTNER ROLE (Đối tác)

### A. Đăng ký tài khoản Partner
1. Truy cập: http://localhost:3000/register
2. Điền thông tin:
   - Username: `test_partner`
   - Email: `partner@test.com`
   - Password: `123456`
   - Role: **Partner**
   - Shop Name: `Test Shop`
3. Nhấn "Đăng ký"
4. **Kết quả mong đợi**: Tài khoản được tạo, chờ admin duyệt

### B. Approve Partner (Admin phải làm)
```javascript
// Truy cập MongoDB hoặc dùng Admin Dashboard
// Cập nhật: isApproved = true cho user partner@test.com
```

### C. Đăng nhập Partner
1. Truy cập: http://localhost:3000/login
2. Đăng nhập với:
   - Email: `partner@test.com`
   - Password: `123456`
3. **Kết quả mong đợi**:
   - ✅ Đăng nhập thành công
   - ✅ Hiển thị badge **🤝 Đối Tác** ở góc phải trên
   - ✅ Hiển thị badge **📊 Dashboard** bên dưới
   - ✅ Header có menu: Quản lý sản phẩm
   - ❌ KHÔNG hiển thị: Admin Dashboard (trừ khi admin)

### D. Test Permissions Partner
| Tính năng | Truy cập | Kết quả |
|-----------|---------|---------|
| Dashboard Partner | ✅ | OK |
| Quản lý sản phẩm | ✅ | OK |
| Thêm/Sửa/Xóa sản phẩm | ✅ | OK (chỉ sản phẩm của mình) |
| Xem doanh thu | ✅ | OK |
| Dashboard Admin | ❌ | Redirect về home |

### E. Test UI Partner
- [ ] Badge 🤝 Đối Tác hiển thị
- [ ] Badge 📊 Dashboard bên dưới
- [ ] Theme màu xanh lá (#16a085)
- [ ] Không có lỗi console

---

## 3️⃣ TEST ADMIN ROLE (Quản trị viên)

### A. Đăng nhập Admin
1. Truy cập: http://localhost:3000/login
2. Đăng nhập với tài khoản admin có sẵn hoặc tạo mới
3. **Kết quả mong đợi**:
   - ✅ Đăng nhập thành công
   - ✅ Hiển thị badge **👑 ADMIN** ở góc phải trên (có animation pulse)
   - ✅ Hiển thị badge **⚙️ Full Control** bên dưới
   - ✅ Header có menu: Admin Dashboard, Quản lý sản phẩm
   - ✅ Có thể truy cập TẤT CẢ routes

### B. Test Permissions Admin
| Tính năng | Truy cập | Kết quả |
|-----------|---------|---------|
| Dashboard Admin | ✅ | OK |
| Dashboard Partner | ✅ | OK |
| Quản lý Users | ✅ | OK |
| Duyệt Partner | ✅ | OK |
| Quản lý tất cả sản phẩm | ✅ | OK |
| Quản lý đơn hàng | ✅ | OK |
| Thống kê hệ thống | ✅ | OK |

### C. Test UI Admin
- [ ] Badge 👑 ADMIN hiển thị với animation pulse
- [ ] Badge ⚙️ Full Control bên dưới
- [ ] Theme màu tím (#8e44ad)
- [ ] Không có lỗi console

---

## 🔒 TEST SECURITY & AUTHORIZATION

### 1. Test Token Expiration
```javascript
// Trong browser console:
localStorage.clear(); // Xóa token
// Refresh page → Phải redirect về login
```

### 2. Test Role Protection
```javascript
// Thử truy cập trực tiếp URL khi không có quyền:
// Client thử truy cập:
http://localhost:3000/dashboard/admin  // → Redirect về home
http://localhost:3000/dashboard/partner // → Redirect về home

// Partner thử truy cập:
http://localhost:3000/dashboard/admin  // → Redirect về home
```

### 3. Test API Authorization
```javascript
// Dùng Postman hoặc fetch trong console:
// Thử gọi API admin endpoint với client token → 403 Forbidden
fetch('http://localhost:5000/api/admin/users', {
    headers: {
        'Authorization': 'Bearer <client_token>'
    }
})
// Kết quả mong đợi: 403 Forbidden
```

---

## 🎨 TEST UI & UX

### 1. Kiểm tra Badge Display
- [ ] Guest (chưa login): Không có badge
- [ ] Client: Badge 🛒 (KHÔNG có text "Khách Hàng")
- [ ] Partner: Badge 🤝 Đối Tác + 📊 Dashboard
- [ ] Admin: Badge 👑 ADMIN + ⚙️ Full Control

### 2. Kiểm tra Theme Colors
- [ ] Guest: Gradient tím (#667eea → #764ba2)
- [ ] Client: Gradient xanh dương (#3498db → #2980b9)
- [ ] Partner: Gradient xanh lá (#16a085 → #1abc9c)
- [ ] Admin: Gradient tím đậm (#8e44ad → #9b59b6)

### 3. Kiểm tra Responsive
- [ ] Mobile (< 768px): Badges nhỏ hơn, vị trí điều chỉnh
- [ ] Tablet (768px - 1024px): OK
- [ ] Desktop (> 1024px): OK

---

## 🐛 CHECKLIST TESTING

### Frontend
- [ ] Không có lỗi trong Console (F12)
- [ ] Không có warning trong Console
- [ ] Badges hiển thị đúng theo role
- [ ] Text "Khách Hàng" đã bị xóa (chỉ còn 🛒)
- [ ] Navigation menu hiển thị đúng theo role
- [ ] Redirect đúng khi không có quyền
- [ ] Logout hoạt động tốt

### Backend
- [ ] Server chạy ổn định (port 5000)
- [ ] Database connected
- [ ] Token verification hoạt động
- [ ] Role middleware hoạt động
- [ ] API trả về đúng error codes
- [ ] Không có lỗi trong server logs

### Database
- [ ] User collection có field `role`
- [ ] Role enum đúng: client, partner, admin
- [ ] isApproved logic hoạt động
- [ ] Token stored correctly

---

## 📝 MANUAL TESTING CHECKLIST

### Bước 1: Test Guest (Chưa đăng nhập)
- [ ] Vào trang chủ → OK
- [ ] Thử truy cập /profile → Redirect login
- [ ] Thử truy cập /dashboard/admin → Redirect login

### Bước 2: Test Client Login
- [ ] Đăng ký client → Success
- [ ] Đăng nhập → Success
- [ ] Badge 🛒 hiển thị (không có text)
- [ ] Truy cập /profile → OK
- [ ] Truy cập /dashboard/admin → Redirect home
- [ ] Đăng xuất → OK

### Bước 3: Test Partner Login
- [ ] Đăng ký partner → Success (chờ duyệt)
- [ ] Admin approve → OK
- [ ] Đăng nhập → Success
- [ ] Badge 🤝 + 📊 hiển thị
- [ ] Truy cập /dashboard/partner → OK
- [ ] Truy cập /dashboard/admin → Redirect home

### Bước 4: Test Admin Login
- [ ] Đăng nhập admin → Success
- [ ] Badge 👑 + ⚙️ hiển thị với animation
- [ ] Truy cập /dashboard/admin → OK
- [ ] Truy cập /dashboard/partner → OK
- [ ] Approve partner requests → OK

---

## 🚀 KẾT LUẬN

### ✅ Đã hoàn thành:
1. ✅ Xóa text "Khách Hàng" khỏi badge client
2. ✅ AuthContext logic hoàn hảo
3. ✅ PrivateRoute protection tốt
4. ✅ Backend middleware authorization
5. ✅ User model với role system
6. ✅ RoleBasedLayout với theme riêng

### 🎯 Hệ thống Role hoạt động:
- **Frontend**: Component protection, UI theo role
- **Backend**: API authorization, middleware checking
- **Database**: Role enum, isApproved logic
- **Security**: Token expiration, role verification

### 💡 Lưu ý:
- Badge client chỉ hiển thị icon 🛒 (không có text)
- Mỗi role có theme color riêng
- Protected routes redirect về home nếu không có quyền
- Partner cần admin approve trước khi sử dụng đầy đủ

---

## 📞 HỖ TRỢ

Nếu có vấn đề:
1. Check console (F12) xem có errors
2. Check server logs xem API response
3. Check localStorage có token không
4. Verify user role trong database

**Server logs**: Terminal đang chạy `npm start` trong folder server
**Client logs**: Console trong browser (F12)
