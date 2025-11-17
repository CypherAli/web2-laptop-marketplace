# 🚀 Laptop Marketplace - Professional Edition v2.0

## 📋 Giới thiệu

**Laptop Marketplace** là hệ thống thương mại điện tử chuyên nghiệp dành cho việc mua bán laptop, được nâng cấp toàn diện với đầy đủ tính năng hiện đại cho **3 loại người dùng**: Khách hàng (Client), Đối tác (Partner), và Quản trị viên (Admin).

### 🎯 Điểm nổi bật
- ✅ **Phân quyền hoàn hảo** - 3 roles với dashboard chuyên nghiệp
- ✅ **Partner Approval System** - Admin duyệt đối tác trước khi bán hàng
- ✅ **UI/UX chuyên nghiệp** - Modern, responsive, animations
- ✅ **Image handling hoàn hảo** - Lazy loading, fallbacks, error handling
- ✅ **Security tăng cường** - JWT, validation, error messages tiếng Việt
- ✅ **50+ API endpoints** - RESTful architecture
- ✅ **Comprehensive documentation** - 3 detailed guides

---

## ✨ Tính năng theo người dùng

### � Cho KHÁCH HÀNG (Client)
- **🏠 Trang chủ nâng cao**:
  - Hero Banner với CTA
  - Best Sellers carousel
  - Advanced Filters (Brand, RAM, Processor, Price)
  - Multi-select filters
  - Sort & Search
  - Product grid với Quick View
  - Compare Bar (sticky bottom)
  
- **📱 Product Detail Page**:
  - Full product specs
  - Image gallery
  - Add to Cart / Buy Now
  - Wishlist button
  - Compare button
  - Reviews section (write, edit, delete)
  - Helpful votes
  - Related products

- **⭐ Review System**:
  - Write reviews với 5-star rating
  - Pros/Cons lists
  - Verified purchase badges
  - Edit/Delete own reviews
  - Mark helpful
  - Seller responses

- **🔄 Product Comparison**:
  - Compare 2-4 products side-by-side
  - Full specs table
  - Price analysis
  - Share comparison link
  - Sticky tracker bar

- **🛒 Shopping Features**:
  - Shopping cart with quantity
  - Wishlist management
  - Order history
  - Order tracking

### 🛠️ Cho ĐỐI TÁC (Partner)
- **📊 Partner Dashboard** (`/dashboard/partner`):
  - Product management (CRUD)
  - View own products
  - Create new products (pending approval)
  - Edit/Delete products
  - Status tracking (pending/approved/rejected)
  - Respond to customer reviews
  - Order management
  - Analytics access

### 🛡️ Cho QUẢN TRỊ VIÊN (Admin)
- **🎛️ Admin Dashboard** (`/dashboard/admin`):
  - **Overview Tab**:
    - Revenue, Orders, Products, Users stats
    - Best Sellers tracking
    - Low Stock alerts
    - Growth metrics
  
  - **Products Tab**:
    - Approve/Reject pending products
    - View all products
    - Delete products
    - Manage inventory
  
  - **Orders Tab**:
    - Update order status
    - Track deliveries
    - Handle cancellations
  
  - **Users Tab**:
    - Change user roles
    - Delete users
    - View user details
  
  - **Reviews Tab**:
    - Approve/Reject reviews
    - Moderate content
    - View ratings

---

## 🛠️ Tech Stack

### Backend
- **Node.js** + **Express.js**: REST API
- **MongoDB** + **Mongoose**: Database with indexes
- **JWT**: Authentication & Authorization
- **bcryptjs**: Password hashing
- **CORS**: Cross-origin resource sharing

### Frontend
- **React 19.2.0**: UI Library
- **React Router v6**: Client-side routing
- **Axios**: HTTP client
- **React Icons**: Icon library
- **Context API**: State management (Auth, Cart, Wishlist)

## 📦 Cài đặt

### Prerequisites
- Node.js >= 14.x
- MongoDB >= 4.x
- npm hoặc yarn

