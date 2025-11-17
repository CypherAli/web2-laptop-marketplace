# 🧪 Hướng Dẫn Test Toàn Diện Hệ Thống

## 📋 Tổng Quan

Document này hướng dẫn test từng chức năng của hệ thống để đảm bảo mọi thứ hoạt động hoàn hảo.

---

## 🚀 SETUP & START

### Start All Services
```powershell
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend  
cd client
npm start

# Create admin account
cd server
node createAdminUser.js
```

**Default Admin:** `admin@laptop.com` / `admin123`

---

## ✅ TEST CHECKLIST

### 1. AUTHENTICATION ✅
- [ ] Register Client - Success
- [ ] Register Partner - Pending approval
- [ ] Login Client - Success
- [ ] Login Unapproved Partner - Blocked
- [ ] Login Admin - Success
- [ ] Invalid credentials - Error
- [ ] Token expiration - Handled

### 2. ADMIN DASHBOARD ✅
- [ ] Access admin dashboard
- [ ] View system stats
- [ ] Approve pending partners
- [ ] Change user roles
- [ ] Delete users (not self)
- [ ] View all products
- [ ] Approve/reject products
- [ ] Delete any product
- [ ] View all orders
- [ ] Update order status
- [ ] View/approve reviews

### 3. PARTNER DASHBOARD ✅
- [ ] Access (unapproved) - Warning shown
- [ ] Access (approved) - Full access
- [ ] Add product - Success
- [ ] Edit own product - Success
- [ ] Delete own product - Success
- [ ] Cannot edit other's products
- [ ] Toggle product status
- [ ] View stats & revenue

### 4. CLIENT FEATURES ✅
- [ ] Browse products - Loads correctly
- [ ] Filter by brand/price/ram
- [ ] Search products
- [ ] View product detail
- [ ] Add to cart
- [ ] View cart
- [ ] Update cart quantity
- [ ] Remove from cart
- [ ] Checkout & place order
- [ ] View order history
- [ ] Add to wishlist
- [ ] View wishlist

### 5. SECURITY ✅
- [ ] Protected routes block unauthorized
- [ ] API requires valid token
- [ ] Role-based access control
- [ ] Partner approval check
- [ ] Input validation
- [ ] XSS prevention
- [ ] SQL injection prevention

### 6. IMAGE HANDLING ✅
- [ ] Valid images load
- [ ] Invalid images show fallback
- [ ] Empty images show placeholder
- [ ] Loading states work
- [ ] Lazy loading enabled
- [ ] Error handling graceful

### 7. RESPONSIVE DESIGN ✅
- [ ] Mobile (375px) - Looks good
- [ ] Tablet (768px) - Looks good
- [ ] Desktop (1920px) - Looks good
- [ ] No horizontal scroll
- [ ] Touch-friendly buttons
- [ ] Readable text

### 8. ERROR HANDLING ✅
- [ ] Network errors - User-friendly messages
- [ ] Validation errors - Clear feedback
- [ ] 404 pages - Handled
- [ ] 500 errors - Logged & shown
- [ ] Form errors - Inline validation

---

## 🎯 CRITICAL FLOWS

### Flow 1: Partner Onboarding
```
1. Register as Partner → "Chờ duyệt"
2. Login → Blocked with message
3. Admin approves → isApproved = true
4. Partner logs in again → Success
5. Partner adds product → Success
6. Product visible in dashboard
```

### Flow 2: Product Purchase
```
1. Client browses products
2. Filters & searches
3. Views product detail
4. Adds to cart
5. Views cart
6. Proceeds to checkout
7. Places order
8. Order appears in history
```

### Flow 3: Admin Management
```
1. Admin logs in
2. Views pending partners
3. Approves partner
4. Views all products
5. Manages orders
6. Moderates reviews
7. Views system stats
```

---

## 🔍 DETAILED TEST SCENARIOS

