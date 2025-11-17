# 📋 YÊU CẦU CHỨC NĂNG - LAPTOP MARKETPLACE

## 🎯 TỔNG QUAN DỰ ÁN

Xây dựng website bán laptop hoàn chỉnh tương tự Shopee với 3 roles: **User (Client)**, **Partner (Nhà bán)**, và **Admin**.

---

## ✅ ĐÃ HOÀN THÀNH (Hiện tại)

### Backend API (100%)
- ✅ Authentication & Authorization (JWT)
- ✅ User Management (3 roles: client, partner, admin)
- ✅ Product CRUD với ownership logic
- ✅ Order Management System
- ✅ Cart functionality
- ✅ Advanced filtering & pagination
- ✅ Partner & Admin analytics APIs
- ✅ Revenue tracking

### Frontend (60%)
- ✅ HomePage với product listing
- ✅ Basic filters (price, stock, sort)
- ✅ Add to Cart
- ✅ Wishlist
- ✅ Login/Register pages (cần cải thiện UI)
- ✅ Manager Dashboard (CRUD products)
- ✅ Cart Page
- ✅ Orders Page
- ✅ 22 sản phẩm laptop với hình ảnh thật

---

## 🚀 YÊU CẦU CẦN THỰC HIỆN

### 1️⃣ TRANG CHỦ - PUBLIC ACCESS (KHÔNG CẦN LOGIN)

**Yêu cầu:**
> "Khi chạy web vào thẳng trang chính, không cần đăng nhập cũng có thể tìm và xem được sản phẩm"

**Hiện trạng:** ✅ ĐÃ HOẠT ĐỘNG
- Trang chủ đã public
- Có thể xem products không cần login
- Filter & search hoạt động

**Cần cải thiện:**
- [ ] Thêm Search Bar nổi bật ở Header
- [ ] Price Range Slider (thay vì input maxPrice)
- [ ] Brand Filter với Checkboxes
- [ ] Category tabs (Business, Gaming, Ultrabook, Workstation)
- [ ] Banner/Carousel với deals hot
- [ ] "Trending Products" section
- [ ] Product detail page (click vào product)

---

### 2️⃣ ĐĂNG NHẬP & ĐĂNG KÝ - UI/UX CHUYÊN NGHIỆP

**Yêu cầu:**
> "Sửa lại frontend đăng nhập đăng ký sao cho đẹp và hoạt động trơn tru"

**Cần làm:**

#### Login Page
- [ ] Form centered, card design đẹp
- [ ] Icons cho email & password fields
- [ ] Show/hide password button (👁)
- [ ] Remember me checkbox
- [ ] Forgot password link
- [ ] Loading spinner khi submit
- [ ] Error messages rõ ràng (email/password sai)
- [ ] Success animation khi login thành công
- [ ] "Login with Google" button (future)

#### Register Page
- [ ] Multi-step form (Step 1: Info, Step 2: Role selection)
- [ ] Real-time validation
- [ ] Password strength indicator
- [ ] Confirm password matching
- [ ] Email format validation
- [ ] Phone number validation
- [ ] Terms & Conditions checkbox
- [ ] Role selection (Client / Partner)
  - Client: Mua hàng
  - Partner: Bán hàng (cần chờ admin approve)

#### General Improvements
- [ ] Smooth transitions & animations
- [ ] Mobile responsive
- [ ] Social login buttons
- [ ] Background gradient/image đẹp
- [ ] Logo và branding nhất quán

**Thời gian ước tính:** 4-6 giờ

---

### 3️⃣ USER (CLIENT) - CHỨC NĂNG MUA HÀNG

**Yêu cầu:**
> "Trang của user có thể thêm vào giỏ hàng, quan sát đồ yêu thích, xem và check được đồ đã đặt, chức năng đặt và hủy, kiểm tra giống Shopee"

#### 3.1. Shopping Features

**Cart Page** (Đã có - cần cải thiện)
- [x] Hiển thị items trong cart
- [x] Update quantity (+/-)
- [x] Remove items
- [x] Calculate total
- [ ] Apply coupon/voucher codes
- [ ] Estimate shipping cost
- [ ] Select shipping method
- [ ] Save cart to localStorage (persist)

**Checkout Flow**
- [ ] Step 1: Review cart
- [ ] Step 2: Shipping address form
  - Full name
  - Phone number
  - Address (street, city, district)
  - Note for seller
