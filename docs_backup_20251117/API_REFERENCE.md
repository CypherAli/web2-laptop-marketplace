# 📡 API REFERENCE - Laptop Marketplace

## Base URL
```
Development: http://localhost:5000/api
Production: https://your-domain.com/api
```

## Authentication
Most endpoints require JWT token in header:
```
Authorization: Bearer <your-jwt-token>
```

---

## 🔐 AUTH ENDPOINTS

### Register User
```http
POST /auth/register
```

**Request Body:**
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securepassword123",
  "role": "client" // optional: client, partner (admin requires manual assignment)
}
```

**Response (201):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "username": "johndoe",
    "email": "john@example.com",
    "role": "client"
  }
}
```

### Login
```http
POST /auth/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "username": "johndoe",
    "email": "john@example.com",
    "role": "client"
  }
}
```

### Get Current User
```http
GET /auth/me
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "username": "johndoe",
  "email": "john@example.com",
  "role": "client",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

---

## 🛍️ PRODUCT ENDPOINTS

### Get All Products
```http
GET /products?page=1&limit=10&brand=Dell&minPrice=10000000&maxPrice=30000000&sortBy=price_asc
```

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10)
- `search` (string): Search in name/description
- `brand` (string): Filter by brand (comma-separated for multiple)
- `ram` (string): Filter by RAM
- `processor` (string): Filter by processor
- `minPrice` (number): Minimum price
- `maxPrice` (number): Maximum price
- `inStock` (boolean): Only in-stock products
- `sortBy` (string): Sort by (price_asc, price_desc, popular, newest)

**Response (200):**
```json
{
  "products": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Dell XPS 15",
      "description": "Premium laptop...",
      "price": 25000000,
      "originalPrice": 30000000,
      "stock": 15,
      "brand": "Dell",
      "category": "Laptops",
      "imageUrl": "https://...",
      "specifications": {
        "processor": "Intel Core i7-12700H",
        "ram": "16GB",
        "storage": "512GB SSD",
        "graphics": "NVIDIA RTX 3050",
        "display": "15.6\" FHD"
      },
      "rating": {
        "average": 4.5,
        "count": 120
      },
      "soldCount": 350,
      "createdBy": {
        "_id": "...",
        "username": "seller1",
        "shopName": "Tech Store"
      },
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "currentPage": 1,
  "totalPages": 5,
  "totalProducts": 48
}
```

### Get Product by ID
```http
GET /products/:id
```

**Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "Dell XPS 15",
  "description": "Premium laptop with excellent build quality...",
  "price": 25000000,
  "originalPrice": 30000000,
  "stock": 15,
  "brand": "Dell",
  "category": "Laptops",
  "imageUrl": "https://...",
  "images": ["https://...", "https://..."],
  "specifications": {
    "processor": "Intel Core i7-12700H",
    "processorGen": "12th Gen",
    "ram": "16GB",
    "ramType": "DDR5",
    "storage": "512GB SSD",
    "storageType": "NVMe",
    "graphics": "NVIDIA RTX 3050",
    "graphicsMemory": "4GB GDDR6",
    "display": "15.6 inch",
    "displaySize": 15.6,
    "displayResolution": "1920x1080",
    "displayRefreshRate": "60Hz",
    "weight": "2.1kg",
    "battery": "86Wh",
    "operatingSystem": "Windows 11 Pro",
    "ports": ["2x USB-C", "2x USB-A", "HDMI", "SD Card"],
    "connectivity": ["WiFi 6E", "Bluetooth 5.2"],
    "keyboard": "Backlit",
    "webcam": "720p HD",
    "audio": "Stereo speakers"
  },
  "features": [
    "Premium aluminum build",
    "Thin and light design",
    "Long battery life"
  ],
  "warranty": {
    "duration": "24 months",
    "type": "manufacturer",
    "details": "International warranty"
  },
  "returnPolicy": {
    "returnable": true,
    "returnWindow": 30,
    "details": "30 days return policy"
  },
  "shipping": {
    "isFreeShipping": true,
    "estimatedDays": 2,
    "shippingCost": 0
  },
  "rating": {
    "average": 4.5,
    "count": 120,
    "breakdown": {
      "5": 80,
      "4": 30,
      "3": 8,
      "2": 2,
      "1": 0
    }
  },
  "soldCount": 350,
  "viewCount": 1520,
  "wishlistCount": 89,
  "createdBy": {
    "_id": "...",
    "username": "seller1",
    "shopName": "Tech Store",
    "shopDescription": "Premium tech products"
  },
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-15T00:00:00.000Z"
}
```

