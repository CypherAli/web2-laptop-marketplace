# SƠ ĐỒ CẤU TRÚC PROJECT LAPTOP MARKETPLACE - CHI TIẾT HOÀN CHỈNH

## 📋 TỔNG QUAN PROJECT

**Tên Project:** Laptop Marketplace  
**Loại:** Full-stack E-commerce Application  
**Stack:** MERN (MongoDB, Express, React, Node.js)  
**Cấu trúc:** Monorepo (Server + Client)

---

## 🌳 CẤU TRÚC THỨ BẬC HOÀN CHỈNH

```
laptop-marketplace/
├── 📁 .git/                          [AUTO - Git repository]
├── 📁 node_modules/                  [AUTO - Root dependencies]
├── 📁 client/                        [MANUAL - Frontend React App]
├── 📁 server/                        [MANUAL - Backend API Server]
├── 📁 docs_backup_20251117/          [MANUAL - Documentation]
├── 📄 .gitignore                     [MANUAL - Git ignore rules]
├── 📄 package.json                   [MANUAL - Root package config]
├── 📄 package-lock.json              [AUTO - Root lock file]
└── 📄 Laptop_Marketplace_API.postman_collection.json [MANUAL - API Testing]
```

---

## 📦 ROOT LEVEL (laptop-marketplace/)

### 📄 Files chính

#### 1. **package.json** ✅ MANUAL
```json
{
  "name": "laptop-marketplace",
  "version": "1.0.0",
  "scripts": {
    "install-all": "Cài đặt dependencies cho cả server và client",
    "server": "Chạy backend server",
    "client": "Chạy frontend React",
    "dev": "Chạy đồng thời server và client",
    "start": "Khởi động production",
    "build": "Build client cho production"
  }
}
```
**Chức năng:** Quản lý scripts và dependencies cho toàn bộ project

#### 2. **package-lock.json** ⚙️ AUTO
- Sinh tự động khi chạy `npm install`
- Lock phiên bản chính xác của dependencies

#### 3. **Laptop_Marketplace_API.postman_collection.json** ✅ MANUAL
- Collection Postman để test API
- Chứa tất cả endpoints của hệ thống
- Dùng cho development và testing

#### 4. **.gitignore** ✅ MANUAL
```
node_modules/
.env
build/
.DS_Store
```
**Chức năng:** Loại trừ files/folders không cần commit

### 📁 Folders chính

#### 1. **.git/** ⚙️ AUTO
- Sinh tự động khi `git init`
- Chứa lịch sử version control
- Không được chỉnh sửa thủ công

#### 2. **node_modules/** ⚙️ AUTO
- Sinh tự động khi `npm install`
- Chứa dependencies cấp root (concurrently, axios)

#### 3. **docs_backup_20251117/** ✅ MANUAL
- Tài liệu kỹ thuật
- Hướng dẫn sử dụng
- Changelog và reports
- **Tổng cộng 100+ files markdown** về:
  - API Reference
  - Testing Guides
  - Bug Fix Reports
  - Feature Documentation
  - Deployment Guides

---

## 🎨 CLIENT (Frontend - React Application)

### 📂 client/ - Cấu trúc tổng quan

```
client/
├── 📁 node_modules/          [AUTO]
├── 📁 public/                [MANUAL + AUTO]
├── 📁 src/                   [MANUAL - Source code chính]
├── 📁 build/                 [AUTO - Production build]
├── 📄 package.json           [MANUAL]
├── 📄 package-lock.json      [AUTO]
├── 📄 .env                   [MANUAL - Environment variables]
├── 📄 .env.example           [MANUAL - Template]
└── 📄 .gitignore             [MANUAL]
```

---

### 📄 client/package.json ✅ MANUAL

**Dependencies chính:**
- **react** (19.2.0) - Core React library
- **react-router-dom** (6.30.1) - Routing
- **axios** (1.13.2) - HTTP client
- **socket.io-client** (4.8.1) - Real-time chat
- **framer-motion** (12.23.24) - Animations
- **chart.js** + **react-chartjs-2** - Charts/Analytics
- **rc-slider** - Range slider cho filters
- **jwt-decode** - JWT token parsing
- **react-icons** - Icon library

**Scripts:**
- `npm start` - Development server (port 3000)
- `npm build` - Production build
- `npm test` - Run tests

---

### 📁 client/public/ - Static Assets

```
public/
├── 📄 index.html                    [MANUAL - HTML template]
├── 📄 manifest.json                 [MANUAL - PWA config]
├── 📄 robots.txt                    [MANUAL - SEO]
├── 📄 favicon.ico                   [MANUAL - Icon]
├── 📄 logo192.png                   [MANUAL - Logo]
├── 📄 logo512.png                   [MANUAL - Logo]
├── 📄 comprehensive-role-test.js    [MANUAL - Testing script]
├── 📄 system-test.js                [MANUAL - System test]
└── 📄 test-role-system.js           [MANUAL - Role test]
```

**Chức năng từng file:**

1. **index.html** ✅ MANUAL
   - HTML template chính
   - Root div: `<div id="root"></div>`
   - Meta tags, title, favicon

2. **manifest.json** ✅ MANUAL
   - PWA configuration
   - App name, icons, theme color

3. **robots.txt** ✅ MANUAL
   - SEO crawling rules
   - Allow/disallow search engines

4. **favicon.ico, logo192.png, logo512.png** ✅ MANUAL
   - Branding images
   - Different sizes for different devices

