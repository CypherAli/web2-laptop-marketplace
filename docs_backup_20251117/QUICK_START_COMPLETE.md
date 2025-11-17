# 🚀 KHỞI ĐỘNG NHANH - LAPTOP MARKETPLACE

## ⚡ QUICK START (Dành cho người mới)

### Bước 1: Cài đặt MongoDB

1. **Download MongoDB:**
   - Truy cập: https://www.mongodb.com/try/download/community
   - Download phiên bản mới nhất
   - Cài đặt và chạy MongoDB

2. **Kiểm tra MongoDB đang chạy:**
```bash
# Windows
net start MongoDB

# Mac/Linux
sudo systemctl status mongod
```

### Bước 2: Cài đặt Dependencies

```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

### Bước 3: Cấu hình Environment Variables

Tạo file `.env` trong folder `server`:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/laptop-marketplace

# JWT
JWT_SECRET=your-secret-key-change-this-in-production
JWT_EXPIRE=30d

# Server
PORT=5000
NODE_ENV=development

# Client URL
CLIENT_URL=http://localhost:3000

# Email (Development - Ethereal)
SMTP_HOST=smtp.ethereal.email
SMTP_PORT=587
SMTP_USER=your-ethereal-email
SMTP_PASS=your-ethereal-password
EMAIL_FROM=noreply@laptopmarketplace.com

# VNPay (Sandbox - For testing)
VNPAY_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
VNPAY_TMN_CODE=YOUR_TMN_CODE
VNPAY_HASH_SECRET=YOUR_HASH_SECRET
VNPAY_RETURN_URL=http://localhost:3000/payment/vnpay/return

# MoMo (Sandbox - For testing)
MOMO_PARTNER_CODE=YOUR_PARTNER_CODE
MOMO_ACCESS_KEY=YOUR_ACCESS_KEY
MOMO_SECRET_KEY=YOUR_SECRET_KEY
MOMO_RETURN_URL=http://localhost:3000/payment/momo/return
MOMO_NOTIFY_URL=http://localhost:5000/api/payment/momo/notify
```

### Bước 4: Seed Database (Tạo dữ liệu mẫu)

```bash
cd server

# Tạo admin user
node createAdminUser.js

# Tạo sản phẩm mẫu
node seedProductsReal.js

# Tạo users mẫu
node createUsers.js

# Tạo orders mẫu (optional)
node createOrders.js
```

### Bước 5: Khởi động Server

**Option 1: Khởi động thủ công**

Terminal 1 - Backend:
```bash
cd server
npm start
```

Terminal 2 - Frontend:
```bash
cd client
npm start
```

**Option 2: Sử dụng script tự động (Windows)**

```bash
# Ở thư mục gốc
START_ALL.bat
```

### Bước 6: Truy cập Hệ thống

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **API Test:** http://localhost:5000/ (sẽ thấy "API is running...")

---

## 👤 TÀI KHOẢN MẪU

### Admin Account
```
Email: admin@laptopmarketplace.com
Password: admin123
```

### Partner Account
```
Email: partner1@laptopmarketplace.com
Password: partner123
```

### Client Account
```
Email: client1@laptopmarketplace.com
Password: client123
```

---

## 🧪 KIỂM TRA HỆ THỐNG

### 1. Kiểm tra Backend

```bash
# Test API endpoint
curl http://localhost:5000/

# Kết quả: "API is running..."
```

### 2. Kiểm tra Database

```bash
# Mở MongoDB shell
mongosh

# Chuyển đến database
use laptop-marketplace

# Xem collections
show collections

# Xem số lượng products
db.products.countDocuments()

# Xem số lượng users
db.users.countDocuments()
```

### 3. Kiểm tra Socket.IO

1. Mở frontend: http://localhost:3000
2. Đăng nhập
3. Mở Developer Tools (F12)
4. Vào tab Console
5. Xem logs Socket.IO connection

---

## 📱 TEST CHỨC NĂNG CHÍNH

### ✅ Test 1: User Registration
1. Vào http://localhost:3000/register
2. Điền form đăng ký
3. Submit
4. Kiểm tra đăng nhập thành công

### ✅ Test 2: Browse Products
1. Vào http://localhost:3000/products
2. Xem danh sách sản phẩm
3. Thử search
4. Thử filter theo brand, price

### ✅ Test 3: Add to Cart
1. Click vào sản phẩm
2. Click "Add to Cart"
3. Xem giỏ hàng
4. Update quantity