### Create Product (Partner/Admin)
```http
POST /products
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "Dell XPS 15",
  "description": "Premium laptop...",
  "price": 25000000,
  "originalPrice": 30000000,
  "stock": 15,
  "brand": "Dell",
  "category": "Laptops",
  "imageUrl": "https://...",
  "specifications": {
    "processor": "Intel Core i7-12700H",
    "ram": "16GB",
    "storage": "512GB SSD"
  }
}
```

**Response (201):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "Dell XPS 15",
  ...
}
```

### Update Product (Owner/Admin)
```http
PUT /products/:id
Authorization: Bearer <token>
```

### Delete Product (Owner/Admin)
```http
DELETE /products/:id
Authorization: Bearer <token>
```

### Get All Brands
```http
GET /products/brands
```

**Response (200):**
```json
["Acer", "Apple", "Asus", "Dell", "HP", "Lenovo", "MSI"]
```

---

## ⭐ REVIEW ENDPOINTS (NEW)

### Get Product Reviews
```http
GET /reviews/product/:productId?page=1&limit=10&sortBy=recent&rating=5&verified=true
```

**Query Parameters:**
- `page` (number): Page number
- `limit` (number): Reviews per page
- `sortBy` (string): recent, oldest, helpful, rating_high, rating_low
- `rating` (number): Filter by rating (1-5)
- `verified` (boolean): Only verified purchases

**Response (200):**
```json
{
  "reviews": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "product": "507f1f77bcf86cd799439011",
      "user": {
        "_id": "...",
        "username": "johndoe",
        "email": "john@example.com"
      },
      "rating": 5,
      "title": "Excellent laptop!",
      "comment": "This laptop is amazing. Great performance and battery life.",
      "pros": [
        "Fast performance",
        "Long battery life",
        "Beautiful display"
      ],
      "cons": [
        "A bit pricey"
      ],
      "images": ["https://..."],
      "isVerifiedPurchase": true,
      "helpfulCount": 15,
      "sellerResponse": {
        "comment": "Thank you for your review!",
        "respondedBy": {
          "_id": "...",
          "username": "seller1",
          "shopName": "Tech Store"
        },
        "respondedAt": "2024-01-02T00:00:00.000Z"
      },
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "currentPage": 1,
  "totalPages": 3,
  "totalReviews": 28
}
```

### Create Review (Authenticated)
```http
POST /reviews/product/:productId
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "rating": 5,
  "title": "Excellent laptop!",
  "comment": "This laptop is amazing...",
  "pros": ["Fast", "Good battery"],
  "cons": ["Expensive"],
  "images": ["https://..."]
}
```

**Response (201):**
```json
{
  "message": "Review created successfully",
  "review": { ... }
}
```

### Update Review (Owner)
```http
PUT /reviews/:reviewId
Authorization: Bearer <token>
```

### Delete Review (Owner/Admin)
```http
DELETE /reviews/:reviewId
Authorization: Bearer <token>
```

### Mark Review as Helpful
```http
POST /reviews/:reviewId/helpful
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "message": "Marked as helpful",
  "helpfulCount": 16
}
```

### Get My Reviews
```http
GET /reviews/my-reviews?page=1&limit=10
Authorization: Bearer <token>
```

### Add Seller Response (Partner/Admin)
```http
POST /reviews/:reviewId/response
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "comment": "Thank you for your feedback!"
}
```

### Moderate Review (Admin)
```http
PUT /reviews/:reviewId/moderate
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "isApproved": true
}
```

---

## 🔄 COMPARISON ENDPOINTS (NEW)

### Compare Products (Direct)
```http
POST /comparisons/compare
```

**Request Body:**
```json
{
  "productIds": [
    "507f1f77bcf86cd799439011",
    "507f1f77bcf86cd799439012",
    "507f1f77bcf86cd799439013"
  ]
}
```

**Response (200):**
```json
{
  "products": [ ... ],
  "specifications": {
    "processor": ["Intel i7", "Intel i5", "AMD Ryzen 7"],
    "ram": ["16GB", "8GB", "16GB"],
    ...
  },
  "pricing": {
    "prices": [25000000, 18000000, 22000000],
    "originalPrices": [30000000, 20000000, 25000000],
    "discounts": [17, 10, 12],
    "lowestPrice": 18000000,
    "highestPrice": 25000000
  },
  "ratings": [ ... ]
}
```

### Save Comparison
```http
POST /comparisons/save
Authorization: Bearer <token> (optional)
Headers: x-session-id: <session-id> (for guest users)
```

**Request Body:**
```json
{
  "productIds": ["...", "...", "..."],
  "isPublic": true
}
```

**Response (200):**
```json
{
  "message": "Comparison saved successfully",
  "comparison": {
    "_id": "...",
    "slug": "compare-abc123def",
    "products": [ ... ],
    "isPublic": true
  }
}
```

### Get Comparison by ID
```http
GET /comparisons/:comparisonId
```

### Get Public Comparison by Slug
```http
GET /comparisons/slug/:slug
```

### Get My Saved Comparisons
```http
GET /comparisons/my/saved
Authorization: Bearer <token>
```

### Delete Comparison
```http
DELETE /comparisons/:comparisonId
Authorization: Bearer <token>
```

---

## 📊 ANALYTICS ENDPOINTS (NEW)

**All analytics endpoints require Partner/Admin authentication**

### Dashboard Stats
```http
GET /analytics/dashboard?startDate=2024-01-01&endDate=2024-01-31
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "revenue": {
    "total": 150000000,
    "orders": 120
  },
  "orders": {
    "byStatus": [
      { "_id": "delivered", "count": 80 },
      { "_id": "shipped", "count": 25 },
      { "_id": "processing", "count": 10 },
      { "_id": "pending", "count": 5 }
    ],
    "total": 120
  },
  "products": {
    "total": 150,
    "outOfStock": 5,
    "lowStock": 12
  },
  "users": {
    "byRole": [
      { "_id": "client", "count": 500 },
      { "_id": "partner", "count": 15 },
      { "_id": "admin", "count": 2 }
    ],
    "total": 517
  },
  "reviews": {
    "total": 340,
    "averageRating": "4.3"
  }
}
```

### Revenue Analytics
```http
GET /analytics/revenue?period=month&startDate=2024-01-01&endDate=2024-12-31
Authorization: Bearer <token>
```

**Query Parameters:**
- `period`: day, week, month, year

**Response (200):**
```json
[
  {
    "_id": { "year": 2024, "month": 1 },
    "revenue": 150000000,
    "orders": 120,
    "avgOrderValue": 1250000
  },
  ...
]
```

### Best Sellers
```http
GET /analytics/best-sellers?limit=10&startDate=2024-01-01&endDate=2024-01-31
Authorization: Bearer <token>
```

**Response (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "productName": "Dell XPS 15",
    "brand": "Dell",
    "imageUrl": "https://...",
    "totalSold": 45,
    "totalRevenue": 112500000,
    "orderCount": 42
  },
  ...
]
```