- [ ] Step 3: Payment method
  - COD (Cash on Delivery)
  - Bank Transfer (show QR code)
  - Credit Card (future: Stripe/PayPal)
- [ ] Step 4: Order confirmation
  - Show order summary
  - Order ID
  - Estimated delivery
- [ ] Email confirmation (future)

#### 3.2. Wishlist/Favorites

**Current:** Có WishlistContext nhưng chưa hoàn chỉnh

**Cần làm:**
- [ ] Heart icon trên product card
- [ ] Save/Remove từ wishlist
- [ ] Wishlist page (`/wishlist`)
  - Grid display như HomePage
  - Quick add to cart từ wishlist
  - Remove button
  - Share wishlist (future)
- [ ] Persist wishlist trong database (không chỉ localStorage)
- [ ] Badge count trên Wishlist icon (header)

#### 3.3. Order Management

**My Orders Page** (`/orders`) - Đã có cơ bản

**Cần cải thiện:**
- [ ] Order list với status badges:
  - 🟡 Pending (Chờ xử lý)
  - 🔵 Processing (Đang chuẩn bị)
  - 📦 Shipped (Đang giao)
  - ✅ Delivered (Đã giao)
  - ❌ Cancelled (Đã hủy)
- [ ] Order detail modal/page:
  - Product items
  - Shipping address
  - Payment method
  - Order timeline (tracking)
  - Download invoice (PDF)
- [ ] Filter orders by status
- [ ] Search orders
- [ ] **Cancel order** (chỉ khi status = Pending)
- [ ] **Confirm delivery** (khi status = Shipped)
- [ ] **Return/Refund request** (future)
- [ ] **Rate & Review** product (sau khi delivered)

#### 3.4. User Profile

**New page:** `/profile`

- [ ] View & edit profile info
  - Avatar upload
  - Name, email, phone
  - Default shipping address
  - Change password
- [ ] Order statistics:
  - Total orders
  - Total spent
  - Loyalty points (future)
- [ ] Addresses management (multiple addresses)

#### 3.5. Product Detail Page

**New page:** `/products/:id`

- [ ] Large product image gallery
- [ ] Product specifications table
- [ ] Price & stock info
- [ ] Add to cart với quantity selector
- [ ] Add to wishlist
- [ ] Share buttons (Facebook, Twitter)
- [ ] Seller info (partner name, rating)
- [ ] Related products
- [ ] Reviews & Ratings section

**Thời gian ước tính:** 12-15 giờ

---

### 4️⃣ PARTNER - CHỨC NĂNG BÁN HÀNG & QUẢN LÝ

**Yêu cầu:**
> "Partner có thể đăng mẫu lap mới nhưng phải qua admin kiểm duyệt. Partner check được doanh thu, xem sản phẩm bán được và từ lúc nào."

#### 4.1. Product Management (CRUD)

**Current:** Có ManagerDashboard cơ bản

**Cần cải thiện:**

**My Products Page** (`/partner/products`)
- [x] List products của partner
- [x] Create new product form
- [x] Edit product
- [x] Delete product
- [ ] **Product Status:**
  - 🟡 Pending (Chờ admin duyệt) - MỚI THÊM
  - ✅ Approved (Đã duyệt - hiển thị công khai)
  - ❌ Rejected (Bị từ chối - show reason)
  - 🔒 Inactive (Partner tắt tạm thời)
- [ ] **Approval Workflow:**
  - Khi tạo product → status = "pending"
  - Chỉ hiển thị trên partner dashboard
  - Admin approve → status = "approved" → hiển thị công khai
  - Admin reject → status = "rejected" + rejection reason
- [ ] Toggle Active/Inactive (cho approved products)
- [ ] Bulk actions (activate/deactivate nhiều products)
- [ ] Filter by status
- [ ] Search trong products của mình

**Product Form Improvements:**
- [ ] Image upload (thay vì URL)
- [ ] Multiple images (gallery)
- [ ] Rich text editor cho description
- [ ] Specifications fields:
  - Processor (dropdown: Intel i3/i5/i7, AMD Ryzen 5/7)
  - RAM (dropdown: 4GB/8GB/16GB/32GB)
  - Storage (dropdown: 256GB/512GB/1TB SSD)
  - Graphics (dropdown: Integrated/GTX/RTX)
  - Display (input: 13.3"/14"/15.6"/17")
  - Weight (input kg)
