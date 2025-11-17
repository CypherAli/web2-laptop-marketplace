# 👨‍💼 HƯỚNG DẪN ADMIN XÁC NHẬN ĐƠN HÀNG

## ✅ ĐÃ SỬA LỖI

### Lỗi trước đây:
```
❌ PUT http://localhost:5000/api/orders/691820a32e63400a57e1cbd5 404 (Not Found)
```

### Đã sửa:
```javascript
// AdminDashboard.js - Line 178
// CŨ: await axios.put(`/orders/${orderId}`, { status: newStatus });
// MỚI: await axios.put(`/orders/${orderId}/status`, { status: newStatus });
```

---

## 🔐 PHÂN QUYỀN

### Ai có quyền xác nhận đơn hàng?

**Chỉ 2 vai trò:**
1. 👑 **ADMIN** - Quản trị viên
2. 👨‍💼 **MANAGER** - Quản lý

**User thường:** ❌ Không có quyền xác nhận, chỉ có thể hủy đơn (nếu pending)

---

## 📋 CÁCH XÁC NHẬN ĐƠN HÀNG

### Bước 1: Đăng nhập Admin
```
URL: http://localhost:3000/admin
Username: admin
Password: (your admin password)
```

### Bước 2: Vào trang Quản lý Đơn hàng
- Click tab "📦 Đơn hàng" trong Admin Dashboard
- Xem danh sách tất cả đơn hàng

### Bước 3: Chọn trạng thái mới
Trong cột "Trạng thái", chọn từ dropdown:

```
⏳ pending      → Chờ xác nhận (mặc định khi user đặt)
✅ confirmed    → Đã xác nhận
📦 processing   → Đang xử lý (đóng gói)
🚚 shipped      → Đang giao hàng
✅ delivered    → Đã giao thành công
❌ cancelled    → Đã hủy
💰 refunded     → Đã hoàn tiền
↩️  returned    → Đã trả hàng
```

### Bước 4: Lưu tự động
- Chọn status → Tự động lưu
- Toast notification: "✅ Đã cập nhật trạng thái đơn hàng!"
- User nhận notification real-time

---

## 🔄 QUY TRÌNH CHUẨN

### Flow xử lý đơn hàng:

```
1. User đặt hàng
   ↓
   Status: pending (Chờ xác nhận) ⏳
   
2. Admin xác nhận
   ↓
   Status: confirmed (Đã xác nhận) ✅
   → User nhận notification: "Đơn hàng đã được xác nhận"
   
3. Admin đóng gói
   ↓
   Status: processing (Đang xử lý) 📦
   → User nhận notification: "Đơn hàng đang được xử lý"
   
4. Giao cho shipper
   ↓
   Status: shipped (Đang giao) 🚚
   → User nhận notification: "Đơn hàng đang được giao"
   → Nhập mã vận đơn (tracking number)
   
5. Giao thành công
   ↓
   Status: delivered (Đã giao) ✅
   → User nhận notification: "Đơn hàng đã được giao thành công"
   → User có thể đánh giá sản phẩm
   → Warranty tự động bắt đầu
```

---

## 💡 TÍNH NĂNG MỚI (VỪA THÊM)

### 1. Notification tự động cho User
Khi Admin update status, user tự động nhận notification:
- ✅ Đơn hàng đã được xác nhận
- 📦 Đơn hàng đang được xử lý
- 🚚 Đơn hàng đang được giao
- ✅ Đơn hàng đã được giao
- ❌ Đơn hàng đã bị hủy

### 2. Status History
Hệ thống tự động lưu lịch sử thay đổi trạng thái:
```javascript
{
    status: "shipped",
    note: "Status updated from processing to shipped",
    updatedBy: "admin-user-id",
    timestamp: "2025-11-15T10:30:00Z"
}
```

### 3. Real-time Socket.IO
User nhận notification ngay lập tức qua Socket.IO (không cần refresh)

### 4. Validation mạnh mẽ
- Chỉ chấp nhận valid statuses
- Check order tồn tại
- Log đầy đủ activities

---

## 🛠️ ADMIN API (Nếu dùng trực tiếp)

### Update Order Status
```javascript
PUT /api/orders/:orderId/status
Headers: { 
    Authorization: "Bearer <admin-token>" 
}
Body: {
    "status": "processing",
    "note": "Đang đóng gói sản phẩm" // optional
}

Response: {
    "success": true,
    "message": "Đã cập nhật trạng thái đơn hàng",
    "order": {
        "_id": "...",
        "orderNumber": "LP231100001",
        "status": "processing",
        "previousStatus": "confirmed",
        "updatedAt": "..."
    }
}
```

### Get All Orders (Admin)
```javascript
GET /api/orders?page=1&limit=10&status=pending
Headers: { 
    Authorization: "Bearer <admin-token>" 
}

Response: {
    "orders": [...],
    "currentPage": 1,
    "totalPages": 5,
    "totalOrders": 50
}
```

---

