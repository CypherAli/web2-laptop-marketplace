# 📘 Developer Guide - Laptop Marketplace

## 🎯 Tổng quan hệ thống

Laptop Marketplace là một nền tảng e-commerce hoàn chỉnh với kiến trúc MERN stack (MongoDB, Express, React, Node.js).

## 🏗️ Kiến trúc hệ thống

### Backend Architecture
```
server/
├── models/          # Mongoose schemas
│   ├── Product.js   # Product model với reviews, ratings
│   ├── Review.js    # Review model (NEW)
│   ├── Order.js     # Order model với tracking
│   ├── User.js      # User model với roles
│   ├── Comparison.js # Comparison model (NEW)
│   └── Blog.js      # Blog model
├── controllers/     # Business logic
│   ├── productController.js
│   ├── reviewController.js (NEW)
│   ├── comparisonController.js (NEW)
│   ├── analyticsController.js (NEW)
│   ├── orderController.js
│   └── authController.js
├── routes/          # API routes
│   ├── productRoute.js
│   ├── reviewRoute.js (NEW)
│   ├── comparisonRoute.js (NEW)
│   ├── analyticsRoute.js (NEW)
│   ├── orderRoute.js
│   └── authRoute.js
├── middleware/      # Express middlewares
│   ├── auth.js      # JWT authentication
│   ├── authorize.js # Role-based authorization
│   └── isOwner.js   # Ownership verification
├── config/
│   └── db.js        # MongoDB connection
└── server.js        # App entry point
```

### Frontend Architecture
```
client/src/
├── components/      # Reusable components
│   ├── RatingStars.js (NEW)
│   ├── ReviewCard.js (NEW)
│   ├── ReviewList.js (NEW)
│   ├── ProductComparison.js (NEW)
│   ├── Header.js
│   ├── Footer.js
│   ├── Loading.js
│   ├── Toast.js
│   └── ...
├── pages/           # Page components
│   ├── HomePage.js
│   ├── ProductDetailPage.js
│   ├── CartPage.js
│   ├── OrdersPage.js
│   ├── ManagerDashboard.js
│   └── ...
├── context/         # React Context API
│   ├── AuthContext.js
│   ├── CartContext.js
│   └── WishlistContext.js
├── hooks/           # Custom hooks
│   ├── useProducts.js
│   └── useDebounce.js
├── api/
│   └── axiosConfig.js
└── App.js           # Main app component
```

## 🔑 Key Features Implementation

### 1. Reviews & Ratings System

#### Backend Implementation

**Review Model** (`server/models/Review.js`):
- Lưu trữ reviews với rating (1-5 stars)
- Verified purchase badge
- Helpful votes system
- Seller response capability
- Moderation workflow

**Review Controller** (`server/controllers/reviewController.js`):
- `getProductReviews()`: Lấy reviews với filters (rating, verified, sortBy)
- `createReview()`: Tạo review, check verified purchase
- `markHelpful()`: Toggle helpful vote
- `addSellerResponse()`: Partner reply to reviews
- `moderateReview()`: Admin approve/reject reviews

**Product Rating Update**:
Product model có method `updateRating()` tự động tính average rating và breakdown khi có review mới.

#### Frontend Implementation

**RatingStars Component** (`client/src/components/RatingStars.js`):
```jsx
<RatingStars 
  rating={4.5} 
  reviewCount={120}
  size="medium"
  showNumber={true}
  interactive={false} // true for input
  onRatingChange={(rating) => console.log(rating)}
/>
```

**ReviewCard Component**:
- Hiển thị individual review
- Edit/delete own reviews
- Mark as helpful
- View seller response

**ReviewList Component**:
- Paginated list of reviews
- Filter by rating, verified purchase
- Sort by recent, helpful, rating

### 2. Product Comparison

#### Backend Implementation

**Comparison Model** (`server/models/Comparison.js`):
- Support anonymous users (sessionId) và logged-in users
- Maximum 4 products per comparison
- Public/private comparisons với slug
- View count tracking

**Comparison Controller**:
- `compareProducts()`: Direct comparison without saving
- `saveComparison()`: Save for later with share link
- Helper functions: `buildSpecificationComparison()`, `buildPricingComparison()`

#### Frontend Implementation

**ProductComparison Component**:
- Side-by-side comparison table
- Highlight price differences
- Show all specifications
- Shareable link generation
- Responsive design

**Usage**:
```jsx
<ProductComparison 
  productIds={['id1', 'id2', 'id3']}
  onClose={() => setShowComparison(false)}
/>
```

### 3. Advanced Analytics

#### Backend Implementation

**Analytics Controller** (`server/controllers/analyticsController.js`):

**Dashboard Stats**:
- Total revenue, orders
- Products (total, out of stock, low stock)
- Users by role
- Reviews count & average rating

**Revenue Analytics**:
- Time series data (day/week/month/year)
- Aggregation với MongoDB pipeline
- Average order value

**Best Sellers**:
- Top products by sales volume
- Revenue per product
- Order count

**Customer Analytics**:
- Top customers by spending
- Customer retention rate
- New customers this month

**Fulfillment Metrics**:
- Average processing time
- Average delivery time
- Cancellation rate

#### Frontend Implementation

Create dashboard components với:
- Chart.js or Recharts cho graphs
- Cards cho key metrics
- Tables cho top sellers/customers
- Date range filters

### 4. Enhanced Product Model

**New Fields**:
- Multiple images array
- Detailed specifications (processor gen, RAM type, display refresh rate, etc.)
- Warranty information
- Return policy
- Shipping info
- SEO fields (metaTitle, metaDescription, slug)
- Sales tracking (soldCount, viewCount, wishlistCount)
- Featured & deals flags