- [ ] Category selection (Business/Gaming/Ultrabook)
- [ ] Tags (keywords cho SEO)

#### 4.2. Revenue Analytics Dashboard

**New page:** `/partner/dashboard`

**Stats Cards:**
- [ ] 💰 Total Revenue (tất cả thời gian)
- [ ] 📦 Total Products (active/inactive)
- [ ] 🛒 Total Orders (completed)
- [ ] 📊 This Month Revenue
- [ ] ⭐ Average Rating (future)

**Charts & Graphs:**
- [ ] Revenue by Month (6-12 tháng) - Bar chart
  - API: `/api/partner/revenue` ✅ (đã có)
- [ ] Revenue by Product - Pie chart
  - Top 5 products bán chạy nhất
- [ ] Orders over Time - Line chart
  - Track số đơn hàng theo ngày

**Tables:**
- [ ] **Best Selling Products**
  - Product name
  - Units sold
  - Revenue
  - Last sold date
  - API: `/api/partner/stats` ✅ (đã có bestSellers)
- [ ] **Recent Orders**
  - Order ID, Customer, Date, Amount, Status
  - Link to order details
- [ ] **Low Stock Alert**
  - Products có stock < 5
  - Restock reminder

**Filters:**
- [ ] Date range picker (This week/month/year, Custom)
- [ ] Export reports (CSV/PDF)

#### 4.3. Order Management (Partner View)

**New page:** `/partner/orders`

- [ ] List orders của products partner bán
- [ ] Update order status:
  - Pending → Processing (confirm order)
  - Processing → Shipped (add tracking number)
  - Cannot change Delivered/Cancelled
- [ ] Print shipping label
- [ ] Contact customer (chat)

#### 4.4. Partner Profile & Settings

**New page:** `/partner/settings`

- [ ] Shop Information:
  - Shop name
  - Shop logo
  - Shop banner
  - Shop description
  - Business license number (verification)
- [ ] Bank account (for payment)
- [ ] Notification settings
- [ ] View approval status (Pending/Approved)

#### 4.5. Chat với Admin

**New feature:**
- [ ] Chat button to contact Admin
- [ ] Ask questions về approval process
- [ ] Report issues
- [ ] Request features

**Thời gian ước tính:** 15-18 giờ

---

### 5️⃣ ADMIN - QUẢN TRỊ HỆ THỐNG

**Yêu cầu:**
> "Admin xem doanh thu từng hãng và tổng, kiểm duyệt partner, thêm sản phẩm, chat với user/partner"

#### 5.1. Dashboard Overview

**Page:** `/admin/dashboard`

**Stats Cards (System-wide):**
- [ ] 👥 Total Users (clients/partners/admins)
- [ ] 🏪 Total Shops (partners approved/pending)
- [ ] 📦 Total Products (active/pending approval)
- [ ] 💰 Total Revenue (all time)
- [ ] 🛒 Total Orders (by status)
- [ ] 📈 This Month Growth (%)

**Charts:**
- [ ] Revenue by Month (system-wide) - API: ✅ `/api/admin/revenue`
- [ ] Revenue by Shop (comparison) - API: ✅ `/api/admin/revenue-by-shop`
  - Bar chart: Partner names vs Revenue
  - Show top 10 partners
- [ ] New Users/Partners per Month
- [ ] Order Status Distribution (Pie chart)

**Tables:**
- [ ] Recent Activities:
  - New user registrations
  - New partner applications
  - Products pending approval
  - Recent orders
- [ ] Top Performing Shops:
  - Rank, Shop Name, Products, Revenue, Rating

#### 5.2. Partner Approval System

**Page:** `/admin/partners`

**Features:**
- [ ] List all partners with status:
  - 🟡 Pending (chờ duyệt)
  - ✅ Approved (đã duyệt)
  - ❌ Rejected (từ chối)
  - 🔒 Suspended (tạm khóa)
- [ ] **Approval Workflow:**
  - View partner application details:
    - Business info
    - Contact info
    - Business license (if provided)
  - Approve button → change `isApproved: true`
  - Reject button → show rejection reason modal
  - Email notification (future)
- [ ] Search & filter partners
- [ ] View partner's products & revenue
- [ ] Suspend/Unsuspend partner accounts
- [ ] Ban partners (severe violations)

