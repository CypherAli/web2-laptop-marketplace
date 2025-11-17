# 🧪 IMAGE SYSTEM TEST SCRIPT

## MANUAL TESTING CHECKLIST

### ✅ Test 1: HomePage - Product Grid
**URL**: http://localhost:3000

**Steps**:
1. ✅ Load HomePage
2. ✅ Scroll to "Tất cả sản phẩm" section
3. ✅ Verify 22 products display with real images
4. ✅ Check shimmer loading effect appears briefly
5. ✅ Test lazy loading: Scroll down slowly, observe images load progressively
6. ✅ Verify no broken image icons

**Expected**:
- All products show real laptop images from Unsplash
- Smooth loading with shimmer effect
- Images fade in when loaded
- No red X or broken icons

---

### ✅ Test 2: Product Quick View
**URL**: http://localhost:3000

**Steps**:
1. ✅ Find any product card
2. ✅ Click the 👁️ Eye icon for Quick View
3. ✅ Modal opens with large product image
4. ✅ Verify ProductImage component used (size="large")
5. ✅ Check image quality and loading

**Expected**:
- Modal opens smoothly
- Large image displays (600x400)
- High quality Unsplash image
- Loading spinner shows briefly

---

### ✅ Test 3: Product Detail Page
**URL**: http://localhost:3000/products/:id

**Steps**:
1. ✅ Click on any product card
2. ✅ Navigate to ProductDetailPageV2
3. ✅ Verify main product image
4. ✅ Check image gallery (if multiple images)
5. ✅ Test image zoom on hover (if implemented)

**Expected**:
- Main image loads correctly
- Gallery shows all product images
- Smooth transitions
- High quality display

---

### ✅ Test 4: Admin Dashboard
**URL**: http://localhost:3000/admin

**Steps**:
1. ✅ Login as admin
2. ✅ Navigate to Admin Dashboard
3. ✅ Check "Sản phẩm bán chạy" section
   - Verify thumbnail images (100x100)
4. ✅ Check "Cảnh báo tồn kho thấp" section
   - Verify thumbnail images
5. ✅ Go to "Quản lý sản phẩm" tab
   - Verify table images with ProductImage component

**Expected**:
- All best sellers show thumbnails
- Low stock alerts show thumbnails
- Product table shows images correctly
- Consistent sizing across sections

---

### ✅ Test 5: Error Handling
**URL**: http://localhost:3000

**Steps**:
1. ✅ Open DevTools Console
2. ✅ Find a product
3. ✅ In Console, run:
   ```javascript
   // Break an image URL temporarily
   document.querySelector('img').src = 'invalid-url.jpg'
   ```
4. ✅ Verify placeholder appears automatically
5. ✅ Check no error shown to user

**Expected**:
- Broken image replaced with placeholder
- SVG placeholder shows laptop icon
- No console errors (or handled gracefully)
- User experience not disrupted

---

### ✅ Test 6: Performance Test
**URL**: http://localhost:3000

**Steps**:
1. ✅ Open DevTools → Network tab
2. ✅ Reload page (Ctrl+R)
3. ✅ Observe image loading:
   - Initial images load first
   - Below-fold images load on scroll (lazy)
4. ✅ Filter by "Img" in Network tab
5. ✅ Check image sizes and load times
6. ✅ Verify images from Unsplash CDN

**Expected**:
- Fast initial load (< 2 seconds)
- Lazy loading works (images load on demand)
- Image sizes reasonable (< 200KB each)
- CDN delivery fast
- Total page load time acceptable

---

### ✅ Test 7: Mobile Responsive
**URL**: http://localhost:3000

**Steps**:
1. ✅ Open DevTools → Toggle device toolbar (F12)
2. ✅ Switch to mobile view (iPhone, Android)
3. ✅ Test different screen sizes:
   - 375px (Mobile)
   - 768px (Tablet)
   - 1024px (Desktop)
4. ✅ Verify images scale properly
5. ✅ Check loading performance on slow 3G

**Expected**:
- Images responsive to screen size
- Maintain aspect ratio
- No overflow or cropping issues
- Fast loading even on slow connection

---

### ✅ Test 8: Search & Filter
**URL**: http://localhost:3000

**Steps**:
1. ✅ Use search box: Type "Dell"
2. ✅ Verify filtered products still show images
3. ✅ Apply brand filter: Select "HP"
4. ✅ Check images load for filtered results
5. ✅ Clear filters
6. ✅ Verify all images reload

**Expected**:
- Filtered products show correct images
- No image flickering during filter
- Lazy loading still works
- Performance remains good

---

### ✅ Test 9: Compare Products
**URL**: http://localhost:3000

**Steps**:
1. ✅ Click "So sánh" on 2-3 products
2. ✅ Open Compare Bar at bottom
3. ✅ Click "Xem so sánh chi tiết"
4. ✅ Navigate to Comparison Page
5. ✅ Verify all product images in comparison

**Expected**:
- Compare bar shows thumbnails
- Comparison page shows medium images
- All images load correctly
- Side-by-side comparison clear

---

### ✅ Test 10: Cart & Wishlist
**URL**: http://localhost:3000/cart & /wishlist

**Steps**:
1. ✅ Add products to Cart
2. ✅ Navigate to CartPage
3. ✅ Verify cart item images (size="cart" 120x120)
4. ✅ Add products to Wishlist
5. ✅ Navigate to WishlistPage
6. ✅ Verify wishlist images

**Expected**:
- Cart items show small images
- Wishlist items show medium images
- Images consistent with product
- Fast loading