5. **Test files (.js)** ✅ MANUAL
   - comprehensive-role-test.js: Test toàn diện hệ thống roles
   - system-test.js: System integration tests
   - test-role-system.js: Role-based access tests

---

### 📁 client/src/ - Source Code Chính

```
src/
├── 📁 api/              [MANUAL - API integration]
├── 📁 components/       [MANUAL - Reusable components]
├── 📁 context/          [MANUAL - React Context]
├── 📁 hooks/            [MANUAL - Custom hooks]
├── 📁 pages/            [MANUAL - Page components]
├── 📁 styles/           [MANUAL - Global styles]
├── 📁 utils/            [MANUAL - Utility functions]
├── 📄 App.js            [MANUAL - Root component]
├── 📄 index.js          [MANUAL - Entry point]
└── 📄 index.css         [MANUAL - Global CSS]
```

---

#### 📁 client/src/api/ - API Integration Layer

**Chức năng:** Centralized API calls, axios configuration

```
api/
├── axios.js             [MANUAL - Axios instance config]
├── adminApi.js          [MANUAL - Admin endpoints]
├── authApi.js           [MANUAL - Authentication]
├── productApi.js        [MANUAL - Products CRUD]
├── cartApi.js           [MANUAL - Cart operations]
├── orderApi.js          [MANUAL - Order management]
├── reviewApi.js         [MANUAL - Reviews]
├── chatApi.js           [MANUAL - Chat system]
├── notificationApi.js   [MANUAL - Notifications]
├── analyticsApi.js      [MANUAL - Analytics data]
└── ...                  [Các API khác]
```

**Ví dụ nội dung:**
- Base URL configuration
- Request/response interceptors
- JWT token attachment
- Error handling

---

#### 📁 client/src/components/ - Reusable Components

```
components/
├── 📁 layout/           [MANUAL - Layout components]
│   ├── Header.js
│   ├── Footer.js
│   ├── Footer.css
│   ├── RoleBasedLayout.js
│   └── RoleBasedLayout.css
│
├── 📁 product/          [MANUAL - Product components]
│   ├── AnimatedProductCard.js
│   ├── AnimatedProductCard.css
│   ├── BestSellers.js
│   ├── BestSellers.css
│   ├── ProductComparison.js
│   ├── ProductComparison.css
│   ├── ProductImage.js
│   └── ProductImage.css
│
├── 📁 cart/             [MANUAL - Shopping cart]
│   ├── CartPopup.js
│   ├── CartItem.js
│   └── CartSummary.js
│
├── 📁 sidebar/          [MANUAL - Filter sidebar]
│   ├── FilterSidebar.js
│   ├── FilterSidebar.css
│   ├── PriceRangeSlider.js
│   └── BrandFilter.js
│
├── 📁 chat/             [MANUAL - Real-time chat]
│   ├── ChatBox.js
│   ├── ChatMessage.js
│   ├── ChatInput.js
│   └── ChatList.js
│
├── 📁 notification/     [MANUAL - Notifications]
│   ├── NotificationBell.js
│   ├── NotificationItem.js
│   └── NotificationList.js
│
├── 📁 modal/            [MANUAL - Modal dialogs]
│   ├── Modal.js
│   ├── ConfirmModal.js
│   └── PremiumModal.js
│
├── 📁 loading/          [MANUAL - Loading states]
│   ├── Spinner.js
│   └── LoadingPage.js
│
├── 📁 rating/           [MANUAL - Star rating]
│   ├── StarRating.js
│   └── RatingDisplay.js
│
├── 📁 review/           [MANUAL - Product reviews]
│   ├── ReviewCard.js
│   ├── ReviewForm.js
│   └── ReviewList.js
│
├── 📁 comparison/       [MANUAL - Product comparison]
│   ├── ComparisonBar.js
│   └── ComparisonTable.js
│
├── 📁 profile/          [MANUAL - User profile]
│   ├── ProfileCard.js
│   ├── ProfileEdit.js
│   └── AvatarUpload.js
│
├── 📁 partner/          [MANUAL - Partner features]
│   ├── PartnerDashboard.js
│   └── PartnerStats.js
│
├── 📁 user/             [MANUAL - User components]
│   ├── UserCard.js
│   └── UserList.js
│
├── 📁 route/            [MANUAL - Route guards]
│   ├── ProtectedRoute.js
│   ├── AdminRoute.js
│   └── PartnerRoute.js
│
└── 📁 common/           [MANUAL - Shared components]
    ├── Button.js
    ├── Input.js
    ├── Card.js
    └── Badge.js
```

**Giải thích chi tiết:**

