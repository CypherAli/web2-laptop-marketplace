# 💻 Laptop Marketplace - Multi-Vendor E-commerce Platform

Hệ thống thương mại điện tử bán laptop đa nhà cung cấp với đầy đủ tính năng hiện đại.

## 🌟 Tính năng chính

### Khách hàng (Client)
- 🛍️ Xem và tìm kiếm sản phẩm với bộ lọc nâng cao
- 🛒 Giỏ hàng đa nhà cung cấp
- 💳 Đặt hàng và thanh toán (COD, Banking)
- 📦 Theo dõi đơn hàng real-time
- ⭐ Đánh giá và review sản phẩm
- 💬 Chat trực tiếp với Partner (hỗ trợ anonymous)
- 🔔 Thông báo real-time qua Socket.IO
- 👤 Quản lý thông tin cá nhân và địa chỉ

### Đối tác (Partner)
- 📊 Dashboard quản lý doanh thu
- 📦 Quản lý sản phẩm (CRUD)
- 🛍️ Quản lý đơn hàng của shop
- 💬 Hệ thống chat với khách hàng
- 📈 Thống kê doanh thu theo thời gian

### Quản trị viên (Admin)
- 👥 Quản lý người dùng và phê duyệt Partner
- 📦 Quản lý tất cả đơn hàng
- 📊 Thống kê tổng quan toàn hệ thống
- 🏪 Quản lý sản phẩm từ tất cả Partner
- 💬 Giám sát hệ thống chat

## 🛠️ Công nghệ sử dụng

### Backend
- **Node.js** + **Express.js** - REST API
- **MongoDB** + **Mongoose** - Database
- **Socket.IO** - Real-time communication
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Multer** - File upload
- **Nodemailer** - Email service
- **Node-cron** - Scheduled tasks

### Frontend
- **React** 19 - UI Framework
- **React Router DOM** - Routing
- **Axios** - HTTP Client
- **Socket.IO Client** - Real-time updates
- **React Icons** - Icons
- **Chart.js** + **React-Chartjs-2** - Charts
- **Framer Motion** - Animations

## 📁 Cấu trúc Project

```
laptop-marketplace/
├── server/               # Backend API
│   ├── config/          # Database config
│   ├── controllers/     # Business logic
│   ├── middleware/      # Auth, upload, etc.
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API routes
│   ├── services/        # Email, cron jobs
│   └── server.js        # Entry point
│
├── client/              # Frontend React
│   ├── public/          # Static files
│   └── src/
│       ├── api/         # API config
│       ├── components/  # Reusable components
│       ├── context/     # React Context
│       ├── pages/       # Page components
│       ├── styles/      # Global styles
│       └── utils/       # Helper functions
│
└── package.json         # Root package
```

## 🚀 Cài đặt và chạy

### Yêu cầu hệ thống
- Node.js >= 16.x
- MongoDB >= 5.x
- npm hoặc yarn

### Bước 1: Clone repository
```bash
git clone https://github.com/CypherAli/web2-laptop-marketplace.git
cd web2-laptop-marketplace
```

### Bước 2: Cài đặt dependencies
```bash
# Cài đặt dependencies cho cả server và client
npm run install-all

# Hoặc cài riêng
cd server && npm install
cd ../client && npm install
```

### Bước 3: Cấu hình môi trường

#### Server (.env)
Tạo file `server/.env`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/laptop-db
JWT_SECRET=your-secret-key-here-change-in-production
CLIENT_URL=http://localhost:3001

# Email config (optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

#### Client (.env)
Tạo file `client/.env`:
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
```

### Bước 4: Khởi chạy MongoDB
```bash
# Windows
mongod

# Linux/Mac
sudo systemctl start mongod
```

### Bước 5: Seed dữ liệu mẫu (Optional)
```bash
cd server
node seedProducts.js
node createAdminUser.js
```

### Bước 6: Chạy ứng dụng

#### Development (chạy đồng thời server và client)
```bash
# Từ thư mục root
npm start
```

#### Hoặc chạy riêng

```bash
# Terminal 1 - Server
cd server
npm start

