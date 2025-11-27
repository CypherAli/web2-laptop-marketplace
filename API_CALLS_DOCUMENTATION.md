# 📡 TÀI LIỆU GỌI API TRONG DỰ ÁN LAPTOP MARKETPLACE

## 🎯 Tổng Quan
Dự án sử dụng **Axios** để gọi API từ Client (React) lên Server (Node.js/Express).

---

## 📂 Cấu Trúc File Gọi API

### 1. **File Cấu Hình Chính**

#### `client/src/api/axiosConfig.js` (FILE QUAN TRỌNG NHẤT)
**Chức năng:** Tạo instance Axios với cấu hình sẵn
- **Base URL:** `https://web2-laptop-marketplace.onrender.com/api`
- **Auto-attach JWT Token:** Tự động đính kèm token từ localStorage vào mỗi request
- **Interceptor xử lý lỗi:** Tự động logout khi token hết hạn (401)

```javascript
// Tự động gắn token vào mọi request
instance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
});

// Xử lý khi token hết hạn
instance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);
```

---

## 🗂️ Phân Loại File Gọi API

### **A. CONTEXT FILES (Quản lý Global State + API Calls)**

#### 1. **`context/AuthContext.js`** - Authentication
**API Calls:**
```javascript
// LOGIN
POST /auth/login
Body: { email, password }
→ Response: { token, user }

// REGISTER
POST /auth/register
Body: { username, email, password, role, shopName }
→ Response: Success message
```

**Sử dụng:**
- Component nào cần đăng nhập/đăng xuất → import `useContext(AuthContext)`
- Các hàm: `login()`, `register()`, `logout()`

---

#### 2. **`context/CartContext.js`** - Giỏ Hàng
**API Calls:**
```javascript
// LẤY GIỎ HÀNG
GET /cart
→ Response: { items: [...] }

// THÊM VÀO GIỎ
POST /cart
Body: { productId, quantity }
→ Response: { items: [...] }

// CẬP NHẬT SỐ LƯỢNG
PUT /cart/:cartItemId
Body: { quantity }
→ Response: { items: [...] }

// XÓA KHỎI GIỎ
DELETE /cart/:cartItemId
→ Response: Success

// XÓA TOÀN BỘ GIỎ
DELETE /cart/clear/all
→ Response: Success
```

**Sử dụng:**
- Component nào cần thêm/xóa giỏ hàng → `useContext(CartContext)`
- Các hàm: `addToCart()`, `removeFromCart()`, `updateQuantity()`, `clearCart()`

---

#### 3. **`context/WishlistContext.js`** - Danh Sách Yêu Thích
**API Calls:**
```javascript
// LẤY WISHLIST
GET /users/wishlist
→ Response: [productId1, productId2, ...]

// THÊM/XÓA WISHLIST
POST /users/wishlist/:productId
→ Response: Updated wishlist
```

---

#### 4. **`context/ChatContext.js`** - Real-time Chat
**API Calls:**
```javascript
// LẤY DANH SÁCH HỘI THOẠI
GET /chat/conversations

// LẤY TIN NHẮN
GET /chat/messages/:conversationId

// GỬI TIN NHẮN
POST /chat/send
Body: { to, message }
```

---

### **B. CUSTOM HOOKS (Reusable Logic)**

#### **`hooks/useProducts.js`** - Quản Lý Sản Phẩm
**API Call:**
```javascript
// LẤY DANH SÁCH SẢN PHẨM (có filters, pagination)
GET /products?page=1&limit=12&brand=Dell&minPrice=1000&maxPrice=50000

→ Response: {
    products: [...],
    totalPages: 10,
    totalProducts: 120
}
```

**Sử dụng:**
- Trang ProductList, HomePage, DealsPage
- Tự động debounce khi thay đổi giá (tránh gọi API quá nhiều)

---

### **C. PAGE COMPONENTS (Gọi API trong useEffect hoặc Event Handlers)**

#### 1. **`pages/product/ProductDetailPage.js`**
**API Calls:**
```javascript
// LẤY CHI TIẾT SẢN PHẨM
GET /products/:id
→ Response: { _id, name, price, imageUrl, specifications, ... }

// LẤY SẢN PHẨM LIÊN QUAN
GET /products?brand=Dell&limit=4
→ Response: { products: [...] }
```

**Flow:**
```
1. User vào /product/123
2. useEffect → fetchProductDetail()
3. axios.get('/products/123')
4. Hiển thị thông tin sản phẩm
5. Fetch related products (cùng brand)
```

---