**Database Indexes**:
```javascript
// Text search index
ProductSchema.index({ name: 'text', description: 'text', tags: 'text' });

// Compound indexes
ProductSchema.index({ price: 1, brand: 1 });
ProductSchema.index({ soldCount: -1 });
ProductSchema.index({ 'rating.average': -1 });
```

### 5. Enhanced Order Model

**New Features**:
- Auto-generated order number (LP240100001)
- Status history tracking
- Payment status tracking
- Order tracking (carrier, tracking number, dates)
- Billing address separate from shipping
- Coupon/discount support
- Cancellation & return workflow
- Review reminder flag

**Status Flow**:
```
pending → confirmed → processing → shipped → delivered
                ↓
            cancelled / returned / refunded
```

## 🔐 Authentication & Authorization

### JWT Flow
1. User login → Server generates JWT token
2. Token stored in localStorage
3. Frontend sends token in Authorization header
4. Backend verifies token in `auth` middleware
5. User info attached to `req.user`

### Role-based Access
- **client**: Basic user, can order, review
- **partner**: Seller, can manage own products
- **admin**: Full access to all features

**Middleware Usage**:
```javascript
// Require authentication
router.get('/protected', auth, controller);

// Require specific roles
router.post('/admin-only', auth, authorize(['admin']), controller);

// Check ownership
router.put('/products/:id', auth, isOwner, controller);
```

## 🗃️ Database Best Practices

### Indexes
Always add indexes cho:
- Frequently queried fields
- Sort fields
- Foreign keys (ObjectId references)
- Text search fields

### Pagination
```javascript
const page = Number(req.query.page) || 1;
const limit = Number(req.query.limit) || 10;
const skip = (page - 1) * limit;

const results = await Model.find(filter)
  .skip(skip)
  .limit(limit)
  .sort({ createdAt: -1 });

const total = await Model.countDocuments(filter);
const totalPages = Math.ceil(total / limit);
```

### Aggregation Pipeline
Dùng cho complex queries:
```javascript
await Order.aggregate([
  { $match: { status: 'delivered' } },
  { $unwind: '$items' },
  { $group: { 
    _id: '$items.product', 
    totalSold: { $sum: '$items.quantity' }
  }},
  { $sort: { totalSold: -1 } },
  { $limit: 10 }
]);
```

## 🎨 Frontend Best Practices

### Context API Usage
```javascript
// In component
const { user, login, logout } = useContext(AuthContext);
const { cart, addToCart, removeFromCart } = useContext(CartContext);
```

### Custom Hooks
```javascript
// useProducts.js
const { products, loading, error, updateFilter, resetFilters } = useProducts(initialFilters);
```

### Error Handling
```javascript
try {
  const response = await axios.get('/api/products');
  setData(response.data);
} catch (err) {
  const errorMsg = err.response?.data?.message || 'An error occurred';
  toast.error(errorMsg);
  console.error(err);
}
```

### Loading States
Always show loading indicator:
```javascript
if (loading) return <Loading message="Loading..." />;
if (error) return <ErrorMessage error={error} />;
return <YourComponent data={data} />;
```

## 🧪 Testing

### Backend Testing
```bash
# Install testing dependencies
npm install --save-dev jest supertest

# Create test files
__tests__/
  ├── auth.test.js
  ├── products.test.js
  └── reviews.test.js

# Run tests
npm test
```

### Frontend Testing
```bash
# React Testing Library already included

# Create test files
src/components/__tests__/
  ├── RatingStars.test.js
  └── ProductCard.test.js

# Run tests
npm test
```

## 🚀 Deployment Checklist

### Backend
- [ ] Set production environment variables
- [ ] Enable CORS for production domain
- [ ] Add rate limiting
- [ ] Enable compression
- [ ] Add security headers (helmet)
- [ ] Set up logging (winston, morgan)
- [ ] Configure MongoDB replica set
- [ ] Set up backup strategy

### Frontend
- [ ] Build production bundle: `npm run build`
- [ ] Optimize images
- [ ] Add meta tags for SEO
- [ ] Configure CDN
- [ ] Set up error tracking (Sentry)
- [ ] Enable service worker (PWA)
- [ ] Add analytics (Google Analytics)

### DevOps
- [ ] Set up CI/CD pipeline
- [ ] Configure monitoring (PM2, New Relic)
- [ ] Set up SSL/TLS certificates
- [ ] Configure load balancer
- [ ] Set up staging environment

## 📊 Performance Optimization

### Backend
```javascript
// Add compression
const compression = require('compression');
app.use(compression());

// Rate limiting
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use('/api/', limiter);
```

### Frontend
```javascript
// Code splitting
const HomePage = lazy(() => import('./pages/HomePage'));
const ProductPage = lazy(() => import('./pages/ProductPage'));

// Memo expensive computations
const expensiveValue = useMemo(() => computeExpensiveValue(data), [data]);

// Debounce search
const debouncedSearch = useDebounce(searchTerm, 500);
```

## 🐛 Debugging Tips

### Backend
```javascript
// Add detailed logging
console.log('Request:', req.method, req.path);
console.log('Body:', req.body);
console.log('User:', req.user);
console.log('Response:', response.data);
```

### Frontend
```javascript
// Use React DevTools
// Check Context values
// Inspect network requests (Chrome DevTools)
console.log('State:', state);
console.log('Props:', props);
```

## 📚 Additional Resources

- [MongoDB Documentation](https://docs.mongodb.com/)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [React Documentation](https://react.dev/)
- [JWT Best Practices](https://jwt.io/)

---

**Happy Coding! 🚀**