1. **layout/** - Bố cục trang
   - Header: Navigation, search, cart icon, user menu
   - Footer: Links, contact, social media
   - RoleBasedLayout: Layout khác nhau cho User/Partner/Admin

2. **product/** - Components sản phẩm
   - AnimatedProductCard: Card sản phẩm có animation
   - BestSellers: Hiển thị sản phẩm bán chạy
   - ProductComparison: So sánh sản phẩm
   - ProductImage: Image với zoom/hover effects

3. **cart/** - Giỏ hàng
   - CartPopup: Popup giỏ hàng khi hover
   - CartItem: Từng item trong giỏ
   - CartSummary: Tổng kết đơn hàng

4. **sidebar/** - Bộ lọc sản phẩm
   - FilterSidebar: Sidebar chứa tất cả filters
   - PriceRangeSlider: Slider chọn khoảng giá
   - BrandFilter: Filter theo hãng

5. **chat/** - Chat real-time
   - ChatBox: Hộp chat chính
   - ChatMessage: Từng message
   - ChatInput: Input gửi tin nhắn
   - ChatList: Danh sách conversations

6. **notification/** - Thông báo
   - NotificationBell: Icon chuông thông báo
   - NotificationItem: Từng thông báo
   - NotificationList: Danh sách thông báo

7. **modal/** - Dialogs
   - Modal: Base modal component
   - ConfirmModal: Xác nhận actions
   - PremiumModal: Popup premium features

---

#### 📁 client/src/pages/ - Page Components

```
pages/
├── 📁 home/             [MANUAL - Trang chủ]
│   ├── HomePage.js
│   └── HomePage.css
│
├── 📁 product/          [MANUAL - Product pages]
│   ├── ProductList.js
│   ├── ProductDetail.js
│   ├── ProductSearch.js
│   └── styles/
│
├── 📁 deals/            [MANUAL - Deals/Promotions]
│   ├── DealsPage.js
│   └── DealsPage.css
│
├── 📁 user/             [MANUAL - User pages]
│   ├── Login.js
│   ├── Register.js
│   ├── Profile.js
│   ├── OrderHistory.js
│   └── Wishlist.js
│
├── 📁 admin/            [MANUAL - Admin dashboard]
│   ├── AdminDashboard.js
│   ├── AdminDashboard.css
│   ├── AdminDashboard.professional.css
│   ├── ProductManagement.js
│   ├── OrderManagement.js
│   ├── UserManagement.js
│   └── Analytics.js
│
├── 📁 partner/          [MANUAL - Partner portal]
│   ├── PartnerDashboard.js
│   ├── PartnerProducts.js
│   └── PartnerOrders.js
│
├── 📁 manager/          [MANUAL - Manager pages]
│   ├── ManagerDashboard.js
│   └── TeamManagement.js
│
├── 📁 chat/             [MANUAL - Chat pages]
│   ├── ChatPage.js
│   └── Conversations.js
│
├── 📁 notification/     [MANUAL - Notification page]
│   └── NotificationPage.js
│
├── 📁 guide/            [MANUAL - User guides]
│   ├── BuyingGuide.js
│   └── FAQPage.js
│
├── 📁 company/          [MANUAL - Company info]
│   ├── AboutUs.js
│   └── ContactUs.js
│
└── 📁 common/           [MANUAL - Common pages]
    ├── NotFound.js
    └── Unauthorized.js
```

**Giải thích từng nhóm:**

1. **home/** - Trang chủ
   - Hero banner
   - Featured products
   - Best sellers
   - Categories

2. **product/** - Sản phẩm
   - ProductList: Danh sách có filter/sort
   - ProductDetail: Chi tiết sản phẩm, reviews, specs
   - ProductSearch: Tìm kiếm sản phẩm

3. **deals/** - Ưu đãi
   - DealsPage: Sản phẩm giảm giá, flash sale

4. **user/** - User
   - Login/Register: Đăng nhập/ký
   - Profile: Thông tin cá nhân
   - OrderHistory: Lịch sử đơn hàng
   - Wishlist: Danh sách yêu thích

5. **admin/** - Admin
   - AdminDashboard: Tổng quan hệ thống
   - ProductManagement: Quản lý sản phẩm
   - OrderManagement: Quản lý đơn hàng
   - UserManagement: Quản lý users
   - Analytics: Biểu đồ thống kê

6. **partner/** - Partner
   - PartnerDashboard: Dashboard cho partners
   - PartnerProducts: Quản lý sản phẩm của partner
   - PartnerOrders: Đơn hàng của partner

---

#### 📁 client/src/context/ - React Context

```
context/
├── AuthContext.js       [MANUAL - Authentication state]
├── CartContext.js       [MANUAL - Shopping cart state]
├── ThemeContext.js      [MANUAL - Theme/Dark mode]
└── NotificationContext.js [MANUAL - Notifications]
```

**Chức năng:**
- Quản lý global state
- Share state giữa components
- Tránh prop drilling

---

#### 📁 client/src/hooks/ - Custom React Hooks

```
hooks/
├── useAuth.js           [MANUAL - Auth hook]
├── useCart.js           [MANUAL - Cart hook]
├── useDebounce.js       [MANUAL - Debounce search]
├── useLocalStorage.js   [MANUAL - LocalStorage]
└── useSocket.js         [MANUAL - Socket.io connection]
```

**Chức năng:**
- Reusable logic
- State management
- Side effects

---

#### 📁 client/src/styles/ - Global Styles

```
styles/
├── variables.css        [MANUAL - CSS variables]
├── animations.css       [MANUAL - Keyframes]
└── responsive.css       [MANUAL - Media queries]
```

---

#### 📁 client/src/utils/ - Utility Functions

```
utils/
├── formatCurrency.js    [MANUAL - Format VND]
├── formatDate.js        [MANUAL - Date formatting]
├── validation.js        [MANUAL - Form validation]
├── constants.js         [MANUAL - Constants]
└── helpers.js           [MANUAL - Helper functions]
```

---

#### 📄 client/src/ - Root Files

1. **index.js** ✅ MANUAL - Entry point
```javascript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
```

2. **App.js** ✅ MANUAL - Root component
```javascript
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
// Routing, Context providers, Layout
```

3. **index.css** ✅ MANUAL - Global styles
- Reset CSS
- Typography
- Colors, spacing

---

### 📁 client/build/ - Production Build ⚙️ AUTO

```
build/
├── static/
│   ├── css/             [AUTO - Minified CSS]
│   ├── js/              [AUTO - Minified JS bundles]
│   └── media/           [AUTO - Optimized images]
├── index.html           [AUTO - Built HTML]
├── manifest.json
├── robots.txt
└── ...test files
```

**Sinh ra khi:** `npm run build`  
**Chức năng:** Deploy production  
**Optimization:**
- Code splitting
- Minification
- Tree shaking
- Asset optimization

---

### 📄 client/.env ✅ MANUAL - Environment Variables

```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
REACT_APP_CLOUDINARY_URL=...
```

**Không commit file này!** (trong .gitignore)

---

## 🔧 SERVER (Backend - Node.js/Express API)

### 📂 server/ - Cấu trúc tổng quan

```
server/
├── 📁 node_modules/     [AUTO]
├── 📁 config/           [MANUAL - Configurations]
├── 📁 models/           [MANUAL - MongoDB models]
├── 📁 controllers/      [MANUAL - Business logic]
├── 📁 routes/           [MANUAL - API routes]
├── 📁 middleware/       [MANUAL - Middlewares]
├── 📁 services/         [MANUAL - External services]
├── 📁 scripts/          [MANUAL - Utility scripts]
├── 📁 uploads/          [AUTO - Uploaded files]
├── 📄 server.js         [MANUAL - Entry point]
├── 📄 seedProducts.js   [MANUAL - Seed database]
├── 📄 createAdminUser.js [MANUAL - Create admin]
├── 📄 package.json      [MANUAL]
├── 📄 package-lock.json [AUTO]
├── 📄 .env              [MANUAL - Environment]
├── 📄 .env.example      [MANUAL - Template]
└── 📄 .gitignore        [MANUAL]
```

---

### 📄 server/package.json ✅ MANUAL

**Dependencies chính:**
- **express** (5.1.0) - Web framework
- **mongoose** (8.19.3) - MongoDB ODM
- **jsonwebtoken** (9.0.2) - JWT authentication
- **bcryptjs** (3.0.3) - Password hashing
- **socket.io** (4.8.1) - Real-time communication
- **multer** (2.0.2) - File uploads
- **nodemailer** (7.0.10) - Send emails
- **node-cron** (4.2.1) - Scheduled tasks
- **cors** (2.8.5) - CORS middleware
- **dotenv** (17.2.3) - Environment variables

**Scripts:**
- `npm start` - Start server (port 5000)

---

### 📄 server/server.js ✅ MANUAL - Entry Point

**Chức năng:**
1. Import dependencies
2. Initialize Express app
3. Connect MongoDB
4. Setup middlewares (cors, json, file upload)
5. Register routes
6. Setup Socket.io
7. Error handling
8. Start server

```javascript
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const socketio = require('socket.io');
// ... 

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
// ...

// Socket.io
const io = socketio(server);
// ...

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

---

### 📁 server/config/ - Configurations

```
config/
└── db.js                [MANUAL - MongoDB connection]
```

**db.js:**
```javascript
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('DB Error:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
```

---

### 📁 server/models/ - MongoDB Models (Schemas)

```
models/
├── User.js              [MANUAL - User schema]
├── Product.js           [MANUAL - Product schema]
├── Order.js             [MANUAL - Order schema]
├── Cart.js              [MANUAL - Cart schema]
├── Review.js            [MANUAL - Review schema]
├── Chat.js              [MANUAL - Chat schema]
├── Message.js           [MANUAL - Message schema]
├── Conversation.js      [MANUAL - Conversation schema]
├── Notification.js      [MANUAL - Notification schema]
├── Payment.js           [MANUAL - Payment schema]
├── Voucher.js           [MANUAL - Voucher schema]
├── Warranty.js          [MANUAL - Warranty schema]
├── PriceAlert.js        [MANUAL - Price alert schema]
├── Comparison.js        [MANUAL - Comparison schema]
└── SupportTicket.js     [MANUAL - Support ticket schema]
```

**Chi tiết từng model:**

#### 1. **User.js** ✅ MANUAL
```javascript
const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: String,
  role: { 
    type: String, 
    enum: ['user', 'partner', 'admin', 'manager'],
    default: 'user' 
  },
  avatar: String,
  phone: String,
  address: Object,
  cart: [{ product: ObjectId, quantity: Number }],
  wishlist: [ObjectId],
  createdAt: Date
});
```
**Chức năng:** Lưu thông tin users, authentication, roles

#### 2. **Product.js** ✅ MANUAL
```javascript
const productSchema = new Schema({
  name: String,
  brand: String,
  price: Number,
  originalPrice: Number,
  discount: Number,
  category: String,
  specs: {
    cpu: String,
    ram: String,
    storage: String,
    gpu: String,
    screen: String,
    battery: String,
    weight: String
  },
  images: [String],
  description: String,
  stock: Number,
  seller: { type: ObjectId, ref: 'User' },
  rating: Number,
  reviewCount: Number,
  sold: Number,
  featured: Boolean,
  createdAt: Date
});
```
**Chức năng:** Lưu sản phẩm laptop với specs chi tiết

#### 3. **Order.js** ✅ MANUAL
```javascript
const orderSchema = new Schema({
  user: { type: ObjectId, ref: 'User' },
  items: [{
    product: { type: ObjectId, ref: 'Product' },
    quantity: Number,
    price: Number
  }],
  total: Number,
  shippingAddress: Object,
  paymentMethod: String,
  paymentStatus: { 
    type: String, 
    enum: ['pending', 'paid', 'failed'] 
  },
  orderStatus: { 
    type: String, 
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'] 
  },
  createdAt: Date
});
```
**Chức năng:** Quản lý đơn hàng

#### 4. **Cart.js** ✅ MANUAL
- User cart
- Items: [{product, quantity}]
- Calculate total

#### 5. **Review.js** ✅ MANUAL
```javascript
const reviewSchema = new Schema({
  product: { type: ObjectId, ref: 'Product' },
  user: { type: ObjectId, ref: 'User' },
  rating: { type: Number, min: 1, max: 5 },
  comment: String,
  images: [String],
  helpful: Number,
  createdAt: Date
});
```
**Chức năng:** Đánh giá sản phẩm

#### 6. **Chat.js, Message.js, Conversation.js** ✅ MANUAL
- Real-time messaging system
- Support chat giữa users và admin/partners

#### 7. **Notification.js** ✅ MANUAL
- Thông báo cho users
- Types: order, promotion, system

#### 8. **Payment.js** ✅ MANUAL
- Payment transactions
- Integration với payment gateways

#### 9. **Voucher.js** ✅ MANUAL
- Discount codes
- Expiry dates, conditions

#### 10. **Warranty.js** ✅ MANUAL
- Warranty information
- Warranty claims

#### 11. **PriceAlert.js** ✅ MANUAL
- User subscribes to price drops
- Automatic notifications

#### 12. **Comparison.js** ✅ MANUAL
- Save product comparisons
- User comparison lists

#### 13. **SupportTicket.js** ✅ MANUAL
- Customer support tickets
- Status tracking

---

### 📁 server/controllers/ - Business Logic

```
controllers/
├── authController.js            [MANUAL - Auth logic]
├── authController.js.backup     [MANUAL - Backup]
├── authController.test.js       [MANUAL - Tests]
├── productController.js         [MANUAL - Product CRUD]
├── orderController.js           [MANUAL - Order management]
├── userProfileController.js     [MANUAL - User profile]
├── reviewController.js          [MANUAL - Reviews]
├── chatController.js            [MANUAL - Chat]
├── notificationController.js    [MANUAL - Notifications]
├── paymentController.js         [MANUAL - Payments]
├── voucherController.js         [MANUAL - Vouchers]
├── warrantyController.js        [MANUAL - Warranty]
├── priceAlertController.js      [MANUAL - Price alerts]
├── comparisonController.js      [MANUAL - Comparisons]
├── supportTicketController.js   [MANUAL - Support]
├── adminController.js           [MANUAL - Admin functions]
├── partnerController.js         [MANUAL - Partner functions]
└── analyticsController.js       [MANUAL - Analytics/Stats]
```

**Chi tiết từng controller:**

#### 1. **authController.js** ✅ MANUAL
```javascript
// register - Đăng ký user mới
// login - Đăng nhập, return JWT
// logout - Đăng xuất
// getMe - Get current user
// forgotPassword - Reset password
// verifyEmail - Email verification
```

#### 2. **productController.js** ✅ MANUAL
```javascript
// getAllProducts - List products với filters, pagination
// getProductById - Chi tiết 1 sản phẩm
// createProduct - Tạo sản phẩm mới (Admin/Partner)
// updateProduct - Update sản phẩm
// deleteProduct - Xóa sản phẩm
// searchProducts - Tìm kiếm
// getProductsByCategory - Filter theo category
// getFeaturedProducts - Sản phẩm nổi bật
// getBestSellers - Bán chạy nhất
```

#### 3. **orderController.js** ✅ MANUAL
```javascript
// createOrder - Tạo đơn hàng mới
// getUserOrders - Lịch sử đơn hàng
// getOrderById - Chi tiết đơn hàng
// updateOrderStatus - Cập nhật trạng thái
// cancelOrder - Hủy đơn
// getAllOrders - Admin xem tất cả orders
// getPartnerOrders - Partner xem orders của mình
```

#### 4. **adminController.js** ✅ MANUAL
```javascript
// getDashboardStats - Thống kê tổng quan
// getAllUsers - Quản lý users
// updateUserRole - Thay đổi role
// deleteUser - Xóa user
// getSystemLogs - System logs
// approvePartner - Duyệt partner
```

#### 5. **analyticsController.js** ✅ MANUAL
```javascript
// getSalesAnalytics - Phân tích doanh thu
// getProductAnalytics - Thống kê sản phẩm
// getUserAnalytics - Thống kê users
// getRevenueByMonth - Doanh thu theo tháng
// getTopSellingProducts - Top products
```

#### 6. **chatController.js** ✅ MANUAL
```javascript
// getConversations - List conversations
// getMessages - Get messages
// sendMessage - Gửi tin nhắn
// markAsRead - Đánh dấu đã đọc
```

#### 7. **Các controllers khác** tương tự
- Mỗi controller handle logic cho 1 model
- CRUD operations
- Business rules validation

---

### 📁 server/routes/ - API Routes

```
routes/
├── authRoute.js             [MANUAL - /api/auth]
├── productRoute.js          [MANUAL - /api/products]
├── orderRoute.js            [MANUAL - /api/orders]
├── userRoute.js             [MANUAL - /api/users]
├── userProfileRoutes.js     [MANUAL - /api/profile]
├── cartRoute.js             [MANUAL - /api/cart]
├── reviewRoute.js           [MANUAL - /api/reviews]
├── chatRoute.js             [MANUAL - /api/chat]
├── chat.js                  [MANUAL - Alternative chat route]
├── notificationRoutes.js    [MANUAL - /api/notifications]
├── paymentRoutes.js         [MANUAL - /api/payments]
├── voucherRoutes.js         [MANUAL - /api/vouchers]
├── warrantyRoutes.js        [MANUAL - /api/warranty]
├── priceAlertRoutes.js      [MANUAL - /api/price-alerts]
├── comparisonRoute.js       [MANUAL - /api/comparisons]
├── supportTicketRoutes.js   [MANUAL - /api/support]
├── adminRoute.js            [MANUAL - /api/admin]
├── partnerRoute.js          [MANUAL - /api/partner]
├── analyticsRoute.js        [MANUAL - /api/analytics]
└── blogRoute.js             [MANUAL - /api/blog]
```

**Ví dụ cấu trúc route:**

#### productRoute.js
```javascript
const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.get('/search', productController.searchProducts);

// Protected routes (Admin/Partner only)
router.post('/', 
  protect, 
  authorize('admin', 'partner'), 
  productController.createProduct
);

router.put('/:id', 
  protect, 
  authorize('admin', 'partner'), 
  productController.updateProduct
);

router.delete('/:id', 
  protect, 
  authorize('admin'), 
  productController.deleteProduct
);

module.exports = router;
```

**API Endpoints:**

1. **Auth Routes** (`/api/auth`)
   - POST `/register` - Đăng ký
   - POST `/login` - Đăng nhập
   - GET `/me` - Get current user
   - POST `/logout` - Đăng xuất

2. **Product Routes** (`/api/products`)
   - GET `/` - List products
   - GET `/:id` - Chi tiết sản phẩm
   - GET `/search?q=...` - Tìm kiếm
   - POST `/` - Tạo sản phẩm (Admin/Partner)
   - PUT `/:id` - Update sản phẩm
   - DELETE `/:id` - Xóa sản phẩm

3. **Order Routes** (`/api/orders`)
   - GET `/` - User's orders
   - POST `/` - Tạo order
   - GET `/:id` - Chi tiết order
   - PUT `/:id` - Update status

4. **Admin Routes** (`/api/admin`)
   - GET `/stats` - Dashboard stats
   - GET `/users` - All users
   - PUT `/users/:id/role` - Change role
   - DELETE `/users/:id` - Delete user

5. **Các routes khác** tương tự pattern

---

### 📁 server/middleware/ - Middlewares

```
middleware/
├── auth.js              [MANUAL - JWT verification]
├── authMiddleware.js    [MANUAL - Alternative auth]
├── authorize.js         [MANUAL - Role-based access]
├── isOwner.js           [MANUAL - Resource ownership]
└── upload.js            [MANUAL - Multer file upload]
```

**Chi tiết:**

#### 1. **auth.js / authMiddleware.js** ✅ MANUAL
```javascript
const jwt = require('jsonwebtoken');

const protect = async (req, res, next) => {
  let token;
  
  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  
  if (!token) {
    return res.status(401).json({ message: 'Not authorized' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = { protect };
```
**Chức năng:** Verify JWT token, attach user to request

#### 2. **authorize.js** ✅ MANUAL
```javascript
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: 'Access denied' 
      });
    }
    next();
  };
};

module.exports = { authorize };
```
**Chức năng:** Check user roles (user/partner/admin/manager)

#### 3. **isOwner.js** ✅ MANUAL
```javascript
const isOwner = (Model) => async (req, res, next) => {
  const resource = await Model.findById(req.params.id);
  
  if (resource.user.toString() !== req.user.id && 
      req.user.role !== 'admin') {
    return res.status(403).json({ 
      message: 'Not owner' 
    });
  }
  
  next();
};
```
**Chức năng:** Check resource ownership (edit own reviews, orders, etc.)

#### 4. **upload.js** ✅ MANUAL
```javascript
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  
  if (extname) {
    cb(null, true);
  } else {
    cb(new Error('Only images allowed'));
  }
};

const upload = multer({ 
  storage, 
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

module.exports = upload;
```
**Chức năng:** 
- Upload images (products, avatars)
- File validation
- Size limits

---

### 📁 server/services/ - External Services

```
services/
├── emailService.js      [MANUAL - Email notifications]
└── cronJobs.js          [MANUAL - Scheduled tasks]
```

#### 1. **emailService.js** ✅ MANUAL
```javascript
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

const sendEmail = async (to, subject, html) => {
  await transporter.sendMail({
    from: process.env.FROM_EMAIL,
    to,
    subject,
    html
  });
};

const sendOrderConfirmation = async (order) => {
  const html = `
    <h1>Order Confirmation</h1>
    <p>Order #${order._id}</p>
    <p>Total: ${order.total} VND</p>
  `;
  
  await sendEmail(order.user.email, 'Order Confirmation', html);
};

module.exports = { sendEmail, sendOrderConfirmation };
```
**Chức năng:**
- Send order confirmations
- Password reset emails
- Promotional emails
- Price alert notifications

#### 2. **cronJobs.js** ✅ MANUAL
```javascript
const cron = require('node-cron');
const PriceAlert = require('../models/PriceAlert');
const Product = require('../models/Product');

// Check price alerts every hour
cron.schedule('0 * * * *', async () => {
  const alerts = await PriceAlert.find({ active: true })
    .populate('user product');
  
  for (const alert of alerts) {
    if (alert.product.price <= alert.targetPrice) {
      // Send notification
      await sendPriceAlertEmail(alert);
      alert.active = false;
      await alert.save();
    }
  }
});

module.exports = { /* cron jobs */ };
```
**Chức năng:**
- Price monitoring
- Auto-expire vouchers
- Clean old notifications
- Generate reports

---

### 📁 server/scripts/ - Utility Scripts

```
scripts/
├── check-users.js       [MANUAL - Check user data]
├── fix-passwords.js     [MANUAL - Fix password hashes]
└── generate-hash.js     [MANUAL - Generate hash]
```

**Chức năng:**
- Database maintenance
- Data migration
- Testing utilities
- One-time fixes

---

### 📄 server/seedProducts.js ✅ MANUAL

```javascript
const mongoose = require('mongoose');
const Product = require('./models/Product');
const products = require('./data/products.json');