### Clone Repository
```bash
git clone <repository-url>
cd laptop-marketplace
```

### Cài đặt Backend
```bash
cd server
npm install

# Tạo file .env
echo "MONGO_URI=mongodb://localhost:27017/laptop-marketplace" > .env
echo "JWT_SECRET=your-secret-key-here" >> .env
echo "PORT=5000" >> .env

# Start server
npm start
```

### Cài đặt Frontend
```bash
cd client
npm install

# Start development server
npm start
```

## 🗄️ Database Models

### Product Model (Enhanced)
```javascript
{
  name, description, price, originalPrice, stock,
  category, brand, imageUrl, images[],
  specifications: {
    processor, processorGen, ram, ramType,
    storage, storageType, graphics, graphicsMemory,
    display, displaySize, displayResolution, displayRefreshRate,
    weight, battery, operatingSystem, ports[], connectivity[],
    keyboard, webcam, audio, dimensions, color[]
  },
  features[], highlights[],
  warranty: { duration, type, details },
  returnPolicy: { returnable, returnWindow, details },
  shipping: { isFreeShipping, estimatedDays, shippingCost },
  rating: {
    average, count,
    breakdown: { 5, 4, 3, 2, 1 }
  },
  soldCount, viewCount, wishlistCount,
  metaTitle, metaDescription, slug, tags[],
  isFeatured, isDeal, dealEndDate
}
```

### Review Model (New)
```javascript
{
  product, user, order,
  rating, title, comment, images[],
  isVerifiedPurchase,
  helpfulCount, helpfulBy[],
  pros[], cons[],
  isApproved, moderatedBy, moderatedAt,
  sellerResponse: { comment, respondedBy, respondedAt }
}
```

### Order Model (Enhanced)
```javascript
{
  orderNumber,
  user, items[],
  subtotal, shippingFee, tax, discount, totalAmount,
  status, statusHistory[],
  paymentMethod, paymentStatus, paymentDate, transactionId,
  shippingAddress, billingAddress,
  tracking: {
    carrier, trackingNumber, trackingUrl,
    estimatedDelivery, shippedDate, deliveredDate
  },
  couponCode, couponDiscount,
  customerNotes, internalNotes,
  cancellation, returnRequest
}
```

### Comparison Model (New)
```javascript
{
  user, sessionId,
  products[], // Max 4 products
  isPublic, slug, viewCount
}
```

## 🔌 API Endpoints

### Products API
```
GET    /api/products              - Get all products (with filters)
GET    /api/products/:id          - Get product by ID
POST   /api/products              - Create product (Partner/Admin)
PUT    /api/products/:id          - Update product (Owner/Admin)
DELETE /api/products/:id          - Delete product (Owner/Admin)
GET    /api/products/brands       - Get all brands
```

### Reviews API (New)
```
GET    /api/reviews/product/:productId  - Get product reviews
POST   /api/reviews/product/:productId  - Create review (Auth)
PUT    /api/reviews/:reviewId           - Update review (Owner)
DELETE /api/reviews/:reviewId           - Delete review (Owner/Admin)
POST   /api/reviews/:reviewId/helpful   - Mark helpful (Auth)
GET    /api/reviews/my-reviews          - Get user's reviews (Auth)
POST   /api/reviews/:reviewId/response  - Add seller response (Partner/Admin)
PUT    /api/reviews/:reviewId/moderate  - Moderate review (Admin)
```

### Comparison API (New)
```
POST   /api/comparisons/compare         - Compare products (instant)
POST   /api/comparisons/save            - Save comparison (Auth optional)
GET    /api/comparisons/:comparisonId   - Get comparison by ID
GET    /api/comparisons/slug/:slug      - Get public comparison
GET    /api/comparisons/my/saved        - Get user's saved comparisons (Auth)
DELETE /api/comparisons/:comparisonId   - Delete comparison (Owner/Admin)
```