# Terminal 2 - Client
cd client
npm start
```

Server: http://localhost:5000
Client: http://localhost:3001

## 👤 Tài khoản mặc định

**⚠️ Tất cả mật khẩu mặc định: `123456`**

### Admin
- Email: admin@laptop.com
- Password: 123456

### Partner (nếu có trong DB)
- Email: partner@laptop.com hoặc laptoppro@shop.com
- Password: 123456

### Client
- Đăng ký tự do tại /register
- Password mặc định khi test: 123456

## 📝 API Endpoints

### Authentication
```
POST /api/auth/register     - Đăng ký
POST /api/auth/login        - Đăng nhập
GET  /api/auth/me           - Lấy thông tin user
PUT  /api/auth/profile      - Cập nhật profile
```

### Products
```
GET    /api/products        - Danh sách sản phẩm (có filter, sort, pagination)
GET    /api/products/:id    - Chi tiết sản phẩm
POST   /api/products        - Tạo sản phẩm (Partner/Admin)
PUT    /api/products/:id    - Cập nhật sản phẩm
DELETE /api/products/:id    - Xóa sản phẩm
```

### Orders
```
GET  /api/orders            - Danh sách đơn hàng
GET  /api/orders/:id        - Chi tiết đơn hàng
POST /api/orders            - Tạo đơn hàng
PUT  /api/orders/:id/status - Cập nhật trạng thái
```

### Cart
```
GET    /api/cart            - Lấy giỏ hàng
POST   /api/cart            - Thêm vào giỏ
PUT    /api/cart/:itemId    - Cập nhật số lượng
DELETE /api/cart/:itemId    - Xóa sản phẩm
DELETE /api/cart/clear/all  - Xóa toàn bộ giỏ
```

### Chat
```
GET  /api/chat/conversations        - Danh sách cuộc trò chuyện
POST /api/chat/conversations        - Tạo conversation
GET  /api/chat/conversations/:id/messages - Lấy tin nhắn
POST /api/chat/conversations/:id/messages - Gửi tin nhắn
```

## 🎨 Tính năng nổi bật

### 1. Multi-Vendor Order System
- Đơn hàng có thể chứa sản phẩm từ nhiều partner
- Mỗi partner quản lý riêng sản phẩm của mình trong đơn
- Tự động tính toán commission và doanh thu

### 2. Real-time Chat
- Chat trực tiếp giữa khách hàng và partner
- Hỗ trợ anonymous chat (không cần đăng nhập)
- Socket.IO đảm bảo tin nhắn real-time
- Lưu lịch sử chat

### 3. Advanced Filtering
- Lọc theo brand, RAM, processor, price range
- Sort theo giá, độ phổ biến, mới nhất
- Pagination cho performance tốt

### 4. Smart Cart Management
- Tự động nhóm sản phẩm theo seller
- Kiểm tra stock real-time
- Tính phí ship tự động

### 5. Notification System
- Real-time notifications qua Socket.IO
- Email notifications
- In-app notification center

## 🔒 Bảo mật

- ✅ JWT authentication với expiry time
- ✅ Password hashing với Bcrypt
- ✅ Role-based access control (Client, Partner, Admin)
- ✅ Input validation và sanitization
- ✅ Protected routes
- ✅ CORS configuration

## 🐛 Xử lý lỗi đã biết

### Lỗi kết nối MongoDB
```bash
# Kiểm tra MongoDB đang chạy
mongod --version
# Khởi động MongoDB
mongod
```

### Port đã được sử dụng
```bash
# Windows - Tìm và kill process
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:5000 | xargs kill -9
```

## 📈 Performance Optimization

- Database indexing cho queries thường dùng
- Lazy loading images
- Pagination cho lists
- Caching với React Context
- Debouncing cho search input

## 🤝 Đóng góp

Mọi đóng góp đều được hoan nghênh! Vui lòng:
1. Fork repository
2. Tạo branch mới (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

## 📄 License

MIT License - xem file [LICENSE](LICENSE) để biết thêm chi tiết.

## 👨‍💻 Tác giả

**CypherAli**
- GitHub: [@CypherAli](https://github.com/CypherAli)

## 📞 Liên hệ & Hỗ trợ

- Email: support@laptopmarketplace.com
- Issues: [GitHub Issues](https://github.com/CypherAli/web2-laptop-marketplace/issues)

---

⭐ Nếu project hữu ích, đừng quên cho một star nhé!
