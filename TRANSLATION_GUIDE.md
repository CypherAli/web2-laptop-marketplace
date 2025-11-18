# Vietnamese to English Translation Guide

## ✅ COMPLETED FILES

### 1. Header & Footer
- ✅ `client/src/components/layout/Header.js`
- ✅ `client/src/components/layout/Footer.js`
- ✅ `client/src/App.js` (404 message)

### 2. Pages
- ✅ `client/src/pages/common/AboutPage.js`
- ✅ `client/src/pages/company/ContactPage.js`

### 3. Components
- ✅ `client/src/components/chat/ChatBox.js`
- ✅ `client/src/components/common/Testimonials.js`

### 4. Utils
- ✅ `client/src/utils/helpers.js` (date format changed from `vi-VN` to `en-US`)

---

## 🔄 REMAINING FILES TO TRANSLATE

### Priority 1: Authentication Pages
**File: `client/src/pages/user/auth/login/LoginPage.js`**
```javascript
// Line 28: "Đăng nhập thành công!" → "Login successful!"
// Line 31: "Đăng nhập thất bại. Vui lòng kiểm tra email và mật khẩu." → "Login failed. Please check your email and password."
// Line 60: "Nền tảng mua bán laptop chất lượng cao" → "High-quality laptop marketplace platform"
// Line 83: "Đăng Nhập" → "Login"
// Line 84: "Chào mừng trở lại! Vui lòng đăng nhập vào tài khoản của bạn." → "Welcome back! Please login to your account."
// Line 121: "Mật khẩu" → "Password"
// Line 143: "Quên mật khẩu?" → "Forgot password?"
// Line 152: "Đăng nhập" → "Login"
// Line 153: "Đang đăng nhập..." → "Logging in..."
// Line 160: "Chưa có tài khoản?" → "Don't have an account?"
// Line 161: "Đăng ký ngay" → "Register now"
```

**File: `client/src/pages/user/auth/register/RegisterPage.js`**
- "Đăng ký" → "Register"
- "Tạo tài khoản mới" → "Create new account"
- "Họ và tên" → "Full Name"
- "Xác nhận mật khẩu" → "Confirm Password"
- "Đã có tài khoản?" → "Already have an account?"
- "Đăng nhập ngay" → "Login now"

**File: `client/src/pages/user/auth/forgot-password/ForgotPasswordPage.js`**
- "Quên mật khẩu" → "Forgot Password"
- "Gửi liên kết đặt lại" → "Send reset link"

**File: `client/src/pages/user/auth/reset-password/ResetPasswordPage.js`**
- "Đặt lại mật khẩu" → "Reset Password"
- "Mật khẩu mới" → "New Password"
- "Quay lại đăng nhập" → "Back to login"

---

### Priority 2: Shopping Pages

**File: `client/src/pages/user/cart/cart-list/CartPage.js`**
```javascript
// Cart related text:
- "Giỏ hàng" → "Shopping Cart"
- "Giỏ hàng trống" → "Cart is empty"
- "Tiếp tục mua sắm" → "Continue shopping"
- "Số lượng" → "Quantity"
- "Tổng tiền" → "Total"
- "Thanh toán" → "Checkout"
- "Xóa" → "Remove"
- "Cập nhật" → "Update"
- "Mã giảm giá" → "Discount code"
- "Áp dụng" → "Apply"
```

**File: `client/src/pages/user/cart/checkout/CheckoutPage.js`**
```javascript
// Line 77: "Vui lòng nhập họ tên" → "Please enter full name"
// Line 81: "Vui lòng nhập số điện thoại" → "Please enter phone number"
// Line 209: "Số điện thoại" → "Phone Number"
- "Thông tin giao hàng" → "Shipping Information"
- "Họ tên" → "Full Name"
- "Địa chỉ" → "Address"
- "Phương thức thanh toán" → "Payment Method"
- "Đặt hàng" → "Place Order"
```

**File: `client/src/pages/user/wishlist/WishlistPage.js`**
```javascript
// Line 15: "${product.name} đã được thêm vào giỏ hàng!" → "${product.name} has been added to cart!"
// Line 21: "${product.name} đã được chuyển vào giỏ hàng!" → "${product.name} has been moved to cart!"
- "Danh sách yêu thích" → "Wishlist"
- "Thêm vào giỏ" → "Add to Cart"
```