### Analytics API (New)
```
GET    /api/analytics/dashboard         - Dashboard overview (Admin/Partner)
GET    /api/analytics/revenue           - Revenue time series
GET    /api/analytics/best-sellers      - Best selling products
GET    /api/analytics/low-stock         - Low stock alerts
GET    /api/analytics/sales-by-category - Sales by category
GET    /api/analytics/sales-by-brand    - Sales by brand
GET    /api/analytics/customers         - Customer analytics
GET    /api/analytics/fulfillment       - Order fulfillment metrics
```

### Orders API
```
GET    /api/orders                - Get user's orders (Auth)
POST   /api/orders                - Create order (Auth)
GET    /api/orders/:id            - Get order details (Auth)
PUT    /api/orders/:id/status     - Update order status (Partner/Admin)
```

### Auth API
```
POST   /api/auth/register         - Register new user
POST   /api/auth/login            - Login
GET    /api/auth/me               - Get current user (Auth)
```

## 🎨 Frontend Components

### New Components
- **RatingStars**: Reusable star rating component
- **ReviewCard**: Individual review display
- **ReviewList**: Paginated review list with filters
- **ReviewForm**: Create/edit review form
- **ProductComparison**: Side-by-side comparison table
- **ComparisonButton**: Add to compare button
- **AnalyticsDashboard**: Charts and metrics

### Enhanced Components
- **ProductCard**: With ratings, wishlist, quick view
- **ProductDetailPage**: With reviews, comparison, specs
- **HomePage**: Advanced filters, best sellers
- **Header**: Search, cart badge, wishlist count
- **ManagerDashboard**: With analytics

## 🚀 Deployment

### Backend (Node.js)
1. Set environment variables
2. Build: `npm install --production`
3. Start: `npm start`
4. Recommended: PM2, Docker

### Frontend (React)
1. Build: `npm run build`
2. Serve static files from `build/` folder
3. Deploy to: Vercel, Netlify, or any static host

### Database
- MongoDB Atlas (Cloud)
- Or self-hosted MongoDB

## 📊 Performance Optimizations

- **Database Indexes**: Optimized queries
- **Lazy Loading**: React.lazy for code splitting
- **Image Optimization**: Lazy load images
- **Caching**: Browser caching headers
- **Compression**: Gzip/Brotli
- **CDN**: Static assets delivery

## 🔐 Security Features

- JWT authentication
- Password hashing (bcrypt)
- Role-based access control
- Input validation
- XSS protection
- CORS configuration
- Rate limiting (recommended)

## 📝 License

MIT License

## 👥 Contributing

1. Fork repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## 📧 Support

For issues and questions, please open an issue on GitHub.

---

## 🎯 Roadmap

### Phase 1 (Completed) ✅
- Reviews & Ratings system
- Product comparison
- Advanced analytics
- Enhanced product model
- Order tracking

### Phase 2 (Upcoming) 🚧
- Payment gateway integration (VNPay, Momo, Stripe)
- Email notifications
- Live chat support
- Coupon system
- Wishlist sharing

### Phase 3 (Future) 🔮
- Mobile app (React Native)
- AI product recommendations
- Voice search
- AR product preview
- Social login (Google, Facebook)

---

**Built with ❤️ by Laptop Marketplace Team**

# 💻 Laptop Marketplace - Multi-Vendor E-Commerce Platform

A complete MERN stack application for multi-vendor laptop marketplace with role-based authorization, revenue analytics, and advanced product management.

## ✨ Highlights

- 🏪 **Multi-Vendor System**: Partners manage their own products with ownership validation
- 👥 **Role-based Access**: Client, Partner, Admin với quyền riêng biệt
- 📊 **Revenue Analytics**: Dashboard cho Partner (by brand, by month) và Admin (by shop)
- 🔍 **Advanced Filters**: Search, brand, price range, stock status
- 🛡️ **Security**: JWT authentication, middleware protection, isOwner validation
- 📮 **API Documentation**: Full Postman collection với 40+ requests
- 🗄️ **MongoDB Ready**: Compass queries, indexes, aggregations