### Low Stock Alerts
```http
GET /analytics/low-stock
Authorization: Bearer <token>
```

### Sales by Category
```http
GET /analytics/sales-by-category?startDate=2024-01-01&endDate=2024-01-31
Authorization: Bearer <token>
```

### Sales by Brand
```http
GET /analytics/sales-by-brand?limit=10
Authorization: Bearer <token>
```

### Customer Analytics
```http
GET /analytics/customers
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "topCustomers": [ ... ],
  "newCustomersThisMonth": 45,
  "totalCustomers": 500,
  "repeatCustomers": 180,
  "retentionRate": "36.00%"
}
```

### Fulfillment Metrics
```http
GET /analytics/fulfillment
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "avgProcessingDays": "2.5",
  "avgDeliveryDays": "3.2",
  "totalOrders": 120,
  "cancelledOrders": 8,
  "cancellationRate": "6.67%"
}
```

---

## 📦 ORDER ENDPOINTS

### Get My Orders
```http
GET /orders?page=1&limit=10
Authorization: Bearer <token>
```

### Create Order
```http
POST /orders
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "items": [
    {
      "product": "507f1f77bcf86cd799439011",
      "quantity": 1
    }
  ],
  "shippingAddress": {
    "fullName": "John Doe",
    "phone": "0123456789",
    "address": "123 Main St",
    "ward": "Ward 1",
    "district": "District 1",
    "city": "Ho Chi Minh",
    "zipCode": "70000"
  },
  "paymentMethod": "cod",
  "customerNotes": "Please call before delivery"
}
```

**Response (201):**
```json
{
  "_id": "...",
  "orderNumber": "LP240100001",
  "status": "pending",
  "totalAmount": 25000000,
  ...
}
```

### Get Order Details
```http
GET /orders/:id
Authorization: Bearer <token>
```

### Update Order Status (Partner/Admin)
```http
PUT /orders/:id/status
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "status": "shipped",
  "tracking": {
    "carrier": "Giao Hàng Nhanh",
    "trackingNumber": "GHN123456789",
    "estimatedDelivery": "2024-01-05"
  }
}
```

---

## 📝 ERROR RESPONSES

### 400 Bad Request
```json
{
  "error": "Invalid input data"
}
```

### 401 Unauthorized
```json
{
  "message": "No token provided" 
}
```

### 403 Forbidden
```json
{
  "message": "Access denied"
}
```

### 404 Not Found
```json
{
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

---

## 📌 NOTES

- All dates are in ISO 8601 format
- Prices are in VND (Vietnamese Dong)
- Pagination starts at page 1
- Default limit is 10 items per page
- Maximum limit is 100 items per page

---

**Version:** 2.0.0  
**Last Updated:** November 2025