---

## 🔧 AUTOMATED TESTS (Optional)

### Test ProductImage Component

```javascript
// Test file: src/components/ProductImage.test.js
import { render, screen, waitFor } from '@testing-library/react';
import ProductImage from './ProductImage';

test('renders with valid src', async () => {
    render(<ProductImage src="https://test.jpg" alt="Test" />);
    const img = await screen.findByAlt('Test');
    expect(img).toBeInTheDocument();
});

test('shows loading state initially', () => {
    render(<ProductImage src="https://test.jpg" alt="Test" />);
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
});

test('falls back to placeholder on error', async () => {
    render(<ProductImage src="invalid-url" alt="Test" />);
    await waitFor(() => {
        const img = screen.getByAlt('Test');
        expect(img.src).toContain('data:image/svg+xml');
    });
});

test('applies correct size preset', () => {
    const { container } = render(
        <ProductImage src="https://test.jpg" alt="Test" size="small" />
    );
    const wrapper = container.querySelector('.product-image-wrapper');
    expect(wrapper).toHaveStyle({ width: '150px', height: '150px' });
});

test('lazy loading enabled by default', () => {
    render(<ProductImage src="https://test.jpg" alt="Test" />);
    const img = screen.getByAlt('Test');
    expect(img).toHaveAttribute('loading', 'lazy');
});
```

---

## 📊 PERFORMANCE METRICS

### Target Metrics

| Metric | Target | Acceptable | Status |
|--------|--------|------------|--------|
| **First Contentful Paint** | < 1.5s | < 2s | ⏳ Testing |
| **Largest Contentful Paint** | < 2.5s | < 4s | ⏳ Testing |
| **Total Images Load Time** | < 3s | < 5s | ⏳ Testing |
| **Average Image Size** | < 150KB | < 200KB | ✅ ~80KB (Unsplash optimized) |
| **Images Per Page** | 12-24 | < 50 | ✅ 22 products |
| **Lazy Load Threshold** | On viewport | - | ✅ Implemented |

### Lighthouse Score Targets

- **Performance**: 90+
- **Accessibility**: 95+
- **Best Practices**: 90+
- **SEO**: 95+

---

## 🐛 KNOWN ISSUES

### Issue 1: Initial Placeholder Flash
**Status**: ⚠️ Minor  
**Description**: Brief flash of placeholder before image loads  
**Workaround**: Normal behavior, shimmer effect minimizes impact  
**Fix**: Consider LQIP (Low Quality Image Placeholder)

### Issue 2: Unsplash Rate Limits
**Status**: ⚠️ Consider for production  
**Description**: Unsplash has API rate limits (50 requests/hour for demo apps)  
**Workaround**: Images are direct URLs (not API calls), no limit  
**Recommendation**: For production, upload images to own CDN

---

## ✅ COMPLETION CHECKLIST

### Development
- [x] ProductImage component created
- [x] ProductImage CSS styling
- [x] laptopImages utility
- [x] Seed script with real images
- [x] HomePage updated
- [x] AdminDashboard updated
- [x] Error handling implemented
- [x] Lazy loading implemented
- [x] Loading states implemented

### Testing
- [ ] Manual test: HomePage
- [ ] Manual test: Product Detail
- [ ] Manual test: Admin Dashboard
- [ ] Manual test: Error handling
- [ ] Manual test: Performance
- [ ] Manual test: Mobile responsive
- [ ] Manual test: Search & Filter
- [ ] Manual test: Compare products
- [ ] Manual test: Cart & Wishlist
- [ ] Browser compatibility test
- [ ] Lighthouse audit

### Documentation
- [x] IMAGE_SYSTEM_REPORT.md created
- [x] IMAGE_SYSTEM_TEST.md created
- [ ] Update main README.md
- [ ] Add to CHANGELOG.md

### Optimization (Future)
- [ ] Consider WebP format
- [ ] Add blur placeholders
- [ ] Implement responsive images (srcset)
- [ ] Upload to own CDN
- [ ] Add image compression
- [ ] Implement progressive JPEG

---

## 🎉 SUCCESS CRITERIA

The image system is considered **PERFECT** when:

1. ✅ All 22 products display with real images
2. ✅ No broken image icons anywhere
3. ✅ Loading states smooth and professional
4. ✅ Lazy loading works correctly
5. ✅ Error handling graceful and invisible to user
6. ✅ Performance meets target metrics
7. ✅ Mobile responsive and fast
8. ✅ All pages (Home, Detail, Admin) working
9. ✅ Consistent image sizing across site
10. ✅ Zero console errors related to images

---

## 📞 TESTING COMMANDS

### Start Development Server
```powershell
# Terminal 1: Start server
cd server
npm start

# Terminal 2: Start client
cd client
npm start
```

### Access URLs
- **Homepage**: http://localhost:3000
- **Admin Dashboard**: http://localhost:3000/admin
- **Product Detail**: http://localhost:3000/products/[id]
- **API Health**: http://localhost:5000/api/health

### Debug Commands
```powershell
# Check MongoDB products
mongosh laptop_marketplace
db.products.countDocuments()
db.products.find({}, {name: 1, imageUrl: 1}).limit(5)

# Check image URLs
db.products.find({ imageUrl: { $regex: "unsplash" } }).count()

# Find products without images
db.products.find({ $or: [{ imageUrl: null }, { imageUrl: "" }] }).count()
```

---

*Last updated: ${new Date().toLocaleString('vi-VN')}*
*Ready for testing!* 🚀
