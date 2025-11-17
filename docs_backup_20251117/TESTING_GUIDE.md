# 🧪 HƯỚNG DẪN TEST HỆ THỐNG LAPTOP MARKETPLACE

## 📋 Checklist kiểm tra hoàn chỉnh

### 1. ✅ KIỂM TRA BACKEND (Server)

#### Bước 1: Start Server
```powershell
cd e:\laptop-marketplace\server
npm start
```

**Kết quả mong đợi:**
```
✅ Server running on port 5000
✅ MongoDB Connected...
```

#### Bước 2: Test APIs với Postman

**Test Product API:**
```
GET http://localhost:5000/api/products
Expected: Status 200, Array of products
```

**Test Review API:**
```
GET http://localhost:5000/api/reviews/product/{productId}
Expected: Status 200, Array of reviews
```

**Test Analytics API (cần auth):**
```
GET http://localhost:5000/api/analytics/dashboard
Headers: Authorization: Bearer {token}
Expected: Status 200, Dashboard stats
```

---

### 2. ✅ KIỂM TRA FRONTEND (Client)

#### Bước 1: Start Client
```powershell
cd e:\laptop-marketplace\client
npm start
```

**Kết quả mong đợi:**
```
✅ Compiled successfully!
✅ webpack compiled successfully
✅ Browser opens at http://localhost:3000
```

#### Bước 2: Test Pages