## 🚀 Quick Start

```powershell
# 1. Setup database (MongoDB phải đang chạy)
.\setup.ps1

# 2. Start backend
cd server
node server.js

# 3. Start frontend (terminal mới)
cd client
npm start

# 4. Import Postman Collection
Laptop_Marketplace_API.postman_collection.json
```

## 🔑 Test Accounts

| Role | Email | Password | Permissions |
|------|-------|----------|-------------|
| 👤 Client | client@laptop.com | client123 | Xem & mua sản phẩm |
| 🏪 Partner 1 | partner1@laptop.com | partner123 | CRUD products, xem revenue |
| 🏪 Partner 2 | partner2@laptop.com | partner123 | CRUD products, xem revenue |
| 👑 Admin | admin@laptop.com | admin123 | Toàn quyền hệ thống |

## 📦 Tech Stack

**Backend:**
- Node.js + Express 5
- MongoDB + Mongoose 8
- JWT Authentication
- bcryptjs for password hashing

**Frontend:**
- React 19
- React Router 7
- Context API (Auth, Cart)
- Axios for API calls

**Tools:**
- ✅ Postman Collection (ready to use)
- ✅ MongoDB Compass (queries included)
- 🔄 Docker (optional, future)

## 📊 Features

### ✅ Completed (Backend 100%)

#### Multi-Vendor Ownership
```javascript
// Partner chỉ edit được sản phẩm của mình
router.put('/products/:id', 
    auth, 
    authorize('partner', 'admin'), 
    isOwner,  // ⭐ Kiểm tra ownership
    updateProduct
);
```

#### Partner Dashboard APIs
- `GET /api/partner/my-products` - Sản phẩm của mình (pagination)
- `GET /api/partner/stats` - Tổng doanh thu, sản phẩm, đã bán
- `GET /api/partner/revenue` - Doanh thu theo tháng (6 tháng)
- `GET /api/partner/revenue-by-brand` ⭐ - Doanh thu theo brand (Dell, HP...)
- `PATCH /api/partner/products/:id/toggle-status` - Bật/tắt sản phẩm

#### Admin Dashboard APIs
- `GET /api/admin/users` - Danh sách users (filter, search, pagination)
- `PUT /api/admin/users/:id` - Cập nhật user (role, approve partner)
- `DELETE /api/admin/users/:id` - Xóa user (bảo vệ admin cuối)
- `GET /api/admin/stats` - Thống kê tổng quan hệ thống
- `GET /api/admin/revenue` - Doanh thu hệ thống theo tháng
- `GET /api/admin/revenue-by-shop` ⭐ - So sánh doanh thu các shop
- `GET /api/admin/partners/:id/revenue` ⭐ - Chi tiết analytics 1 partner

#### Product Management
- Advanced filters: brand, price range, search, stock status
- Ownership validation (partner can only edit own products)
- Admin có thể edit tất cả products

### 🔄 In Progress (Frontend 70%)

- ✅ HomePage với product listing
- ✅ Authentication (Login/Register)
- ✅ Shopping Cart
- ✅ Order Management
- ⏳ Partner Dashboard UI (APIs ready)
- ⏳ Admin Dashboard UI (APIs ready)
- ⏳ Advanced Filters UI (rc-slider installed)

## 📁 Project Structure