const seedDB = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  await Product.deleteMany({});
  await Product.insertMany(products);
  console.log('Database seeded!');
  process.exit();
};

seedDB();
```

**Chạy:** `node seedProducts.js`  
**Chức năng:** Populate database với sample products

---

### 📄 server/createAdminUser.js ✅ MANUAL

```javascript
const User = require('./models/User');
const bcrypt = require('bcryptjs');

const createAdmin = async () => {
  const password = await bcrypt.hash('admin123', 10);
  
  await User.create({
    email: 'admin@laptop.com',
    password,
    name: 'Admin',
    role: 'admin'
  });
  
  console.log('Admin user created!');
};
```

**Chạy:** `node createAdminUser.js`  
**Chức năng:** Tạo admin account đầu tiên

---

### 📁 server/uploads/ - File Uploads ⚙️ AUTO

```
uploads/
└── avatars/             [AUTO - User avatars]
    ├── 1638291829-avatar.jpg
    ├── 1638291940-profile.png
    └── ...
```

**Sinh ra khi:** Users upload avatars/images  
**Multer storage:** Server lưu files vào đây  
**Access:** `http://localhost:5000/uploads/avatars/filename.jpg`

---

### 📄 server/.env ✅ MANUAL - Environment Variables

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/laptop-marketplace