### ✅ Test 4: Create Order
1. Ở giỏ hàng, click "Checkout"
2. Điền thông tin giao hàng
3. Chọn payment method
4. Submit order
5. Xem order confirmation

### ✅ Test 5: Live Chat
1. Đăng nhập với 2 tài khoản (user và partner)
2. User: Vào chat, chọn partner
3. Gửi tin nhắn
4. Partner: Xem tin nhắn và reply
5. Kiểm tra real-time

### ✅ Test 6: Price Alert
1. Đăng nhập
2. Vào product detail
3. Click "Set Price Alert"
4. Nhập target price
5. Submit
6. Admin update product price
7. Kiểm tra notification

### ✅ Test 7: Admin Dashboard
1. Đăng nhập với admin account
2. Vào /admin
3. Xem statistics
4. Xem charts
5. Manage users
6. Manage orders

---

## 🐛 TROUBLESHOOTING

### Lỗi: "Cannot connect to MongoDB"
```bash
# Kiểm tra MongoDB có chạy không
mongosh

# Nếu không chạy, start MongoDB
# Windows:
net start MongoDB

# Mac/Linux:
sudo systemctl start mongod
```

### Lỗi: "Port 5000 already in use"
```bash
# Tìm process đang dùng port 5000
# Windows:
netstat -ano | findstr :5000

# Kill process
taskkill /PID <PID> /F

# Hoặc đổi port trong .env
PORT=5001
```

### Lỗi: "Port 3000 already in use"
```bash
# Kill process trên port 3000
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:3000 | xargs kill -9
```

### Lỗi: JWT Secret
```
Error: JWT secret is not defined
```
**Solution:** Tạo file `.env` trong folder `server` và thêm `JWT_SECRET=your-secret-key`

### Lỗi: Cannot find module
```bash
# Xóa node_modules và cài lại
rm -rf node_modules
npm install
```

### Lỗi: Email not sending
- Kiểm tra SMTP settings trong `.env`
- Trong development, dùng Ethereal Email
- Tạo account tại: https://ethereal.email/

---

## 📚 TÀI LIỆU THAM KHẢO

1. **System Report:** `SYSTEM_COMPLETE_COMPREHENSIVE_REPORT.md`
2. **Testing Guide:** `COMPREHENSIVE_TESTING_GUIDE.md`
3. **API Reference:** `API_REFERENCE.md`
4. **Deployment:** `DEPLOYMENT_CHECKLIST.md`

---

## 🎯 NEXT STEPS

Sau khi hệ thống chạy thành công:

1. ✅ Đọc System Report để hiểu đầy đủ chức năng
2. ✅ Chạy Test Suite theo Testing Guide
3. ✅ Tùy chỉnh theo nhu cầu của bạn
4. ✅ Deploy lên production

---

## 💡 TIPS

### Development Tips
- Dùng Postman để test APIs
- Dùng MongoDB Compass để xem database
- Enable React Developer Tools
- Check Console logs thường xuyên

### Production Preparation
- Đổi JWT_SECRET thành secret key mạnh
- Cấu hình production MongoDB
- Set NODE_ENV=production
- Enable HTTPS
- Set up proper SMTP service
- Configure real payment gateways

---

## 📞 HỖ TRỢ

Nếu gặp vấn đề:
1. Check Console logs (F12 > Console)
2. Check Server logs (terminal)
3. Check MongoDB logs
4. Xem TROUBLESHOOTING section
5. Contact support

---

## ✨ FEATURES HIGHLIGHTS

### 🛍️ E-commerce Core
- ✅ Product catalog với search & filter
- ✅ Shopping cart
- ✅ Checkout & Order management
- ✅ Multiple payment methods

### 💰 Payment Integration
- ✅ COD (Cash on Delivery)
- ✅ VNPay
- ✅ MoMo
- ✅ Bank Transfer
- ✅ Refund system

### 🔔 Notifications
- ✅ Real-time notifications
- ✅ Email notifications
- ✅ Price drop alerts
- ✅ Order status updates

### 💬 Communication
- ✅ Live chat (Socket.IO)
- ✅ Support tickets
- ✅ Reviews & ratings

### 🎁 Marketing
- ✅ Voucher system
- ✅ Deals & promotions
- ✅ Loyalty points

### 📊 Analytics
- ✅ Admin dashboard
- ✅ Partner dashboard
- ✅ Revenue reports
- ✅ Sales analytics

---

**Chúc bạn thành công! 🎉**

**Version:** 1.0.0  
**Last Updated:** November 15, 2025