```
laptop-marketplace/
├── server/
│   ├── controllers/
│   │   ├── partnerController.js ⭐ Partner dashboard logic
│   │   ├── adminController.js ⭐ Admin dashboard logic
│   │   └── ...
│   ├── middleware/
│   │   ├── isOwner.js ⭐ Ownership validation
│   │   └── ...
│   ├── models/
│   │   ├── User.js (role: client/partner/admin)
│   │   ├── Product.js (createdBy field)
│   │   └── Order.js
│   ├── routes/
│   │   ├── partnerRoute.js ⭐ 5 partner endpoints
│   │   ├── adminRoute.js ⭐ 8 admin endpoints
│   │   └── ...
│   ├── createUsers.js ⭐ Script tạo test users
│   ├── seedProducts.js ⭐ Script seed sample data
│   └── server.js
│
├── client/
│   └── src/
│       ├── pages/
│       ├── components/
│       └── context/
│
├── Laptop_Marketplace_API.postman_collection.json ⭐
├── HUONG_DAN_SU_DUNG.md ⭐ Full documentation
├── TONG_KET_HE_THONG.md ⭐ System summary
└── setup.ps1 ⭐ Quick setup script
```

## 🎯 API Examples

### Login và lấy token
```bash
POST /api/auth/login
{
  "email": "partner1@laptop.com",
  "password": "partner123"
}
# Response: { "token": "eyJhbGc...", "user": {...} }
```

### Xem doanh thu theo brand (Partner)
```bash
GET /api/partner/revenue-by-brand
Authorization: Bearer eyJhbGc...

# Response:
[
  { "brand": "Dell", "revenue": 42990000, "soldCount": 1, "productCount": 1 },
  { "brand": "HP", "revenue": 16990000, "soldCount": 1, "productCount": 1 }
]
```

### So sánh doanh thu các shop (Admin)
```bash
GET /api/admin/revenue-by-shop
Authorization: Bearer eyJhbGc...

# Response:
[
  {
    "partnerName": "Tech Solutions Store",
    "totalRevenue": 59980000,
    "soldCount": 2,
    "orderCount": 2,
    "productStats": { "total": 3, "active": 3 }
  }
]
```

## 🛠️ Useful Commands

### Reset database
```powershell
cd server
node createUsers.js
node seedProducts.js
```

### Check users
```powershell
node -e "require('dotenv').config(); const mongoose = require('mongoose'); const User = require('./models/User'); mongoose.connect(process.env.MONGO_URI).then(async () => { const users = await User.find(); users.forEach(u => console.log(u.email, u.role)); process.exit(0); })"
```

### Check products
```powershell
node -e "require('dotenv').config(); const mongoose = require('mongoose'); const Product = require('./models/Product'); mongoose.connect(process.env.MONGO_URI).then(async () => { const count = await Product.countDocuments(); console.log(`${count} products in DB`); process.exit(0); })"
```

## 📚 Documentation

- **[HUONG_DAN_SU_DUNG.md](./HUONG_DAN_SU_DUNG.md)** - Hướng dẫn chi tiết MongoDB Compass, Postman, test scenarios
- **[TONG_KET_HE_THONG.md](./TONG_KET_HE_THONG.md)** - Tổng kết tính năng, roadmap, debugging tips
- **[SYSTEM_COMPLETION_REPORT.md](./SYSTEM_COMPLETION_REPORT.md)** - Báo cáo hoàn thành dự án
- **[REVENUE_ANALYTICS_API.md](./REVENUE_ANALYTICS_API.md)** - Chi tiết revenue APIs

## 🐛 Troubleshooting

**Lỗi: Cannot connect to MongoDB**
```
Solution: Mở MongoDB Compass, connect to mongodb://localhost:27017
```

**Lỗi: 400 Bad Request khi login**
```
Solution: Chạy node createUsers.js để tạo users
```

**Lỗi: 403 Forbidden khi edit product**
```
Solution: Partner chỉ edit được product của mình. Login với đúng account hoặc dùng admin.
```

## 🎓 Learning Resources

### Key Concepts
- **Ownership Validation**: isOwner middleware kiểm tra createdBy
- **Role-based Authorization**: authorize() middleware với nhiều roles
- **Revenue Aggregation**: MongoDB aggregation pipelines
- **JWT Authentication**: Token-based stateless auth