# JWT
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=30d

# Email (Nodemailer)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
FROM_EMAIL=noreply@laptop.com

# Cloudinary (optional)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Payment Gateway (optional)
VNPAY_TMN_CODE=...
VNPAY_HASH_SECRET=...
```

**KHÔNG commit file này!** Dùng .env.example làm template

---

## 📊 TÓM TẮT PHÂN LOẠI FILES

### ✅ FILES MANUAL (Tự code)

**ROOT:**
- package.json
- .gitignore
- Laptop_Marketplace_API.postman_collection.json

**CLIENT:**
- Tất cả files trong `src/`
- public/index.html, manifest.json, robots.txt
- public/*.js (test files)
- package.json
- .env, .env.example, .gitignore

**SERVER:**
- server.js
- seedProducts.js
- createAdminUser.js
- Tất cả files trong `config/`, `models/`, `controllers/`, `routes/`, `middleware/`, `services/`, `scripts/`
- package.json
- .env, .env.example, .gitignore

**DOCS:**
- Tất cả 100+ markdown files trong `docs_backup_20251117/`

**Tổng: ~500+ files manual**

---

### ⚙️ FILES AUTO (Sinh tự động)

**GIT:**
- .git/ (toàn bộ)

**NODE_MODULES:**
- node_modules/ (root)
- client/node_modules/
- server/node_modules/

**LOCK FILES:**
- package-lock.json (root)
- client/package-lock.json
- server/package-lock.json

**BUILD:**
- client/build/ (toàn bộ)
  - static/css/*.css
  - static/js/*.js
  - index.html
  - manifest.json, etc.

**UPLOADS:**
- server/uploads/avatars/*.jpg, *.png

**Tổng: ~50,000+ files (chủ yếu node_modules)**

---

## 🔄 WORKFLOW & DATA FLOW

### 1. **User Registration/Login Flow**

```
Client (Login.js)
  → axios POST /api/auth/login {email, password}
    → Server (authRoute.js)
      → authController.login()
        → User.findOne({email})
        → bcrypt.compare(password)
        → jwt.sign({id, role})
        → Return {token, user}
      → Client saves token to localStorage
      → AuthContext updates state
      → Redirect based on role