#### 2. **`pages/admin/AdminDashboard.js`**
**API Calls rất nhiều:**
```javascript
// THỐNG KÊ TỔNG QUAN
GET /admin/stats
→ Response: { revenue, orders, products, users }

// QUẢN LÝ SẢN PHẨM
GET /products?page=1&limit=10
PUT /products/:id (Duyệt sản phẩm)
DELETE /products/:id

// QUẢN LÝ ĐơN HÀNG
GET /orders?page=1&limit=10
PUT /orders/:id/status
Body: { status: 'delivered' }

// QUẢN LÝ USER
GET /admin/users?page=1&limit=10
PUT /admin/users/:id (Thay đổi role)
PUT /admin/users/:id (Duyệt Partner)
DELETE /admin/users/:id

// DOANH THU PARTNER
GET /admin/revenue-by-shop
→ Response: [{ partnerId, username, shopName, revenue, ... }]

// QUẢN LÝ REVIEWS
GET /reviews?page=1&limit=10
PUT /reviews/:id/moderate
Body: { isApproved: true/false }
```

---

#### 3. **`pages/user/profile/ProfilePage.js`**
```javascript
// LẤY THÔNG TIN PROFILE
GET /users/profile

// CẬP NHẬT PROFILE
PUT /users/profile
Body: { username, email, phone, address, ... }

// THAY ĐỔI MẬT KHẨU
PUT /users/change-password
Body: { oldPassword, newPassword }
```

---

#### 4. **`pages/user/orders/OrdersPage.js`**
```javascript
// LẤY DANH SÁCH ĐƠN HÀNG CỦA USER
GET /orders
→ Response: { orders: [...], totalPages }

// CHI TIẾT ĐƠN HÀNG
GET /orders/:id
→ Response: { _id, items, totalAmount, status, ... }
```

---

#### 5. **`pages/user/cart/checkout/CheckoutPage.js`**
```javascript
// TẠO ĐƠN HÀNG
POST /orders
Body: {
    items: [{ product, quantity, price }],
    shippingAddress: { ... },
    paymentMethod: 'COD',
    totalAmount: 25000000
}
→ Response: { orderId, orderNumber }
```

---

#### 6. **`pages/partner/PartnerDashboard.js`**
```javascript
// THỐNG KÊ PARTNER
GET /partner/stats
→ Response: { revenue, products, orders }

// SẢN PHẨM CỦA PARTNER
GET /partner/products

// ĐƠN HÀNG CỦA PARTNER
GET /partner/orders
```

---

#### 7. **`pages/deals/DealsPage.js`**
```javascript
// SẢN PHẨM GIẢM GIÁ
GET /products?hasDiscount=true&sortBy=discountPercent

// BEST SELLERS
GET /products?sortBy=soldCount&limit=10
```

---

### **D. COMPONENTS (Gọi API khi có tương tác)**

#### 1. **`components/review/ReviewForm.js`**
```javascript
// GỬI ĐÁNH GIÁ
POST /reviews/product/:productId
Body: {
    rating: 5,
    title: 'Great laptop!',
    comment: 'Very satisfied...',
    pros: ['Fast', 'Beautiful'],
    cons: ['Expensive']
}
→ Response: Review created
```

---

#### 2. **`components/review/ReviewList.js`**
```javascript
// LẤY DANH SÁCH ĐÁNH GIÁ
GET /reviews/product/:productId?page=1&limit=5
→ Response: { reviews: [...], totalPages }
```

---

#### 3. **`components/notification/NotificationBell.js`**
```javascript
// LẤY THÔNG BÁO
GET /notifications
→ Response: [{ _id, message, type, isRead, createdAt }]

// ĐÁNH DẤU ĐÃ ĐỌC
PUT /notifications/:id/read
```

---

#### 4. **`components/product/BestSellers.js`**
```javascript
// TOP SẢN PHẨM BÁN CHẠY
GET /products?sortBy=soldCount&limit=8
```

---

#### 5. **`components/product/ProductComparison.js`**
```javascript
// SO SÁNH SẢN PHẨM
GET /products?ids=id1,id2,id3
→ Response: [product1, product2, product3]
```

---

#### 6. **`components/profile/AddressManagement.js`**
```javascript
// THÊM ĐỊA CHỈ
POST /users/addresses
Body: { ... }

// CẬP NHẬT ĐỊA CHỈ
PUT /users/addresses/:id

// XÓA ĐỊA CHỈ
DELETE /users/addresses/:id
```

---

## 📊 Tổng Kết API Endpoints

### **Authentication**
- `POST /auth/login` - Đăng nhập
- `POST /auth/register` - Đăng ký
- `POST /auth/forgot-password` - Quên mật khẩu
- `POST /auth/reset-password` - Reset mật khẩu