### Code Highlights
```javascript
// 1. Ownership middleware với admin bypass
if (req.user.role === 'admin') return next();

// 2. Revenue calculation
const revenue = orders.reduce((sum, order) => {
    const partnerItems = order.items.filter(item => 
        item.product.createdBy.equals(partnerId)
    );
    return sum + partnerItems.reduce((s, i) => s + i.price * i.quantity, 0);
}, 0);

// 3. Protected routes
router.put('/products/:id', auth, authorize('partner', 'admin'), isOwner, updateProduct);
```

## 📞 Support

Có vấn đề? Kiểm tra:
1. MongoDB đang chạy
2. Server đang chạy trên port 5000
3. .env file có MONGO_URI và JWT_SECRET
4. Users đã được tạo (chạy createUsers.js)

## 📄 License

MIT License - Free to use for learning and commercial projects.

---

**🎉 Ready to use! Import Postman collection và bắt đầu test!**

## Features

- 🔐 User Authentication (JWT)
- 👥 Role-based Authorization (Client, Manager, Admin)
- 🛍️ Product Management (CRUD)
- 🎨 Responsive UI with React
- 🔒 Secure API with Express & MongoDB

## Tech Stack

### Frontend
- React 19
- React Router v7
- Axios
- JWT Decode

### Backend
- Node.js & Express v5
- MongoDB & Mongoose
- JWT Authentication
- bcryptjs

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd laptop-marketplace
```

2. **Setup Server**
```bash
cd server
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
npm start
```

3. **Setup Client**
```bash
cd client
npm install
cp .env.example .env
# Edit .env if needed (default: http://localhost:5000/api)
npm start
```

### Environment Variables

#### Server (.env)
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/laptop-db
JWT_SECRET=your-secret-key-here-change-in-production
```

#### Client (.env)
```
REACT_APP_API_URL=http://localhost:5000/api
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Products
- `GET /api/products` - Get all products (Public)
- `GET /api/products/:id` - Get single product (Public)
- `POST /api/products` - Create product (Manager/Admin only)
- `PUT /api/products/:id` - Update product (Manager/Admin only)
- `DELETE /api/products/:id` - Delete product (Manager/Admin only)

## User Roles

- **Client**: Can view products
- **Manager**: Can manage products (CRUD)
- **Admin**: Full access to all features

## Project Structure

```
laptop-marketplace/
├── client/                 # React frontend
│   ├── public/
│   └── src/
│       ├── api/           # Axios configuration
│       ├── components/    # Reusable components
│       ├── context/       # React Context (Auth)
│       └── pages/         # Page components
├── server/                # Express backend
│   ├── config/           # Database configuration
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Auth & authorization
│   ├── models/           # MongoDB schemas
│   └── routes/           # API routes
```

## 🚀 Quick Start

### Option 1: Auto Setup (Recommended)
```powershell
# Run the setup script
QUICK_SETUP.bat

# Then open 2 terminals:

# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
cd client
npm start
```

### Option 2: Manual Setup
```powershell
# 1. Install dependencies
cd server && npm install
cd ../client && npm install

# 2. Create .env in server/
MONGO_URI=mongodb://localhost:27017/laptop-marketplace
JWT_SECRET=your_secret_key_here
PORT=5000

# 3. Create admin account
cd server
node createAdminUser.js

# 4. Start MongoDB
mongod

# 5. Start services
cd server && npm run dev     # Terminal 1
cd client && npm start        # Terminal 2
```

### Default Admin Account
```
Email: admin@laptop.com
Password: admin123
```

---

## 📚 Documentation

### Essential Guides
1. **SYSTEM_ROLES_GUIDE.md** - Phân quyền & vai trò chi tiết
2. **UI_UX_IMPROVEMENTS.md** - Design system & patterns
3. **COMPREHENSIVE_TEST_GUIDE.md** - Hướng dẫn test toàn diện
4. **SYSTEM_COMPLETION_FINAL_REPORT.md** - Báo cáo hoàn thiện

### Key Features
- ✅ Partner approval system
- ✅ Multi-tab admin dashboard
- ✅ Revenue analytics per partner
- ✅ Perfect image handling
- ✅ User-friendly error messages
- ✅ Responsive design
- ✅ Security enhanced

---

## 🎯 Typical Workflows

### Partner Onboarding
```
1. Partner registers → isApproved = false
2. Partner tries login → Blocked with message
3. Admin logs in → Approves partner
4. Partner logs in → Success!
5. Partner adds products → Visible in dashboard
```

### Admin Management
```
1. Admin logs in
2. View system stats
3. Approve pending partners
4. Manage all products
5. Monitor orders
6. Moderate reviews
```

---

## 🧪 Testing

Run comprehensive tests:
```powershell
# Follow the test guide
See: COMPREHENSIVE_TEST_GUIDE.md

