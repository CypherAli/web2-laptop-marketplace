# 📋 TODO LIST - Laptop Marketplace

## ✅ Giai đoạn 1: Core Backend & Auth (HOÀN THÀNH)
- [x] Khởi tạo dự án với cấu trúc thư mục
- [x] Cài đặt dependencies (express, mongoose, dotenv, cors, bcryptjs, jwt)
- [x] Kết nối MongoDB (config/db.js)
- [x] Model User với role-based access
- [x] API Authentication (register, login)
- [x] Middleware auth.js và authorize.js

## ✅ Giai đoạn 2: Frontend & State Management (HOÀN THÀNH)
- [x] Setup React app
- [x] Cài đặt dependencies (axios, react-router-dom, jwt-decode)
- [x] AuthContext với login/logout/register
- [x] axiosConfig với interceptor
- [x] Pages: HomePage, LoginPage, RegisterPage

## ✅ Giai đoạn 3: CRUD Products (HOÀN THÀNH)
- [x] Model Product
- [x] API CRUD đầy đủ với authorization
- [x] PrivateRoute component
- [x] ManagerDashboard
- [x] Protected routes

## 🔄 Giai đoạn 4: Advanced Features (70% HOÀN THÀNH)
### Backend
- [x] Pagination (page, limit, skip)
- [x] Filter by price (maxPrice với $lte)
- [x] Filter by stock (inStock với $gt)
- [x] Sorting (price_asc, price_desc, newest)
- [x] Response structure (products, currentPage, totalPages, totalProducts)

### Frontend
- [x] Sidebar with filters
- [x] Filter by max price
- [x] Filter by in stock
- [x] Sort dropdown
- [x] Pagination component
- [x] Product grid responsive
- [x] Sale pricing display
- [x] SOLD OUT badge
- [ ] ~~Filter by brand/category~~ (Có thể bỏ qua)
- [ ] ~~Min price filter~~ (Có thể bỏ qua)

## 📦 Giai đoạn 5: Shopping Cart & Orders (CHƯA LÀM)
### Backend - Orders
- [ ] Model Order (userId, items[], totalAmount, status, createdAt)
- [ ] POST /api/orders - Tạo đơn hàng
- [ ] GET /api/orders/my-orders - Lấy đơn hàng của user
- [ ] GET /api/orders/:id - Chi tiết đơn hàng
- [ ] PUT /api/orders/:id/status - Cập nhật trạng thái (Manager/Admin)
- [ ] Logic: Kiểm tra stock, trừ stock sau khi đặt hàng

### Frontend - Cart
- [ ] CartContext để quản lý giỏ hàng
- [ ] Add to Cart button trên ProductCard
- [ ] CartPage hiển thị giỏ hàng
- [ ] Update quantity, remove item
- [ ] Calculate total
- [ ] Checkout button → gọi API create order
- [ ] OrdersPage để xem lịch sử đơn hàng

---

## 🎯 Ưu tiên tiếp theo:
1. **Order Model & API** (Backend)
2. **CartContext** (Frontend)
3. **CartPage** (Frontend)
4. **OrdersPage** (Frontend)

---

## 📊 Tiến độ tổng thể: 80%
- Giai đoạn 1: ✅ 100%
- Giai đoạn 2: ✅ 100%
- Giai đoạn 3: ✅ 100%
- Giai đoạn 4: ✅ 95%
- Giai đoạn 5: ⏳ 0%