**API:** ✅ Đã có
- GET `/api/admin/users?role=partner`
- PUT `/api/admin/users/:id` (update isApproved)

#### 5.3. Product Management (Admin)

**Page:** `/admin/products`

**Pending Approval Tab:**
- [ ] List products with status = "pending"
- [ ] **Approve Product:**
  - Review product info
  - Check image quality
  - Verify specifications
  - Approve → status = "approved"
- [ ] **Reject Product:**
  - Show reason modal (image quality, wrong info, etc.)
  - Reject → status = "rejected" + reason
  - Notify partner

**All Products Tab:**
- [ ] View all products (all partners)
- [ ] Search & filter
- [ ] Edit any product (admin privilege)
- [ ] Delete products (spam/violation)
- [ ] Bulk approve/reject

**Add New Product (Admin):**
- [ ] Admin có thể tự thêm products
- [ ] Auto-approved (không cần kiểm duyệt)
- [ ] Assign to specific partner hoặc "Admin Shop"

#### 5.4. User Management

**Page:** `/admin/users`

**Features:**
- [ ] List all users (clients/partners/admins)
- [ ] Search by name/email
- [ ] Filter by role
- [ ] View user details:
  - Registration date
  - Order history
  - Total spent
  - Active/Inactive status
- [ ] Change user roles (promote client → partner)
- [ ] Suspend/Ban users
- [ ] Delete users (GDPR compliance)
- [ ] Reset password (email link)

**API:** ✅ Đã có
- GET `/api/admin/users`
- GET `/api/admin/users/:id`
- PUT `/api/admin/users/:id`
- DELETE `/api/admin/users/:id`

#### 5.5. Order Management (Admin)

**Page:** `/admin/orders`

**Features:**
- [ ] View ALL orders (system-wide)
- [ ] Filter by status/date/partner/customer
- [ ] Search by order ID
- [ ] Override order status (emergency)
- [ ] Handle disputes/refunds
- [ ] Cancel orders
- [ ] Download order reports (CSV/Excel)

#### 5.6. Revenue Analytics

**Page:** `/admin/revenue`

**Detailed Reports:**
- [ ] **Revenue by Shop:**
  - Table: Partner Name, Total Revenue, Orders, Avg Order Value
  - Sort by revenue
  - Date range filter
  - API: ✅ `/api/admin/revenue-by-shop`
- [ ] **Revenue by Product Category:**
  - Gaming laptops vs Business laptops
- [ ] **Revenue by Month:**
  - Compare year-over-year
  - API: ✅ `/api/admin/revenue`
- [ ] **Profit Margin** (if commission system)
- [ ] Export reports (PDF/Excel)

#### 5.7. Chat System (Admin)

**Page:** `/admin/chat`

**Features:**
- [ ] Inbox với messages từ users & partners
- [ ] Real-time chat (Socket.io)
- [ ] Message notifications
- [ ] Message history
- [ ] Broadcast messages (to all users/partners)
- [ ] Canned responses (FAQ)
- [ ] Assign chats to multiple admins
- [ ] Mark as resolved

#### 5.8. System Settings

**Page:** `/admin/settings`

**Features:**
- [ ] Site settings (name, logo, tagline)
- [ ] Payment methods (enable/disable)
- [ ] Shipping methods & costs
- [ ] Tax configuration
- [ ] Email templates
- [ ] Commission rates (platform fee)
- [ ] Banner management (homepage)
- [ ] SEO settings

**Thời gian ước tính:** 18-20 giờ

---

## 🔄 CHAT SYSTEM - REAL-TIME

**Yêu cầu:**
> "Cả partner và user đều có thể chat với admin"

### Architecture

**Tech Stack:**
- Backend: Socket.io (WebSocket)
- Frontend: socket.io-client
- Database: MongoDB (Message model)

### Features

#### User → Admin Chat
- [ ] Chat icon/button trên header (user side)
- [ ] Click mở chat widget (bottom-right)
- [ ] Send messages to admin
- [ ] See online/offline status
- [ ] Message history
- [ ] Typing indicators
- [ ] File attachments (images)

#### Partner → Admin Chat
- [ ] Chat tab trong partner dashboard
- [ ] Similar features như user chat
- [ ] Priority support badge (if premium)