## 🎯 TRẠNG THÁI CHI TIẾT

### pending (⏳ Chờ xác nhận)
- Đơn hàng mới được tạo
- Chưa được admin xác nhận
- User có thể tự hủy

### confirmed (✅ Đã xác nhận)
- Admin đã xác nhận nhận đơn
- Chuẩn bị xử lý đơn hàng
- User không thể tự hủy (phải liên hệ support)

### processing (📦 Đang xử lý)
- Đang kiểm tra, đóng gói sản phẩm
- Chuẩn bị giao cho shipper

### shipped (🚚 Đang giao)
- Đã giao cho đơn vị vận chuyển
- Có mã tracking để theo dõi
- Shipper đang giao hàng

### delivered (✅ Đã giao)
- Giao hàng thành công
- User đã nhận hàng
- Có thể đánh giá sản phẩm
- Warranty bắt đầu

### cancelled (❌ Đã hủy)
- Đơn hàng bị hủy (do user hoặc admin)
- Stock sản phẩm được restore

### refunded (💰 Đã hoàn tiền)
- Đã hoàn tiền cho khách
- Sau khi hủy hoặc trả hàng

### returned (↩️ Đã trả hàng)
- Khách hàng trả lại sản phẩm
- Đang chờ hoàn tiền

---

## 📊 THỐNG KÊ ĐƠNN HÀNG

Admin Dashboard hiển thị:
- 📈 Tổng số đơn hàng
- ⏳ Đơn chờ xác nhận
- 📦 Đơn đang xử lý
- 🚚 Đơn đang giao
- ✅ Đơn đã giao
- ❌ Đơn đã hủy
- 💰 Tổng doanh thu
- 📊 Biểu đồ theo thời gian

---

## ⚠️ LƯU Ý QUAN TRỌNG

### 1. Không thể quay lại trạng thái trước
Ví dụ: Không thể chuyển từ `delivered` về `shipped`

### 2. Hủy đơn cần cẩn thận
- Hủy đơn sẽ restore stock
- User sẽ nhận notification
- Nên có lý do rõ ràng

### 3. Nhập mã vận đơn
Khi chuyển sang `shipped`, nên nhập:
- Tracking number
- Carrier (đơn vị vận chuyển)
- Estimated delivery date

### 4. Xác nhận giao hàng
Trước khi chuyển sang `delivered`, đảm bảo:
- User đã nhận hàng
- Không có vấn đề gì
- Có thể xác nhận qua điện thoại

---

## 🐛 TROUBLESHOOTING

### Lỗi: 404 Not Found
**Nguyên nhân:** URL thiếu `/status`  
**Giải pháp:** Đã fix trong code mới (refresh lại browser)

### Lỗi: 403 Forbidden
**Nguyên nhân:** User không có quyền admin/manager  
**Giải pháp:** Đăng nhập bằng tài khoản admin

### Lỗi: 400 Invalid Status
**Nguyên nhân:** Status không hợp lệ  
**Giải pháp:** Chỉ dùng các status được liệt kê ở trên

### Notification không hiển thị
**Nguyên nhân:** Socket.IO chưa connect  
**Giải pháp:** Check console log "✅ Connected to chat server"

---

## 🚀 TEST NHANH

### 1. Tạo đơn hàng test (User)
```
1. Login user → Add to cart → Checkout → Submit
2. Đơn hàng được tạo với status: pending
```

### 2. Xác nhận đơn hàng (Admin)
```
1. Login admin → Admin Dashboard → Tab Đơn hàng
2. Tìm đơn hàng vừa tạo
3. Dropdown status → Chọn "confirmed"
4. Check: Toast "✅ Đã cập nhật trạng thái"
```

### 3. Kiểm tra notification (User)
```
1. User logout và login lại (hoặc refresh)
2. Profile → Tab Thông báo
3. Thấy: "✅ Đơn hàng đã được xác nhận"
```

### 4. Chuyển tiếp status
```
confirmed → processing → shipped → delivered
```

### 5. Kiểm tra warranty
```
Sau khi delivered → Profile → Tab Bảo hành
→ Sản phẩm xuất hiện với bảo hành 12 tháng
```

---

## 🎓 BEST PRACTICES

### 1. Xử lý đơn hàng nhanh
- Xác nhận đơn trong 24h
- Giao hàng trong 3-5 ngày

### 2. Communicate với khách
- Gọi điện xác nhận đơn lớn
- SMS khi giao hàng
- Email tracking info

### 3. Quản lý stock
- Kiểm tra stock trước khi confirm
- Update stock khi nhập hàng mới
- Alert khi stock thấp

### 4. Handle complaints
- Chuyên nghiệp, lịch sự
- Giải quyết nhanh chóng
- Refund khi cần thiết

---

## 📞 SUPPORT

Nếu gặp vấn đề:
1. Check console logs (browser + server)
2. Check network tab (F12)
3. Verify admin role trong database
4. Liên hệ developer

**System ready to use! 🎉**
