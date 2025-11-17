# 🧪 HƯỚNG DẪN TESTING TOÀN DIỆN

**Ngày cập nhật:** 15 Tháng 11, 2025

---

## 📋 MỤC LỤC

1. [Chuẩn Bị Testing](#1-chuẩn-bị-testing)
2. [API Testing](#2-api-testing)
3. [Frontend Testing](#3-frontend-testing)
4. [Integration Testing](#4-integration-testing)
5. [Performance Testing](#5-performance-testing)
6. [Security Testing](#6-security-testing)

---

## 1. CHUẨN BỊ TESTING

### 1.1 Khởi Động Hệ Thống

```bash
# Terminal 1: Start Backend
cd server
npm install
npm start

# Terminal 2: Start Frontend
cd client
npm install
npm start
```

### 1.2 Tạo Test Data

```bash
# Chạy seed scripts
cd server
node seedProducts.js
node createUsers.js
node createOrders.js
```

### 1.3 Test Accounts

```javascript
// Admin Account
{
  "username": "admin",
  "password": "admin123",
  "email": "admin@laptopmarketplace.com"
}

// Partner Account
{
  "username": "partner1",
  "password": "partner123",
  "email": "partner1@laptopmarketplace.com"
}

// Client Account
{
  "username": "client1",
  "password": "client123",
  "email": "client1@laptopmarketplace.com"
}
```

---

## 2. API TESTING

### 2.1 Authentication APIs

#### Test 1: Register New User
```bash
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "username": "testuser",
  "email": "testuser@example.com",
  "password": "password123",
  "role": "client"
}

✅ Expected: 201 Created
✅ Response: { token, user }
```

#### Test 2: Login
```bash
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "testuser@example.com",
  "password": "password123"
}

✅ Expected: 200 OK
✅ Response: { token, user }
```

#### Test 3: Get Current User
```bash
GET http://localhost:5000/api/auth/me
Authorization: Bearer {token}

✅ Expected: 200 OK
✅ Response: { user }
```

### 2.2 Product APIs

#### Test 4: Get All Products
```bash
GET http://localhost:5000/api/products?page=1&limit=10

✅ Expected: 200 OK
✅ Response: { products, pagination }
```

#### Test 5: Search Products
```bash
GET http://localhost:5000/api/products?search=Dell&brand=Dell&minPrice=10000000&maxPrice=30000000

✅ Expected: 200 OK
✅ Response: { products, pagination }
```

#### Test 6: Get Product Details
```bash
GET http://localhost:5000/api/products/{productId}

✅ Expected: 200 OK
✅ Response: { product }
```

#### Test 7: Create Product (Partner)
```bash
POST http://localhost:5000/api/products
Authorization: Bearer {partnerToken}
Content-Type: application/json

{
  "name": "Dell XPS 15 9520",
  "description": "Professional laptop",
  "price": 45000000,
  "stock": 10,
  "brand": "Dell",
  "category": "Laptops",
  "processor": "Intel Core i7-12700H",
  "ram": "16GB DDR5",
  "storage": "512GB NVMe SSD",
  "imageUrl": "https://example.com/dell-xps.jpg"
}

✅ Expected: 201 Created
✅ Response: { product }
```

### 2.3 Order APIs

#### Test 8: Create Order
```bash
POST http://localhost:5000/api/orders
Authorization: Bearer {clientToken}
Content-Type: application/json

{
  "items": [
    {
      "productId": "{productId}",
      "quantity": 1
    }
  ],
  "shippingAddress": {
    "fullName": "Nguyen Van A",
    "phone": "0901234567",
    "address": "123 Nguyen Hue Street",
    "city": "Ho Chi Minh City"
  },
  "paymentMethod": "cod"
}

✅ Expected: 201 Created
✅ Response: { order }
```

#### Test 9: Get My Orders
```bash
GET http://localhost:5000/api/orders/my-orders
Authorization: Bearer {clientToken}

✅ Expected: 200 OK
✅ Response: { orders, pagination }
```

#### Test 10: Get Order Details
```bash
GET http://localhost:5000/api/orders/{orderId}
Authorization: Bearer {clientToken}

✅ Expected: 200 OK
✅ Response: { order }
```

#### Test 11: Update Order Status (Admin)
```bash
PUT http://localhost:5000/api/orders/{orderId}/status
Authorization: Bearer {adminToken}
Content-Type: application/json

{
  "status": "confirmed",
  "note": "Order confirmed by admin"
}

✅ Expected: 200 OK
✅ Response: { order }
```

### 2.4 Payment APIs ⭐ NEW

#### Test 12: Create Payment
```bash
POST http://localhost:5000/api/payment/create
Authorization: Bearer {clientToken}
Content-Type: application/json

{
  "orderId": "{orderId}",
  "paymentMethod": "vnpay"
}

✅ Expected: 201 Created
✅ Response: { payment }
```

#### Test 13: Create VNPay Payment
```bash
POST http://localhost:5000/api/payment/vnpay/create
Authorization: Bearer {clientToken}
Content-Type: application/json

{
  "orderId": "{orderId}"
}

✅ Expected: 200 OK
✅ Response: { paymentUrl, paymentId }
```

#### Test 14: Confirm COD Payment
```bash
PUT http://localhost:5000/api/payment/{paymentId}/confirm-cod
Authorization: Bearer {adminToken}
Content-Type: application/json

{
  "collectedBy": "Delivery Staff",
  "receiptNumber": "COD123456"
}

✅ Expected: 200 OK
✅ Response: { payment }
```

#### Test 15: Submit Bank Transfer
```bash
PUT http://localhost:5000/api/payment/{paymentId}/bank-transfer
Authorization: Bearer {clientToken}
Content-Type: application/json

{
  "bankName": "Vietcombank",
  "accountNumber": "1234567890",
  "accountName": "NGUYEN VAN A",
  "transferDate": "2025-11-15",
  "referenceNumber": "VCB20251115123456",
  "proofImageUrl": "https://example.com/proof.jpg"
}

✅ Expected: 200 OK
✅ Response: { payment }
```

### 2.5 Voucher APIs

#### Test 16: Get Available Vouchers
```bash
GET http://localhost:5000/api/vouchers/available
Authorization: Bearer {clientToken}

✅ Expected: 200 OK
✅ Response: [vouchers]
```

#### Test 17: Collect Voucher
```bash
POST http://localhost:5000/api/vouchers/collect
Authorization: Bearer {clientToken}
Content-Type: application/json

{
  "code": "WELCOME10"
}

✅ Expected: 201 Created
✅ Response: { userVoucher }
```

#### Test 18: Apply Voucher
```bash
POST http://localhost:5000/api/vouchers/apply
Authorization: Bearer {clientToken}
Content-Type: application/json

{
  "voucherCode": "WELCOME10",
  "orderAmount": 20000000
}

✅ Expected: 200 OK
✅ Response: { discount, finalAmount }
```

### 2.6 Notification APIs

#### Test 19: Get Notifications
```bash
GET http://localhost:5000/api/notifications
Authorization: Bearer {clientToken}

✅ Expected: 200 OK
✅ Response: { notifications, pagination }
```

#### Test 20: Mark as Read
```bash
PUT http://localhost:5000/api/notifications/{notificationId}/read
Authorization: Bearer {clientToken}

✅ Expected: 200 OK
✅ Response: { notification }
```

### 2.7 Review APIs

#### Test 21: Create Review
```bash
POST http://localhost:5000/api/reviews
Authorization: Bearer {clientToken}
Content-Type: application/json

{
  "product": "{productId}",
  "order": "{orderId}",
  "rating": 5,
  "title": "Excellent laptop!",
  "comment": "Very satisfied with this purchase.",
  "pros": ["Fast performance", "Great display"],
  "cons": ["A bit expensive"]
}

✅ Expected: 201 Created
✅ Response: { review }
```

#### Test 22: Get Product Reviews
```bash
GET http://localhost:5000/api/reviews/product/{productId}?page=1&limit=10

✅ Expected: 200 OK
✅ Response: { reviews, pagination, summary }
```

### 2.8 Analytics APIs

#### Test 23: Get Dashboard Stats (Admin)
```bash
GET http://localhost:5000/api/analytics/dashboard
Authorization: Bearer {adminToken}

✅ Expected: 200 OK
✅ Response: { revenue, orders, products, users, reviews }
```

#### Test 24: Get Revenue Analytics
```bash
GET http://localhost:5000/api/analytics/revenue?period=month&startDate=2025-01-01&endDate=2025-12-31
Authorization: Bearer {adminToken}

✅ Expected: 200 OK
✅ Response: [{ _id, revenue, orders }]
```

---

## 3. FRONTEND TESTING

### 3.1 User Journey Tests

#### Test 25: Complete Purchase Flow
1. ✅ Navigate to homepage
2. ✅ Browse products
3. ✅ Search for a product
4. ✅ Click on product details
5. ✅ Add to cart
6. ✅ View cart
7. ✅ Proceed to checkout
8. ✅ Fill shipping information
9. ✅ Select payment method
10. ✅ Complete order
11. ✅ View order confirmation

#### Test 26: User Registration & Login Flow
1. ✅ Click Register
2. ✅ Fill registration form
3. ✅ Submit registration
4. ✅ Receive welcome email
5. ✅ Login with credentials
6. ✅ Access user dashboard

#### Test 27: Product Review Flow
1. ✅ Login as user
2. ✅ Go to orders
3. ✅ Select completed order
4. ✅ Click "Write Review"
5. ✅ Fill review form
6. ✅ Submit review
7. ✅ See review on product page

### 3.2 UI Component Tests

#### Test 28: Navigation
- ✅ Logo redirects to homepage
- ✅ Menu items work correctly
- ✅ Cart icon shows item count
- ✅ User menu shows when logged in
- ✅ Responsive menu on mobile

#### Test 29: Product Filter
- ✅ Brand filter works
- ✅ Price range slider works
- ✅ Processor filter works
- ✅ RAM filter works
- ✅ Storage filter works
- ✅ Multiple filters work together
- ✅ Clear filters button works

#### Test 30: Search
- ✅ Search bar accepts input
- ✅ Search suggestions appear
- ✅ Search results are accurate
- ✅ Empty search shows all products
- ✅ No results message appears

### 3.3 Form Validation Tests

#### Test 31: Registration Form
- ✅ Username required
- ✅ Email format validation
- ✅ Password strength validation
- ✅ Password confirmation match
- ✅ Terms acceptance required

#### Test 32: Checkout Form
- ✅ Full name required
- ✅ Phone number format
- ✅ Address required
- ✅ City selection required
- ✅ Payment method required

---

## 4. INTEGRATION TESTING

### 4.1 Socket.IO Testing

#### Test 33: Live Chat
```javascript
// Client 1 (User)
socket.emit('user:join', userId);
socket.emit('chat:join', { userId, partnerId });
socket.emit('chat:send', {
  senderId: userId,
  receiverId: partnerId,
  message: 'Hello, I need help'
});

// Client 2 (Partner)
socket.on('chat:message', (message) => {
  console.log('Received:', message);
  ✅ Expected: Message appears instantly
});
```

#### Test 34: Real-time Notifications
```javascript
// Admin updates order status
// User should receive notification instantly
socket.on('notification:new', (notification) => {
  ✅ Expected: Notification appears
  ✅ Expected: Sound/visual alert
});
```

### 4.2 Email Testing

#### Test 35: Order Confirmation Email
1. ✅ Create order
2. ✅ Check email inbox
3. ✅ Verify email received
4. ✅ Check email content
5. ✅ Verify all order details

#### Test 36: Price Alert Email
1. ✅ Create price alert
2. ✅ Update product price (below target)
3. ✅ Check email inbox
4. ✅ Verify email received

### 4.3 Cron Job Testing

#### Test 37: Price Alert Check
```bash
# Manually trigger (for testing)
# In server console:
const { checkAllPriceAlerts } = require('./controllers/priceAlertController');
checkAllPriceAlerts();

✅ Expected: Alerts triggered for eligible products
✅ Expected: Notifications sent
✅ Expected: Emails sent
```

#### Test 38: Warranty Reminders
```bash
# Manually trigger
const { sendWarrantyReminders } = require('./controllers/warrantyController');
sendWarrantyReminders();

✅ Expected: Reminders sent for expiring warranties
✅ Expected: Notification created
✅ Expected: Email sent
```

---

## 5. PERFORMANCE TESTING

### 5.1 Load Testing

#### Test 39: Concurrent Users
```bash
# Use Apache Bench or Artillery
ab -n 1000 -c 100 http://localhost:5000/api/products

✅ Expected: < 500ms response time
✅ Expected: 0% error rate
```

#### Test 40: Database Queries
```javascript
// Monitor query execution time
const startTime = Date.now();
const products = await Product.find().limit(100);
const endTime = Date.now();
console.log('Query time:', endTime - startTime, 'ms');

✅ Expected: < 100ms
```

### 5.2 Stress Testing

#### Test 41: Heavy Load
```bash
# Simulate 1000 concurrent requests
ab -n 10000 -c 1000 http://localhost:5000/api/products

✅ Monitor: CPU usage
✅ Monitor: Memory usage
✅ Monitor: Response times
✅ Expected: System remains stable
```

---

## 6. SECURITY TESTING

### 6.1 Authentication Tests

#### Test 42: Invalid Token
```bash
GET http://localhost:5000/api/orders/my-orders
Authorization: Bearer invalid_token

✅ Expected: 401 Unauthorized
✅ Response: { message: 'Token không hợp lệ' }
```

#### Test 43: Expired Token
```bash
# Use expired token
GET http://localhost:5000/api/orders/my-orders
Authorization: Bearer {expiredToken}

✅ Expected: 401 Unauthorized
✅ Response: { message: 'Token đã hết hạn' }
```

#### Test 44: Missing Token
```bash
GET http://localhost:5000/api/orders/my-orders

✅ Expected: 401 Unauthorized
✅ Response: { message: 'Không có token' }
```

### 6.2 Authorization Tests

#### Test 45: Client Access Admin Route
```bash
GET http://localhost:5000/api/admin/users
Authorization: Bearer {clientToken}

✅ Expected: 403 Forbidden
✅ Response: { message: 'Insufficient permissions' }
```

#### Test 46: Partner Create Product for Another Partner
```bash
PUT http://localhost:5000/api/products/{otherPartnerProductId}
Authorization: Bearer {partnerToken}

✅ Expected: 403 Forbidden
✅ Response: { message: 'Access denied' }
```

### 6.3 Input Validation Tests

#### Test 47: SQL Injection Attempt
```bash
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "admin@test.com' OR '1'='1",
  "password": "anything"
}

✅ Expected: 401 Unauthorized (not SQL error)
```

#### Test 48: XSS Attempt
```bash
POST http://localhost:5000/api/reviews
Authorization: Bearer {token}
Content-Type: application/json

{
  "comment": "<script>alert('XSS')</script>",
  "rating": 5
}

✅ Expected: Comment sanitized
✅ Expected: Script tags removed
```

---

## 📊 TEST RESULTS TEMPLATE

### Test Session Report

```markdown
**Date:** 2025-11-15
**Tester:** [Name]
**Environment:** Development

| Test ID | Test Name | Status | Notes |
|---------|-----------|--------|-------|
| Test 1  | Register New User | ✅ Pass | - |
| Test 2  | Login | ✅ Pass | - |
| Test 3  | Get Current User | ✅ Pass | - |
| ... | ... | ... | ... |

**Summary:**
- Total Tests: 48
- Passed: 45
- Failed: 3
- Skipped: 0

**Failed Tests:**
1. Test 25 - Payment gateway timeout
2. Test 37 - Cron job not triggering
3. Test 43 - Email not sent

**Recommendations:**
1. Increase payment gateway timeout
2. Check cron job configuration
3. Verify email service credentials
```

---

## 🔄 CONTINUOUS TESTING

### Daily Smoke Tests
- ✅ User registration & login
- ✅ Product search
- ✅ Order creation
- ✅ Payment processing

### Weekly Regression Tests
- ✅ All API endpoints
- ✅ All UI components
- ✅ Integration tests

### Before Deployment
- ✅ Full test suite
- ✅ Performance tests
- ✅ Security audit
- ✅ Load testing

---

## 📝 NOTES

### Test Environment Setup
1. Use separate test database
2. Clear test data before each run
3. Use mock payment gateways
4. Use test email service (Ethereal)

### Best Practices
- Test one thing at a time
- Use descriptive test names
- Document expected results
- Keep tests independent
- Clean up after tests

---

**Happy Testing! 🎉**