**HomePage (http://localhost:3000)**
- [ ] Hero Banner hiển thị đúng
- [ ] Best Sellers carousel hoạt động
- [ ] Sidebar filters hiển thị
- [ ] Product grid load được sản phẩm
- [ ] Pagination hoạt động
- [ ] Testimonials hiển thị

**Product Detail Page**
1. Click vào 1 sản phẩm
2. Kiểm tra:
   - [ ] Product info hiển thị đầy đủ
   - [ ] Add to Cart button hoạt động
   - [ ] Wishlist button hoạt động
   - [ ] Compare button hiển thị
   - [ ] Reviews section hiển thị
   - [ ] Related products hiển thị

---

### 3. ✅ KIỂM TRA CLIENT (Khách hàng)

#### Test Flow: Browse → Compare → Review → Cart → Checkout

**Step 1: Đăng ký tài khoản mới**
1. Click "Đăng ký" ở Header
2. Nhập thông tin:
   - Name: Test User
   - Email: test@gmail.com
   - Password: test123
3. Click "Đăng ký"
4. **Expected**: Redirect to login, show success message

**Step 2: Đăng nhập**
1. Login với account vừa tạo
2. **Expected**: Redirect to HomePage, show username in header

**Step 3: Tìm kiếm & Filter sản phẩm**
1. Ở HomePage, thử search "Dell"
2. Chọn filter: RAM = 16GB
3. Chọn filter: Price range 20000000 - 30000000
4. Click "Tìm kiếm"
5. **Expected**: Product grid update với kết quả phù hợp

**Step 4: So sánh sản phẩm (Product Comparison)**
1. Click Compare button trên 3 sản phẩm khác nhau
2. **Expected**: CompareBar xuất hiện ở bottom
3. Click "Compare Now"
4. **Expected**: Modal comparison hiển thị side-by-side specs

**Step 5: Thêm vào Wishlist**
1. Click heart icon trên 2-3 sản phẩm
2. Click "Yêu thích" ở header
3. **Expected**: Wishlist page hiển thị các sản phẩm đã thêm

**Step 6: Thêm vào Cart**
1. Ở product detail page
2. Select quantity = 2
3. Click "Thêm vào giỏ"
4. **Expected**: Toast notification, cart badge update

**Step 7: Viết Review**
1. Ở product detail page (sau khi login)
2. Click "Viết đánh giá"
3. Fill form:
   - Rating: 5 stars
   - Title: "Sản phẩm tuyệt vời!"
   - Comment: "Máy rất nhanh, đáp ứng tốt nhu cầu..."
   - Pros: ["Hiệu năng cao", "Pin tốt"]
   - Cons: ["Giá hơi cao"]
4. Click "Gửi đánh giá"
5. **Expected**: Review được thêm vào danh sách

**Step 8: Checkout**
1. Click "Giỏ hàng" ở header
2. Xem lại items
3. Click "Thanh toán"
4. Fill shipping info
5. Click "Đặt hàng"
6. **Expected**: Order created, redirect to orders page

---

### 4. ✅ KIỂM TRA PARTNER (Đối tác)

#### Test Flow: Create Product → Edit → Manage

**Step 1: Đăng nhập Partner**
```
Email: partner@laptop.com
Password: partner123
```

**Step 2: Truy cập Partner Dashboard**
1. Click username → "Quản lý sản phẩm"
2. URL: http://localhost:3000/dashboard/partner
3. **Expected**: Partner dashboard hiển thị

**Step 3: Tạo sản phẩm mới**
1. Click "Thêm sản phẩm mới"
2. Fill form:
   - Tên: "Dell Latitude 5420 Test"
   - Brand: Dell
   - Description: "Test product..."
   - Price: 25000000
   - Stock: 10
   - Image URL: (optional)
3. Click "Tạo sản phẩm"
4. **Expected**: 
   - Success message
   - Product xuất hiện với status "Chờ duyệt"

**Step 4: Chỉnh sửa sản phẩm**
1. Click "Sửa" trên 1 sản phẩm
2. Update price: 23000000
3. Click "Cập nhật"
4. **Expected**: Product updated, success message

**Step 5: Xóa sản phẩm**
1. Click "Xóa" trên 1 sản phẩm test
2. Confirm deletion
3. **Expected**: Product removed from list

**Step 6: Trả lời Review**
1. Vào product detail page của sản phẩm mình
2. Xem review từ customer
3. Click "Trả lời" (nếu có)
4. Nhập response
5. **Expected**: Seller response hiển thị dưới review

---

### 5. ✅ KIỂM TRA ADMIN (Quản trị viên)

#### Test Flow: Overview → Approve → Manage

**Step 1: Đăng nhập Admin**
```
Email: admin@laptop.com
Password: admin123
```

**Step 2: Truy cập Admin Dashboard**
1. Click username → "Admin Dashboard"
2. URL: http://localhost:3000/dashboard/admin
3. **Expected**: Admin dashboard hiển thị đầy đủ stats

**Step 3: Overview Tab**
1. Kiểm tra Stats Cards:
   - [ ] Tổng doanh thu hiển thị
   - [ ] Tổng đơn hàng hiển thị
   - [ ] Tổng sản phẩm hiển thị
   - [ ] Tổng users hiển thị
2. Kiểm tra Best Sellers list
3. Kiểm tra Low Stock Alerts
4. **Expected**: Tất cả data load đúng

**Step 4: Products Tab - Duyệt sản phẩm**
1. Click tab "Sản phẩm"
2. Tìm product có status "pending"
3. Click "Duyệt" (checkmark icon)
4. **Expected**: Status chuyển sang "approved"
5. Thử "Từ chối" 1 sản phẩm khác
6. **Expected**: Status chuyển sang "rejected"

**Step 5: Orders Tab - Quản lý đơn hàng**
1. Click tab "Đơn hàng"
2. Chọn 1 order
3. Change status: "Pending" → "Confirmed"
4. **Expected**: Order status updated
5. Try other statuses: Processing → Shipped → Delivered

**Step 6: Users Tab - Quản lý người dùng**
1. Click tab "Người dùng"
2. Tìm 1 user với role "client"
3. Change role to "partner"
4. **Expected**: User role updated
5. Verify user can now access partner dashboard

**Step 7: Reviews Tab - Kiểm duyệt đánh giá**
1. Click tab "Đánh giá"
2. Tìm review có status "Chờ duyệt"
3. Click "Duyệt"
4. **Expected**: Review được approve và hiển thị public
5. Thử "Từ chối" 1 review khác
6. **Expected**: Review bị ẩn

---

### 6. ✅ KIỂM TRA TÍNH NĂNG ĐẶC BIỆT

#### Product Comparison
1. Add 4 sản phẩm vào comparison
2. **Expected**: CompareBar hiển thị đầy đủ 4 products
3. Try to add product thứ 5
4. **Expected**: Hiển thị thông báo "Tối đa 4 sản phẩm"
5. Remove 1 product từ CompareBar
6. **Expected**: Product removed, counter update
7. Click "Compare Now"
8. **Expected**: Modal hiển thị comparison table
9. Click "Share" button
10. **Expected**: Copy comparison link to clipboard

#### Review System
1. Write review với images (if supported)
2. **Expected**: Images hiển thị trong review
3. Click "Helpful" trên review của người khác
4. **Expected**: Helpful count tăng lên
5. Edit own review
6. **Expected**: Inline edit form hiển thị, update thành công
7. Delete own review
8. **Expected**: Review deleted, list update

#### Filters & Search
1. Apply multiple filters cùng lúc:
   - Brand: Dell, HP
   - RAM: 8GB, 16GB
   - Price: 15000000 - 25000000
2. **Expected**: Products match ALL filters
3. Clear filters
4. **Expected**: Show all products again

---

### 7. ✅ KIỂM TRA RESPONSIVE

#### Mobile View (< 768px)
1. Open DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Select "iPhone 12 Pro"
4. Kiểm tra:
   - [ ] Header responsive
   - [ ] Navigation menu mobile
   - [ ] Product grid 1-2 columns
   - [ ] Filters collapse
   - [ ] Footer responsive
5. **Expected**: UI hoàn toàn responsive

#### Tablet View (768px - 1024px)
1. Select "iPad"
2. Kiểm tra:
   - [ ] Product grid 2-3 columns
   - [ ] Sidebar filters hoạt động
   - [ ] CompareBar responsive
3. **Expected**: Layout adapt well

---

### 8. ✅ KIỂM TRA PERFORMANCE

#### Page Load Time
1. Open DevTools → Network tab
2. Reload HomePage
3. **Expected**: Load < 3 seconds

#### Image Loading
1. Check product images load
2. **Expected**: Lazy loading works, no broken images

#### API Response Time
1. Open DevTools → Network tab
2. Filter XHR/Fetch
3. Check API calls
4. **Expected**: Most APIs respond < 500ms

---

### 9. ✅ KIỂM TRA ERROR HANDLING

#### Invalid Login
1. Try login with wrong password
2. **Expected**: Show error message "Invalid credentials"

#### Empty Cart Checkout
1. Go to cart with 0 items
2. Try checkout
3. **Expected**: Show message "Cart is empty"

#### Unauthorized Access
1. Logout
2. Try access /dashboard/admin directly
3. **Expected**: Redirect to login

#### 404 Page
1. Navigate to /invalid-route
2. **Expected**: Show 404 page

---

### 10. ✅ KIỂM TRA DATA PERSISTENCE

#### LocalStorage
1. Add products to comparison
2. Refresh page
3. **Expected**: CompareBar still shows products

#### Cart Persistence
1. Add items to cart
2. Close browser
3. Reopen
4. **Expected**: Cart items preserved

#### Auth Token
1. Login
2. Refresh page multiple times
3. **Expected**: Stay logged in

---

## 🎯 TESTING SUMMARY

### Critical Tests (Must Pass)
- [ ] Server starts without errors
- [ ] Client compiles successfully
- [ ] Login/Register works
- [ ] Products display on HomePage
- [ ] Add to Cart works
- [ ] Checkout creates order
- [ ] Admin can approve products
- [ ] Partner can create products

### Important Tests (Should Pass)
- [ ] Product comparison works
- [ ] Review system works
- [ ] Filters work correctly
- [ ] Responsive design works
- [ ] Role permissions correct

### Nice-to-Have Tests (Optional)
- [ ] Performance optimized
- [ ] Error messages clear
- [ ] UI/UX smooth
- [ ] No console errors

---

## 🐛 BUG REPORTING

Nếu phát hiện lỗi, ghi lại:
1. **Steps to reproduce** (Các bước tái hiện)
2. **Expected behavior** (Hành vi mong đợi)
3. **Actual behavior** (Hành vi thực tế)
4. **Screenshots** (Ảnh chụp màn hình)
5. **Console errors** (Lỗi trong console)

---

## ✅ CHECKLIST TỔNG QUAN

### Backend
- [ ] Server starts successfully
- [ ] MongoDB connection established
- [ ] All APIs respond correctly
- [ ] Authentication works
- [ ] Authorization works

### Frontend
- [ ] Client compiles without errors
- [ ] All pages load correctly
- [ ] Navigation works
- [ ] Components render properly
- [ ] No console errors

### Features
- [ ] Product listing & filtering
- [ ] Product comparison
- [ ] Review system
- [ ] Cart & Checkout
- [ ] Order management
- [ ] Admin dashboard
- [ ] Partner dashboard

### Quality
- [ ] Responsive design
- [ ] Performance acceptable
- [ ] Error handling works
- [ ] Data persistence
- [ ] Security (RBAC)

---

**🎉 Nếu tất cả các tests PASS → Hệ thống sẵn sàng DEMO!**

*Last updated: ${new Date().toLocaleDateString('vi-VN')}*