**File: `client/src/pages/user/orders/orders-list/OrdersPage.js`**
- "Đơn hàng của tôi" → "My Orders"
- "Trạng thái" → "Status"
- "Ngày đặt" → "Order Date"
- "Tổng tiền" → "Total"
- "Chi tiết" → "Details"
- "Hủy đơn" → "Cancel Order"

---

### Priority 3: Product Pages

**File: `client/src/pages/product/ProductDetailPageUltra.js`**
```javascript
// Line 88: "✅ Đã thêm ${quantity}x ${product.name} vào giỏ hàng!" → "✅ Added ${quantity}x ${product.name} to cart!"
// Line 473: "Thêm vào giỏ hàng" → "Add to Cart"
// Line 482: "Mua ngay" → "Buy Now"
// Line 504: "Giảm thêm 5% khi thanh toán qua VNPay" → "Extra 5% off when paying via VNPay"
// Line 611: "Sản phẩm chính hãng, bảo hành toàn quốc. Liên hệ hotline..." → "Genuine products, nationwide warranty. Contact hotline..."
- "Mô tả sản phẩm" → "Product Description"
- "Thông số kỹ thuật" → "Specifications"
- "Đánh giá" → "Reviews"
- "Còn hàng" → "In Stock"
- "Hết hàng" → "Out of Stock"
- "So sánh" → "Compare"
```

**File: `client/src/pages/home/HomePage.js`**
```javascript
- "Tìm kiếm" → "Search"
- "Bộ lọc" → "Filters"
- "Thương hiệu" → "Brand"
- "Giá" → "Price"
- "RAM" → "RAM"
- "Bộ xử lý" → "Processor"
- "Sắp xếp theo" → "Sort by"
- "Giá tăng dần" → "Price: Low to High"
- "Giá giảm dần" → "Price: High to Low"
- "Mới nhất" → "Newest"
- "Bán chạy nhất" → "Best Selling"
```

---

### Priority 4: User Profile

**File: `client/src/components/profile/NotificationCenter.js`**
```javascript
// Line 137-145: Time format
- "Vừa xong" → "Just now"
- "${diffMins} phút trước" → "${diffMins} minutes ago"
- "${diffHours} giờ trước" → "${diffHours} hours ago"
- "${diffDays} ngày trước" → "${diffDays} days ago"
// Line 147: "Đang tải thông báo..." → "Loading notifications..."
// Line 154: "Thông báo" → "Notifications"
```

**File: `client/src/components/profile/PersonalInfoEnhanced.js`**
```javascript
// Line 764: "Đơn vị tiền tệ" → "Currency"
// Line 774: "Lưu tùy chọn" → "Save Preferences"
- "Thông tin cá nhân" → "Personal Information"
- "Họ tên" → "Full Name"
- "Email" → "Email"
- "Số điện thoại" → "Phone"
- "Địa chỉ" → "Address"
- "Cập nhật" → "Update"
```

**File: `client/src/pages/user/profile/ProfilePage.js`**
```javascript
// Line 31: "Thanh toán" → "Payment"
- "Hồ sơ" → "Profile"
- "Đơn hàng" → "Orders"
- "Yêu thích" → "Wishlist"
- "Thông báo" → "Notifications"
- "Cài đặt" → "Settings"
```

---

### Priority 5: Policy Pages

**File: `client/src/pages/user/policies/warranty/WarrantyPolicyPage.js`**
```javascript
// Line 49: "Liên hệ hỗ trợ" → "Contact Support"
// Line 104-105: "Liên hệ sớm" → "Contact Early"
- "Chính sách bảo hành" → "Warranty Policy"
- "Điều kiện bảo hành" → "Warranty Conditions"
- "Thời gian bảo hành" → "Warranty Period"
- "Quy trình bảo hành" → "Warranty Process"
```

**File: `client/src/pages/user/policies/return/ReturnPolicyPage.js`**
```javascript
// Line 65: "Liên hệ" → "Contact"
// Line 90: "Thanh toán online" → "Online Payment"
// Line 94: "Thanh toán COD" → "COD Payment"
- "Chính sách đổi trả" → "Return Policy"
- "Điều kiện đổi trả" → "Return Conditions"
- "Quy trình đổi trả" → "Return Process"
```

**File: `client/src/pages/user/policies/shipping/ShippingPolicyPage.js`**
```javascript
// Line 79: "Hài lòng mới ký nhận và thanh toán" → "Sign and pay only when satisfied"
// Line 114: "Liên hệ để biết chính xác thời gian giao hàng" → "Contact to know exact delivery time"
- "Chính sách vận chuyển" → "Shipping Policy"
- "Thời gian giao hàng" → "Delivery Time"
- "Phí vận chuyển" → "Shipping Fee"
```