```

### 2. **Product Listing Flow**

```
Client (ProductList.js)
  → useEffect → axios GET /api/products?category=...&minPrice=...
    → Server (productRoute.js)
      → productController.getAllProducts()
        → Product.find(filters).limit().skip()
        → Return {products, total, page}
      → Client renders products
      → FilterSidebar controls filters
```

### 3. **Add to Cart Flow**

```
Client (AnimatedProductCard.js)
  → Click "Add to Cart"
    → CartContext.addToCart(product, quantity)
      → axios POST /api/cart {productId, quantity}
        → Server (cartRoute.js)
          → Cart.findOneAndUpdate({user})
          → Add/update item
          → Return updated cart
        → Client updates CartContext
        → CartPopup shows notification
```

### 4. **Checkout Flow**

```
Client (Cart.js)
  → Click "Checkout"
    → Redirect to Checkout page
      → Fill shipping info
      → Select payment method
      → axios POST /api/orders {items, address, payment}
        → Server (orderController.js)
          → Create Order
          → Update Product.stock
          → Clear Cart
          → emailService.sendOrderConfirmation()
          → Return order
        → Client redirects to Order Success
        → Send notification to admin/partner
```

### 5. **Real-time Chat Flow**

```
Client (ChatBox.js)
  → useSocket() connects to server
  → io.on('connect')
    → Server (server.js)
      → Socket.io connection established
      → Join room based on userId
      
  → User types message
    → io.emit('sendMessage', {to, message})
      → Server receives
      → Save to Message model
      → io.to(recipientId).emit('newMessage')
      → Recipient client receives
      → Update ChatBox real-time