#### Admin Chat Console
- [ ] List active conversations
- [ ] Notification sounds
- [ ] Quick reply templates
- [ ] Multi-admin support (assign chats)
- [ ] Chat analytics (response time, etc.)

### Database Schema

```javascript
// Message Model
{
  conversationId: ObjectId,
  sender: ObjectId (User/Admin),
  senderRole: String (client/partner/admin),
  recipient: ObjectId (Admin/User),
  message: String,
  attachments: [String],
  isRead: Boolean,
  createdAt: Date
}

// Conversation Model
{
  participants: [ObjectId],
  lastMessage: String,
  lastMessageAt: Date,
  status: String (open/closed)
}
```

**Thời gian ước tính:** 10-12 giờ

---

## 📊 TỔNG HỢP THỜI GIAN

| Feature | Thời gian | Độ ưu tiên |
|---------|-----------|------------|
| ✅ Fix hiển thị products | DONE | ⭐⭐⭐ |
| UI Login/Register | 4-6h | ⭐⭐⭐ |
| User Features | 12-15h | ⭐⭐⭐ |
| Partner Dashboard | 15-18h | ⭐⭐⭐ |
| Admin Dashboard | 18-20h | ⭐⭐⭐ |
| Chat System | 10-12h | ⭐⭐ |
| Advanced Search & Filters | 4-6h | ⭐⭐ |
| Testing & Polish | 8-10h | ⭐⭐⭐ |

**TỔNG CỘNG: ~80-100 giờ làm việc**

---

## 🎯 ROADMAP - ƯU TIÊN THỰC HIỆN

### PHASE 1: Foundation (Tuần 1)
1. ✅ Fix products hiển thị trên homepage
2. Cải thiện UI Login/Register
3. Product Detail Page
4. Enhanced Filters & Search

### PHASE 2: User Experience (Tuần 2)
1. Wishlist functionality
2. Checkout flow hoàn chỉnh
3. Order management (cancel/track)
4. User profile page

### PHASE 3: Partner Features (Tuần 3)
1. Product Approval Workflow
2. Revenue analytics charts
3. Sales reports & best sellers
4. Partner settings page

### PHASE 4: Admin Control (Tuần 4)
1. Admin Dashboard overview
2. Partner approval system
3. Product moderation
4. User management
5. Revenue analytics

### PHASE 5: Advanced Features (Tuần 5)
1. Real-time Chat System
2. Email notifications
3. Reviews & Ratings
4. Coupon/Voucher system

### PHASE 6: Polish & Deploy (Tuần 6)
1. Testing (Unit + Integration)
2. Performance optimization
3. SEO improvements
4. Mobile responsive fixes
5. Deployment (Vercel/Render)
6. Documentation & Demo video

---

## 🛠️ TECH STACK

### Current
- Frontend: React, React Router, Context API, Axios
- Backend: Node.js, Express, MongoDB, JWT
- Styling: Pure CSS

### Need to Add
- Socket.io (real-time chat)
- Chart.js / Recharts (analytics charts)
- React Hook Form (form validation)
- Cloudinary (image upload)
- Nodemailer (emails)
- React Toastify (notifications)

---

## 💡 NEXT IMMEDIATE STEPS

### Bạn muốn bắt đầu với task nào?

**Option A: Cải thiện Login/Register UI** ⭐⭐⭐
- Dễ, ảnh hưởng lớn đến UX
- Thời gian: 4-6 giờ
- User thấy ngay sự khác biệt

**Option B: Product Detail Page** ⭐⭐⭐
- Cần thiết cho shopping experience
- Thời gian: 3-4 giờ
- Tăng conversion rate

**Option C: Partner Approval Workflow** ⭐⭐⭐
- Core feature cho multi-vendor
- Thời gian: 4-5 giờ
- Backend + Frontend

**Option D: Admin Dashboard với Charts** ⭐⭐⭐
- Impressive, show analytics
- Thời gian: 6-8 giờ
- Cần install Chart.js

---

## 📝 GHI CHÚ

- Tất cả các API endpoints cần thiết đã có sẵn trong backend
- Chỉ cần focus vào Frontend UI/UX
- Database schema đã support đầy đủ các features
- Code structure sẵn sàng cho scale

**Hãy cho tôi biết bạn muốn bắt đầu với task nào, tôi sẽ hướng dẫn chi tiết từng bước!** 🚀