**File: `client/src/pages/guide/InstallmentGuidePage.js`**
```javascript
// Line 240: "Liên hệ hotline 084.686.5650 nếu cần hỗ trợ" → "Contact hotline 084.686.5650 if need support"
// Line 250: "Liên hệ ngay với chúng tôi để được tư vấn..." → "Contact us now for detailed consultation..."
- "Hướng dẫn trả góp" → "Installment Guide"
- "Điều kiện" → "Conditions"
- "Quy trình" → "Process"
```

**File: `client/src/pages/guide/PaymentGuidePage.js`**
```javascript
// Line 205: "Có, liên hệ hotline ngay sau khi đặt hàng..." → "Yes, contact hotline right after ordering..."
// Line 217: "Liên hệ ngay để được tư vấn" → "Contact now for consultation"
- "Hướng dẫn thanh toán" → "Payment Guide"
- "Phương thức thanh toán" → "Payment Methods"
```

---

### Priority 6: Other Pages

**File: `client/src/pages/common/CareersPage.js`**
```javascript
// Line 123: "Cảm ơn bạn đã ứng tuyển! Chúng tôi sẽ liên hệ sớm nhất." → "Thank you for applying! We will contact you soon."
// Line 267: "Số điện thoại" → "Phone Number"
- "Tuyển dụng" → "Careers"
- "Vị trí tuyển dụng" → "Job Openings"
- "Ứng tuyển" → "Apply"
- "Kinh nghiệm" → "Experience"
- "CV đính kèm" → "Attach CV"
- "Gửi đơn ứng tuyển" → "Submit Application"
```

**File: `client/src/pages/company/CompanyAboutPage.js`**
- This file needs extensive translation similar to AboutPage.js
- "VỀ LAPTOP STORE VIETNAM" → "ABOUT LAPTOP STORE VIETNAM"
- "Đối tác tin cậy cho mọi nhu cầu công nghệ của bạn" → "Trusted partner for all your technology needs"
- All Vietnamese content to English

**File: `client/src/pages/common/FAQPage.js`**
```javascript
// Line 32: "📞 Tôi có thể liên hệ hỗ trợ qua đâu?" → "📞 How can I contact support?"
// Line 33: "Liên hệ hỗ trợ 24/7 qua Hotline..." → "Contact 24/7 support via Hotline..."
// Line 40-41: Payment FAQ translation
// Line 49: Order tracking FAQ
// Line 65: VAT invoice FAQ
```

**File: `client/src/pages/common/GuidePage.js`**
```javascript
// Line 28: "Click 'Thêm vào giỏ hàng' hoặc 'Mua ngay'" → "Click 'Add to Cart' or 'Buy Now'"
// Line 38: "Bước 2: Đặt Hàng & Thanh Toán" → "Step 2: Order & Payment"
// Line 40: "Kiểm tra giỏ hàng..." → "Check cart..."
// Line 42-46: Payment methods
// Line 63: "Đăng nhập tài khoản để theo dõi..." → "Login to track..."
// Line 80: Payment on delivery
// Line 119: Change order FAQ
// Line 128: VAT invoice FAQ
```

**File: `client/src/pages/chat/HuongDanMuaHang.js`**
```javascript
// Line 55: "Nhập họ tên, số điện thoại" → "Enter full name, phone number"
// Line 71: "Chờ nhân viên liên hệ xác nhận" → "Wait for staff confirmation"
// Line 78: "Liên hệ hotline: 084.686.5650" → "Contact hotline: 084.686.5650"
```

---

## 📝 COMMON TRANSLATIONS

### Time & Date
- `'vi-VN'` → `'en-US'` (in all `toLocaleTimeString()` and `toLocaleDateString()`)
- "Vừa xong" → "Just now"
- "phút trước" → "minutes ago"
- "giờ trước" → "hours ago"
- "ngày trước" → "days ago"
- "tuần trước" → "weeks ago"
- "tháng trước" → "months ago"

### Actions
- "Thêm vào giỏ hàng" → "Add to Cart"
- "Mua ngay" → "Buy Now"
- "Thanh toán" → "Checkout"
- "Đặt hàng" → "Place Order"
- "Xem chi tiết" → "View Details"
- "Cập nhật" → "Update"
- "Xóa" → "Delete/Remove"
- "Lưu" → "Save"
- "Hủy" → "Cancel"
- "Gửi" → "Send/Submit"
- "Tìm kiếm" → "Search"
- "Lọc" → "Filter"
- "Sắp xếp" → "Sort"