# 58 test scenarios covered:
- Authentication (7)
- Admin features (11)
- Partner features (7)
- Client features (10)
- Security (8)
- Images (4)
- Responsive (3)
- Errors (8)
```

---

## 🔧 Tech Stack

### Frontend
- React 18
- React Router v6
- Axios
- Context API
- CSS3 with animations

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT authentication
- bcrypt for passwords

### Tools
- VS Code
- MongoDB Compass
- Postman
- Git

---

## 📊 API Endpoints

### Authentication
```
POST   /api/auth/register     - Register user
POST   /api/auth/login        - Login user
```

### Products
```
GET    /api/products          - Get all products
GET    /api/products/:id      - Get product detail
POST   /api/products          - Create product (Partner/Admin)
PUT    /api/products/:id      - Update product (Owner/Admin)
DELETE /api/products/:id      - Delete product (Owner/Admin)
```

### Admin
```
GET    /api/admin/stats       - System statistics
GET    /api/admin/users       - All users
PUT    /api/admin/users/:id   - Update user (role, approval)
DELETE /api/admin/users/:id   - Delete user
GET    /api/admin/revenue-by-shop - Revenue per partner
```

### Partner
```
GET    /api/partner/my-products  - Partner's products
GET    /api/partner/stats        - Partner statistics
GET    /api/partner/revenue      - Partner revenue
PATCH  /api/partner/products/:id/toggle-status - Toggle product
```

**Full API documentation: See API_REFERENCE.md**

---

## 🎨 UI/UX Highlights

- **Modern Design System** - Consistent colors, typography, spacing
- **Smooth Animations** - Hover effects, transitions, loading states
- **Responsive** - Mobile-first, works on all devices
- **Accessible** - ARIA labels, keyboard navigation
- **User Feedback** - Toast notifications, confirmation dialogs
- **Error Handling** - User-friendly messages in Vietnamese

---

## ⚡ Performance

- **Code Splitting** - Faster initial load
- **Lazy Loading** - Images & components
- **Pagination** - Efficient data loading
- **Indexing** - Optimized database queries
- **Caching** - Reduced API calls

---

## 🔐 Security

- JWT authentication (24h expiry)
- Password hashing (bcrypt)
- Role-based authorization
- Partner approval system
- Input validation (frontend & backend)
- XSS prevention
- CORS configured
- Account status check

---

## 🐛 Known Issues & Limitations

### Current Limitations
- No email verification
- No password reset
- No real-time notifications
- No file upload (URL only)
- No payment gateway
- No shipping integration

### Future Enhancements
- Email verification
- Password reset flow
- Real-time notifications (Socket.io)
- Image upload (Cloudinary)
- Payment integration (Stripe)
- Shipping API
- Chat support
- Advanced analytics

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

## 📞 Support

- **Documentation:** Read guides in root folder
- **Issues:** Report via GitHub Issues
- **Email:** support@laptop-marketplace.com

---

## 📜 License

This project is open source and available under the MIT License.

---

## 🎉 Credits

**Developed by:** Development Team  
**Version:** 2.0 - Professional Edition  
**Last Updated:** November 10, 2025  
**Status:** ✅ PRODUCTION READY

---

**Made with ❤️ for the best laptop shopping experience!**
