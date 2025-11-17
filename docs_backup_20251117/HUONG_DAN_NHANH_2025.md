# 🚀 HƯỚNG DẪN NHANH - CÁC TÍNH NĂNG MỚI

## 📋 MỤC LỤC

1. [Quên Mật Khẩu](#1-quên-mật-khẩu-)
2. [Thanh Toán](#2-thanh-toán-)
3. [Hồ Sơ Người Dùng](#3-hồ-sơ-người-dùng-)
4. [Chat với Partner](#4-chat-với-partner-)
5. [Đơn Hàng](#5-đơn-hàng-)

---

## 1. QUÊN MẬT KHẨU 🔐

### Bước 1: Vào trang đăng nhập
```
URL: http://localhost:3000/login
```

### Bước 2: Click "Quên mật khẩu?"
- Link màu xanh bên dưới form đăng nhập

### Bước 3: Nhập email
```
Email: client@laptop.com (hoặc email bạn đã đăng ký)
```

### Bước 4: Nhận mã xác nhận
- **Development:** Mã hiển thị trong console log của server
- **Production:** Sẽ gửi qua email

### Bước 5: Đặt lại mật khẩu
```
- Email: client@laptop.com
- Mã xác nhận: 123456 (ví dụ)
- Mật khẩu mới: xxx1234
- Xác nhận mật khẩu: xxx1234
```

### Bước 6: Đăng nhập với mật khẩu mới
```
Email: client@laptop.com
Password: xxx1234
```

---

## 2. THANH TOÁN 💳

### Luồng thanh toán đầy đủ:

**A. Thêm sản phẩm vào giỏ**
```
1. Trang chủ → Chọn sản phẩm
2. Click "Thêm vào giỏ hàng"
3. Popup xác nhận → Click "Xem giỏ hàng"
```

**B. Xem giỏ hàng**
```
URL: http://localhost:3000/cart

- Chọn sản phẩm muốn mua (checkbox)
- Xem tổng tiền
- Click "Thanh Toán"
```

**C. Trang Checkout**
```
URL: http://localhost:3000/checkout

📝 Thông tin giao hàng:
   - Họ và tên: Nguyễn Văn A
   - Email: client@laptop.com
   - Số điện thoại: 0912345678
   - Địa chỉ: 123 Nguyễn Trãi
   - Phường/Xã: Phường 1
   - Quận/Huyện: Quận 1
   - Tỉnh/TP: TP. Hồ Chí Minh
   - Ghi chú: Giao giờ hành chính

💰 Phương thức thanh toán:
   ☑️ COD (Thanh toán khi nhận hàng)
   ⬜ Chuyển khoản ngân hàng
   ⬜ Ví MoMo
   ⬜ ZaloPay

📦 Tóm tắt đơn hàng:
   - Danh sách sản phẩm
   - Phí vận chuyển (Free nếu >= 10M)
   - Tổng cộng
```

**D. Xác nhận đặt hàng**
```
Click "Đặt hàng" → Chuyển đến trang Đơn hàng
```

### 🎯 Tips:
- ✅ Miễn phí ship cho đơn từ 10.000.000 VNĐ
- ✅ Có thể ghi chú cho shop
- ✅ Hỗ trợ nhiều phương thức thanh toán

---

## 3. HỒ SƠ NGƯỜI DÙNG 👤

### Vào trang Profile:
```
URL: http://localhost:3000/profile

Hoặc: Click avatar trên header → "Hồ sơ"
```

### A. Thay đổi ảnh đại diện:

**Bước 1:** Tab "Thông tin cá nhân"

**Bước 2:** Click "📷 Thay đổi ảnh đại diện"

**Bước 3:** Chọn ảnh
```
- Kích thước: Tối đa 5MB
- Định dạng: JPG, PNG, GIF, WEBP
- Tỷ lệ: Vuông là đẹp nhất
```

**Bước 4:** Xem preview

**Bước 5:** Click "💾 Lưu thay đổi"

### B. Cập nhật thông tin:

```
📝 Thông tin cơ bản:
   - Họ và tên
   - Tên đăng nhập
   - Email
   - Số điện thoại
   - Giới tính
   - Ngày sinh
   - Địa chỉ

🔒 Đổi mật khẩu:
   1. Click "🔒 Đổi mật khẩu"
   2. Nhập mật khẩu hiện tại
   3. Nhập mật khẩu mới
   4. Xác nhận mật khẩu mới
   5. Click "💾 Lưu thay đổi"
```

### C. Các tab khác:

```
📍 Địa chỉ: Quản lý địa chỉ giao hàng
💳 Thanh toán: Quản lý phương thức thanh toán
📦 Đơn hàng: Lịch sử đơn hàng
🛡️ Bảo hành: Sản phẩm đang bảo hành
❤️ Yêu thích: Sản phẩm đã lưu
⭐ Đánh giá: Đánh giá của bạn
🎫 Voucher: Mã giảm giá
💬 Hỗ trợ: Tickets
🔔 Thông báo: Thông báo hệ thống
⚙️ Cài đặt: Tùy chọn
```

---

## 4. CHAT VỚI PARTNER 💬

### Floating Chat Button:

**Vị trí:** Góc dưới bên phải màn hình

**Hiển thị:** Trên tất cả các trang

### Cách sử dụng:

**Bước 1:** Click vào button "💬"

**Bước 2:** Chọn partner muốn chat
```
- Tech Solutions Store 🟢 Online
- Gaming Hub 🟢 Online
- Laptop Pro Shop ⚪ Offline
```

**Bước 3:** Bắt đầu trò chuyện

### 🎯 Lưu ý:
- ⚠️ Cần đăng nhập để chat
- ✅ Partner online sẽ trả lời nhanh hơn
- ✅ Lịch sử chat được lưu

### Với Partner/Admin:
```
Click button → Chuyển đến Dashboard (có chat tích hợp)
```

---

## 5. ĐƠN HÀNG 📦

### Xem đơn hàng:
```
URL: http://localhost:3000/orders

Hoặc: Profile → Tab "Đơn hàng"
```

### Các trạng thái:

```
⏳ Chờ xác nhận (pending)
   - Vừa đặt hàng
   - Có thể HỦY

📦 Đang xử lý (processing)
   - Shop đang chuẩn bị
   - KHÔNG THỂ hủy

🚚 Đang giao (shipped)
   - Đang trên đường giao
   - KHÔNG THỂ hủy

✅ Đã giao (delivered)
   - Đã nhận hàng
   - Có thể MUA LẠI

❌ Đã hủy (cancelled)
   - Đã hủy thành công
```

### Filter đơn hàng:

**Tabs:**
```
- Tất cả (8)
- Chờ xác nhận (2)
- Đang xử lý (3)
- Đang giao (1)
- Đã giao (1)
- Đã hủy (1)
```

### Chi tiết đơn hàng:

**Click "📋 Chi tiết":**
```
📌 Mã đơn hàng: #ABC123XYZ
📅 Ngày đặt: 14/11/2025, 10:30
📊 Trạng thái: Đang giao
📦 Sản phẩm: [Danh sách]
📍 Địa chỉ: [Chi tiết]
💰 Tổng tiền: 15.000.000 VNĐ
```

### Hủy đơn hàng:

**Điều kiện:** Chỉ với đơn "Chờ xác nhận"

**Cách hủy:**
```
1. Tìm đơn hàng cần hủy
2. Click "❌ Hủy đơn"
3. Xác nhận hủy
4. Đơn chuyển sang trạng thái "Đã hủy"
```

---

## 🔧 TROUBLESHOOTING

### Vấn đề thường gặp:

**1. Không nhận được mã reset password**
```
✅ Kiểm tra console log của server
✅ Mã có thời hạn 15 phút
✅ Email phải đúng với tài khoản đã đăng ký
```

**2. Upload avatar lỗi**
```
✅ File phải nhỏ hơn 5MB
✅ Chỉ chấp nhận: JPG, PNG, GIF, WEBP
✅ Đảm bảo đã đăng nhập
```

**3. Checkout không hoạt động**
```
✅ Phải có sản phẩm trong giỏ
✅ Phải đăng nhập
✅ Điền đầy đủ thông tin bắt buộc (*)
```

**4. Chat button không hiển thị**
```
✅ Hard refresh: Ctrl + F5
✅ Clear cache
✅ Kiểm tra console log
```

**5. Đơn hàng không hiển thị**
```
✅ Đăng nhập đúng user đã đặt hàng
✅ Kiểm tra trong tab "Tất cả"
✅ Làm mới trang
```

---

## 🎮 TEST ACCOUNTS

```javascript
// Client (Khách hàng)
Email: client@laptop.com
Password: xxx123

// Partner (Người bán)
Email: partner1@laptop.com
Password: xxx123

// Admin (Quản trị viên)
Email: admin@laptop.com
Password: xxx123
```

---

## 📱 RESPONSIVE TESTING

### Desktop:
```
✅ Tất cả tính năng hoạt động bình thường
✅ Layout 2-3 cột
✅ Hover effects
```

### Tablet (768px - 1024px):
```
✅ Layout 1-2 cột
✅ Menu collapse
✅ Touch-friendly buttons
```

### Mobile (< 768px):
```
✅ Layout 1 cột
✅ Stack vertical
✅ Larger touch targets
✅ Floating chat smaller
```

---

## 🚀 NEXT STEPS

### Sau khi test xong:

1. **Tích hợp Email Service:**
   ```
   - SendGrid
   - Mailgun
   - AWS SES
   ```

2. **Tích hợp Payment Gateways:**
   ```
   - MoMo API
   - ZaloPay API
   - VNPay API
   ```

3. **Upload ảnh lên Cloud:**
   ```
   - AWS S3
   - Cloudinary
   - Google Cloud Storage
   ```

4. **Real-time Chat:**
   ```
   - Socket.io
   - WebSocket
   ```

---

## 📞 LIÊN HỆ HỖ TRỢ

**Hotline:** 084.686.5650  
**Email:** trinhviethoangawm@gmail.com  
**Giờ hỗ trợ:** 8:00 - 21:00 (Tất cả các ngày)

---

**Chúc bạn testing vui vẻ! 🎉**

*Last updated: November 14, 2025*