```

### 6. **Admin Dashboard Flow**

```
Client (AdminDashboard.js)
  → useEffect → Multiple API calls in parallel:
    → axios GET /api/admin/stats
    → axios GET /api/analytics/sales
    → axios GET /api/admin/recent-orders
    → axios GET /api/admin/recent-users
    → Server returns data
    → Client renders:
      - Revenue charts (Chart.js)
      - User statistics
      - Order management
      - Product management
```

---

## 🎯 FEATURES IMPLEMENTATION

### ✅ Đã implement

1. **Authentication & Authorization**
   - JWT-based auth
   - Role-based access control (User, Partner, Admin, Manager)
   - Protected routes
   - Password hashing

2. **Product Management**
   - CRUD operations
   - Image upload
   - Advanced filters (brand, price, specs)
   - Search functionality
   - Categories

3. **Shopping Cart**
   - Add/remove items
   - Update quantities
   - Persistent cart (database)
   - Cart popup

4. **Orders**
   - Order creation
   - Order tracking
   - Status updates
   - Order history

5. **Reviews & Ratings**
   - Star ratings
   - Review comments
   - Image uploads
   - Helpful votes

6. **Real-time Chat**
   - Socket.io integration
   - User-to-Admin chat
   - User-to-Partner chat
   - Conversation history

7. **Notifications**
   - Real-time notifications
   - Order updates
   - Price alerts
   - Promotional notifications

8. **Admin Dashboard**
   - Sales analytics
   - User management
   - Order management
   - Product management
   - Charts & statistics

9. **Partner Portal**
   - Product management
   - Order tracking
   - Sales statistics

10. **Advanced Features**
    - Product comparison
    - Price alerts
    - Voucher system
    - Warranty tracking
    - Support tickets
    - Email notifications
    - Scheduled tasks (cron jobs)

---

## 🗂️ DEPENDENCIES SUMMARY

### Client Dependencies (19 packages)
- **react**: UI library
- **react-router-dom**: Routing
- **axios**: HTTP client
- **socket.io-client**: Real-time
- **framer-motion**: Animations
- **chart.js**: Charts
- **rc-slider**: Sliders
- **jwt-decode**: JWT parsing
- **react-icons**: Icons

### Server Dependencies (11 packages)
- **express**: Web framework
- **mongoose**: MongoDB ODM
- **jsonwebtoken**: JWT
- **bcryptjs**: Hashing
- **socket.io**: Real-time
- **multer**: File upload
- **nodemailer**: Emails
- **node-cron**: Scheduling
- **cors**: CORS
- **dotenv**: Env vars

---

## 📈 STATISTICS

### Code Statistics (Estimate)

**Client:**
- Components: ~80 files
- Pages: ~30 files
- Total LOC: ~15,000 lines

**Server:**
- Models: 15 files
- Controllers: 18 files
- Routes: 20 files
- Total LOC: ~8,000 lines

**Total Project:**
- Manual files: ~500 files
- Auto files: ~50,000 files (node_modules, build)
- Total LOC: ~25,000 lines (excluding dependencies)

---

## 🚀 DEPLOYMENT STRUCTURE

### Development:
```
npm run dev (root)
  → Runs server on localhost:5000
  → Runs client on localhost:3000
  → API calls: http://localhost:5000/api