### **Products**
- `GET /products` - Danh sách sản phẩm (có filters)
- `GET /products/:id` - Chi tiết sản phẩm
- `POST /products` - Tạo sản phẩm (Partner/Admin)
- `PUT /products/:id` - Cập nhật sản phẩm
- `DELETE /products/:id` - Xóa sản phẩm

### **Cart**
- `GET /cart` - Lấy giỏ hàng
- `POST /cart` - Thêm vào giỏ
- `PUT /cart/:itemId` - Cập nhật số lượng
- `DELETE /cart/:itemId` - Xóa khỏi giỏ
- `DELETE /cart/clear/all` - Xóa toàn bộ

### **Orders**
- `GET /orders` - Danh sách đơn hàng
- `GET /orders/:id` - Chi tiết đơn hàng
- `POST /orders` - Tạo đơn hàng
- `PUT /orders/:id/status` - Cập nhật trạng thái

### **Reviews**
- `GET /reviews/product/:productId` - Danh sách review
- `POST /reviews/product/:productId` - Tạo review
- `PUT /reviews/:id/moderate` - Duyệt review (Admin)

### **Admin**
- `GET /admin/stats` - Thống kê tổng quan
- `GET /admin/users` - Danh sách users
- `PUT /admin/users/:id` - Cập nhật user
- `DELETE /admin/users/:id` - Xóa user
- `GET /admin/revenue-by-shop` - Doanh thu partners

### **Partner**
- `GET /partner/stats` - Thống kê partner
- `GET /partner/products` - Sản phẩm của partner
- `GET /partner/orders` - Đơn hàng của partner

### **User Profile**
- `GET /users/profile` - Thông tin profile
- `PUT /users/profile` - Cập nhật profile
- `GET /users/wishlist` - Danh sách yêu thích
- `POST /users/wishlist/:productId` - Thêm/xóa wishlist

### **Notifications**
- `GET /notifications` - Danh sách thông báo
- `PUT /notifications/:id/read` - Đánh dấu đã đọc

### **Chat**
- `GET /chat/conversations` - Danh sách hội thoại
- `GET /chat/messages/:conversationId` - Lấy tin nhắn
- `POST /chat/send` - Gửi tin nhắn

---

## 🎨 Pattern Sử Dụng

### **1. Trong Context (Global State)**
```javascript
import axios from '../api/axiosConfig';

const fetchData = async () => {
    const res = await axios.get('/endpoint');
    setState(res.data);
};
```

### **2. Trong Page/Component**
```javascript
import axios from '../../api/axiosConfig';

useEffect(() => {
    const fetchData = async () => {
        try {
            const res = await axios.get('/products');
            setProducts(res.data);
        } catch (error) {
            console.error('Error:', error);
        }
    };
    fetchData();
}, []);
```

### **3. Khi cần Token**
Không cần thêm token thủ công! `axiosConfig.js` đã tự động gắn token vào headers.

### **4. Error Handling**
```javascript
try {
    await axios.post('/endpoint', data);
} catch (error) {
    const errorMsg = error.response?.data?.message || 'Something went wrong';
    toast.error(errorMsg);
}
```

---

## 🔑 Lưu Ý Quan Trọng

1. **Tất cả imports đều từ `axiosConfig.js`**, KHÔNG import trực tiếp từ `axios`
2. **Token được tự động gắn** vào mọi request bởi interceptor
3. **Khi 401 (Unauthorized)**, user sẽ tự động bị logout và redirect về `/login`
4. **Base URL** được set sẵn, chỉ cần gọi `/products` thay vì `http://localhost:5000/api/products`
5. **Debouncing** được áp dụng cho price filters trong `useProducts` hook

---

## 📍 Tìm File Gọi API Như Thế Nào?

### **Nếu muốn tìm nơi gọi API cho feature X:**
1. **Authentication** → `context/AuthContext.js`
2. **Giỏ hàng** → `context/CartContext.js`
3. **Sản phẩm** → `hooks/useProducts.js` hoặc `pages/product/ProductDetailPage.js`
4. **Admin** → `pages/admin/AdminDashboard.js`
5. **Đơn hàng** → `pages/user/orders/`
6. **Review** → `components/review/ReviewForm.js` hoặc `ReviewList.js`

### **Tìm tất cả file có axios:**
```bash
# Tìm kiếm bằng command
grep -r "axios" client/src --include="*.js"
```

Trong dự án này, có khoảng **35+ files** gọi API, tập trung vào:
- **Context files** (4 files)
- **Page components** (20+ files)
- **Reusable components** (10+ files)
- **Custom hooks** (2 files)

---

**Tác giả:** CypherAli  
**Ngày cập nhật:** 2025-11-27