### A. Partner Approval Flow
```javascript
// Test Case: PA-001
// Partner Registration & Approval

// Step 1: Register partner
POST /api/auth/register
{
    username: "testshop",
    email: "shop@test.com",
    password: "123456",
    role: "partner",
    shopName: "Test Shop"
}
Expected: 201, message: "Đang chờ phê duyệt"

// Step 2: Try to login
POST /api/auth/login
{
    email: "shop@test.com",
    password: "123456"
}
Expected: 403, "Partner chưa được duyệt"

// Step 3: Admin approves
PUT /api/admin/users/{partnerId}
{ isApproved: true }
Expected: 200, user.isApproved = true

// Step 4: Partner logs in again
POST /api/auth/login
Expected: 200, token returned

// Step 5: Partner accesses dashboard
GET /api/partner/my-products
Expected: 200, products array
```

### B. Product CRUD (Partner)
```javascript
// Test Case: PC-001
// Partner Product Management

// Step 1: Create product
POST /api/products
{
    name: "Test Laptop",
    brand: "Dell",
    price: 20000000,
    stock: 10,
    description: "Test product"
}
Headers: { Authorization: "Bearer {partner_token}" }
Expected: 201, product created with createdBy = partner._id

// Step 2: Update own product
PUT /api/products/{productId}
{ price: 19000000 }
Expected: 200, price updated

// Step 3: Try to update other's product
PUT /api/products/{otherProductId}
{ price: 5000000 }
Expected: 403, "Không có quyền"

// Step 4: Delete own product
DELETE /api/products/{productId}
Expected: 200, "Deleted successfully"
```

---

## 🐛 COMMON ISSUES & FIXES

### Issue 1: Token Expired
```javascript
// Problem: User logged out unexpectedly
// Cause: JWT token expired (24h)
// Solution: Implement refresh token OR extend expiry

// Current: 24h expiry
jwt.sign(payload, secret, { expiresIn: '24h' })

// Better: Catch expired token, prompt re-login
if (error.code === 'TOKEN_EXPIRED') {
    // Redirect to login
    // Show message: "Phiên đăng nhập hết hạn"
}
```

### Issue 2: Image Not Loading
```javascript
// Problem: Broken images
// Cause: Invalid URL OR CORS OR slow network
// Solution: Fallback + error handling

<ProductImage 
    src={product.imageUrl}
    fallback={PLACEHOLDER_IMAGES.product}
    onError={(e) => {
        console.log('Image failed:', e);
        // Log to analytics
    }}
/>
```

### Issue 3: Partner Can't Add Product
```javascript
// Problem: 403 error when creating product
// Possible causes:
// 1. Not approved → Check isApproved field
// 2. Wrong token → Check Authorization header
// 3. Token expired → Re-login

// Debug:
// 1. Check user object in AuthContext
console.log(user.isApproved); // Should be true

// 2. Check API request
console.log(axios.defaults.headers.common['Authorization']);

// 3. Check backend logs
// Should see: "User {id} creating product"
```

---

## 📊 TEST DATA SEED

### Quick Seed Script
```javascript
// server/quickSeed.js
const mongoose = require('mongoose');
const User = require('./models/User');
const Product = require('./models/Product');

async function seed() {
    await mongoose.connect(process.env.MONGO_URI);
    
    // Create test users
    const client = await User.create({
        username: 'testclient',
        email: 'client@test.com',
        password: '123456',
        role: 'client',
        isApproved: true
    });
    
    const partner = await User.create({
        username: 'testpartner',
        email: 'partner@test.com',
        password: '123456',
        role: 'partner',
        shopName: 'Test Shop',
        isApproved: true
    });
    
    // Create test products
    await Product.create({
        name: 'Dell XPS 13',
        brand: 'Dell',
        price: 25000000,
        stock: 10,
        description: 'Test laptop',
        createdBy: partner._id
    });
    
    console.log('✅ Seed complete!');
    process.exit(0);
}

seed();
```

---

## 🎓 FINAL VERIFICATION

### Pre-Launch Checklist
```
✅ All authentication flows tested
✅ All dashboards load correctly
✅ Partner approval system works
✅ Product CRUD operations work
✅ Image handling perfect
✅ Responsive on all devices
✅ No console errors
✅ No network errors
✅ Security tested
✅ Performance good (<3s page load)

Ready to deploy? YES! 🚀
```

---

## 📞 Need Help?

If any test fails:
1. Check browser console
2. Check server logs
3. Check database state
4. Review error messages
5. Check this guide again
6. Ask for help!

**Happy Testing!** ✨