```

### Production:
```
npm run build (root)
  → Builds client/build/
  → Server serves static files from build/
  → Single port deployment (5000)
```

---

## 📝 NOTES FOR Q&A

### Câu hỏi thường gặp:

**Q: File nào tự động sinh ra?**
A: 
- node_modules/ (tất cả 3 levels)
- package-lock.json (tất cả 3 levels)
- client/build/ (khi npm run build)
- server/uploads/ (khi users upload)
- .git/ (khi git init)

**Q: File nào phải code thủ công?**
A: Tất cả files trong:
- client/src/
- server/ (except node_modules, uploads)
- docs_backup_20251117/
- Root config files (package.json, .gitignore, etc.)

**Q: Làm sao phân biệt MANUAL vs AUTO?**
A:
- MANUAL: Bạn tự viết code, có logic nghiệp vụ
- AUTO: Tool/command sinh ra, không edit trực tiếp

**Q: Database ở đâu?**
A: MongoDB chạy riêng (localhost:27017), không trong project folder. Models define schema, data lưu trong MongoDB.

**Q: Images của products lưu ở đâu?**
A: 
- Development: server/uploads/
- Production: Nên dùng Cloudinary/AWS S3

**Q: Có bao nhiêu roles trong hệ thống?**
A: 4 roles: user, partner, admin, manager

**Q: API documentation ở đâu?**
A: docs_backup_20251117/API_REFERENCE.md + Postman collection

---

## ✅ CHECKLIST FOR Q&A

- [x] Root structure explained
- [x] Client structure detailed
- [x] Server structure detailed
- [x] All models explained
- [x] All controllers explained
- [x] All routes mapped
- [x] Middlewares explained
- [x] Services explained
- [x] Auto vs Manual files clarified
- [x] Dependencies listed
- [x] Features summarized
- [x] Data flow documented
- [x] Statistics provided

---

**File này được tạo tự động để hỗ trợ Q&A về cấu trúc project.**  
**Ngày tạo:** 2025-11-17  
**Version:** 1.0.0  
**Tác giả:** GitHub Copilot