### Common Labels
- "Họ tên" / "Họ và tên" → "Full Name"
- "Email" → "Email"
- "Số điện thoại" → "Phone Number"
- "Địa chỉ" → "Address"
- "Mật khẩu" → "Password"
- "Xác nhận mật khẩu" → "Confirm Password"
- "Ghi chú" → "Note"
- "Tin nhắn" / "Nội dung" → "Message"
- "Chủ đề" → "Subject"
- "Tiêu đề" → "Title"

### Status
- "Đang xử lý" → "Processing"
- "Đã xác nhận" → "Confirmed"
- "Đang giao hàng" → "Shipping"
- "Đã giao hàng" → "Delivered"
- "Đã hủy" → "Cancelled"
- "Thành công" → "Success"
- "Thất bại" → "Failed"
- "Đang chờ" → "Pending"

### Product Related
- "Sản phẩm" → "Product"
- "Giá" → "Price"
- "Số lượng" → "Quantity"
- "Còn hàng" → "In Stock"
- "Hết hàng" → "Out of Stock"
- "Mô tả" → "Description"
- "Thông số kỹ thuật" → "Specifications"
- "Đánh giá" → "Reviews"
- "Bảo hành" → "Warranty"
- "Khuyến mãi" → "Promotion"

### Messages
- "Cảm ơn" → "Thank you"
- "Vui lòng" → "Please"
- "Liên hệ" → "Contact"
- "Hỗ trợ" → "Support"
- "Thông báo" → "Notification"
- "Lỗi" → "Error"
- "Thành công" → "Success"

---

## 🔧 QUICK FIND & REPLACE

Use these regex patterns for bulk replacement in VS Code:

```regex
# Time format
toLocaleTimeString\('vi-VN' → toLocaleTimeString('en-US'
toLocaleDateString\('vi-VN' → toLocaleDateString('en-US'

# Common words
\bĐăng nhập\b → Login
\bĐăng ký\b → Register
\bĐăng xuất\b → Logout
\bGiỏ hàng\b → Cart
\bThanh toán\b → Checkout / Payment
\bMua ngay\b → Buy Now
\bThêm vào giỏ hàng\b → Add to Cart
\bSố điện thoại\b → Phone Number
\bHọ (và )?tên\b → Full Name
\bMật khẩu\b → Password
\bĐịa chỉ\b → Address
\bLiên hệ\b → Contact
\bHỗ trợ\b → Support
\bSản phẩm\b → Product
\bĐơn hàng\b → Order
```

---

## 💡 RECOMMENDATION

For future maintainability, consider implementing **i18n (internationalization)**:

1. Install `react-i18next`:
   ```bash
   npm install react-i18next i18next
   ```

2. Create translation files:
   ```
   /locales
     /en
       translation.json
     /vi
       translation.json
   ```

3. Use translation keys instead of hardcoded strings:
   ```javascript
   // Instead of: "Đăng nhập"
   // Use: t('auth.login')
   ```

This will make switching between languages much easier!

---

## ✅ COMPLETION CHECKLIST

- [x] Header & Footer
- [x] ChatBox
- [x] Testimonials
- [x] AboutPage
- [x] ContactPage
- [x] Utils (helpers.js)
- [ ] LoginPage
- [ ] RegisterPage
- [ ] ForgotPasswordPage
- [ ] ResetPasswordPage
- [ ] CartPage
- [ ] CheckoutPage
- [ ] WishlistPage
- [ ] OrdersPage
- [ ] ProductDetailPage
- [ ] HomePage
- [ ] NotificationCenter
- [ ] PersonalInfo
- [ ] ProfilePage
- [ ] WarrantyPolicyPage
- [ ] ReturnPolicyPage
- [ ] ShippingPolicyPage
- [ ] InstallmentGuidePage
- [ ] PaymentGuidePage
- [ ] CareersPage
- [ ] CompanyAboutPage
- [ ] FAQPage
- [ ] GuidePage
- [ ] HuongDanMuaHang

---

**Total Progress: ~30% Complete**

The most visible/important pages (Header, Footer, Chat, Contact, About, Testimonials) are done. 
Remaining work focuses on authentication, shopping flow, and policy pages.
