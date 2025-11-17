# 🔧 DEBUG GUIDE - Không hiển thị products

## ✅ ĐÃ HOÀN THÀNH

1. ✅ Thêm 22 products vào database
2. ✅ Sửa filter `isActive` trong productController
3. ✅ Kill tất cả node processes cũ
4. ✅ Khởi động lại server (port 5000) ✅
5. ✅ Khởi động lại client (port 3000) ✅
6. ✅ Thêm console.log để debug

---

## 🔍 KIỂM TRA TIẾP THEO

### Bước 1: Mở Browser Console
1. Mở http://localhost:3000
2. Nhấn `F12` để mở DevTools
3. Chọn tab **Console**
4. Refresh trang (`Ctrl + Shift + R`)

### Bước 2: Xem logs
Bạn sẽ thấy:
```
🔍 Fetching products with params: {page: 1, limit: 12, maxPrice: '', inStock: false, sortBy: ''}
✅ API Response: {products: Array(22), currentPage: 1, totalPages: 2, totalProducts: 22}
📦 Got paginated response, products: 12
```

Nếu thấy **12 products** → SUCCESS! ✅

---

## ❌ NẾU VẪN THẤY LỖI

### Lỗi 1: Network Error / ERR_CONNECTION_REFUSED
**Nguyên nhân:** Server chưa chạy hoặc port sai

**Giải pháp:**
```powershell
# Kiểm tra server đang chạy
Get-Process -Name node

# Kiểm tra port 5000
netstat -ano | findstr :5000

# Restart server
cd e:\laptop-marketplace\server
node server.js
```

### Lỗi 2: 404 Not Found
**Nguyên nhân:** Route không đúng

**Kiểm tra:**
- API base URL: `http://localhost:5000/api`
- Endpoint: `/products`
- Full URL: `http://localhost:5000/api/products`

### Lỗi 3: Empty Array []
**Nguyên nhân:** Database trống hoặc filter quá strict

**Giải pháp:**
```powershell
# Kiểm tra database
cd e:\laptop-marketplace\server
node -e "require('dotenv').config(); const mongoose = require('mongoose'); const Product = require('./models/Product'); mongoose.connect(process.env.MONGO_URI).then(async () => { const count = await Product.countDocuments(); console.log('Total:', count); const all = await Product.find(); console.log('Products:', all.map(p => p.name)); process.exit(0); })"

# Nếu count = 0, seed lại
node seedProductsWithImages.js
```

### Lỗi 4: CORS Error
**Nguyên nhân:** CORS chưa cấu hình đúng

**Kiểm tra server.js:**
```javascript
app.use(cors()); // Phải có dòng này
```

---

## 🧪 TEST TRỰC TIẾP API

### Test với PowerShell:
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/products" | ConvertTo-Json -Depth 3
```

### Hoặc test với browser:
Mở URL: http://localhost:5000/api/products

Bạn sẽ thấy JSON response:
```json
{
  "products": [
    {
      "_id": "...",
      "name": "Dell XPS 13 9310",
      "price": 32990000,
      "stock": 15,
      ...
    },
    ...
  ],
  "currentPage": 1,
  "totalPages": 2,
  "totalProducts": 22
}
```

---

## 📝 CHECKLIST DEBUG

- [ ] Server đang chạy? (`Server running on port 5000`)
- [ ] Client đang chạy? (`webpack compiled successfully`)
- [ ] Database có data? (`Total products: 22`)
- [ ] API trả về data? (Test http://localhost:5000/api/products)
- [ ] Console có logs? (`🔍 Fetching products...`)
- [ ] Network tab có request? (F12 → Network → XHR)

---

## 🎯 THÔNG TIN HỆ THỐNG

### Backend:
- **Port:** 5000
- **Base URL:** http://localhost:5000/api
- **Products Endpoint:** GET /api/products
- **Database:** MongoDB (localhost:27017/laptop-db)

### Frontend:
- **Port:** 3000
- **URL:** http://localhost:3000
- **API Config:** client/src/api/axiosConfig.js

### Test Accounts:
- Client: `client@laptop.com` / `client123`
- Partner1: `partner1@laptop.com` / `partner123`
- Partner2: `partner2@laptop.com` / `partner123`
- Admin: `admin@laptop.com` / `admin123`

---

## 🚀 QUICK FIX COMMANDS

```powershell
# Khởi động lại toàn bộ
cd e:\laptop-marketplace
.\STARTUP.ps1

# Hoặc manual:
# Terminal 1: Server
cd e:\laptop-marketplace\server
node server.js

# Terminal 2: Client
cd e:\laptop-marketplace\client
npm start

# Seed lại data nếu cần
cd e:\laptop-marketplace\server
node seedProductsWithImages.js
```

---

## 💡 TIP: Xem Real-time Logs

### Server logs (Terminal 1):
- `Server running on port 5000`
- `MongoDB Connected...`
- Mỗi API request sẽ log ra console

### Client logs (Browser Console):
- `🔍 Fetching products with params...`
- `✅ API Response...`
- `📦 Got paginated response, products: 12`

---

## ✅ KHI NÀO THÀNH CÔNG?

Bạn sẽ thấy:
1. ✅ Console log: `products: 12`
2. ✅ Màn hình hiển thị 12 product cards
3. ✅ "Laptops" header show "12 products"
4. ✅ Pagination show "Page 1 of 2"
5. ✅ Hình ảnh laptop load đầy đủ

---

**BÂY GIỜ HÃY:**
1. Mở http://localhost:3000
2. Nhấn F12 → Console tab
3. Refresh trang (Ctrl+Shift+R)
4. Chụp màn hình console logs và gửi cho tôi nếu vẫn có lỗi!
