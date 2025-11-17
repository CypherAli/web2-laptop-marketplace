# 📊 REVENUE ANALYTICS API - DOCUMENTATION

## Tính Năng Mới: Revenue by Brand & Revenue by Shop

### 🎯 Mục Đích

1. **Partner** có thể xem doanh thu theo từng **hãng/brand** (Dell, HP, Lenovo...) của sản phẩm mình bán
2. **Admin** có thể xem doanh thu của từng **shop/partner**, so sánh performance các shop

---

## 🔐 PARTNER APIs

### 1. Get Revenue by Brand

**Endpoint**: `GET /api/partner/revenue-by-brand`

**Authentication**: Required (JWT Token)

**Authorization**: Partner role only

**Description**: Partner xem doanh thu theo từng brand của products mình đã bán

**Response Example**:
```json
[
  {
    "brand": "Dell",
    "revenue": 125000000,
    "soldCount": 45,
    "productCount": 8
  },
  {
    "brand": "HP",
    "revenue": 89000000,
    "soldCount": 32,
    "productCount": 5
  },
  {
    "brand": "Lenovo",
    "revenue": 67000000,
    "soldCount": 28,
    "productCount": 6
  }
]
```

**Response Fields**:
- `brand`: Tên hãng (Dell, HP, ASUS, etc.)
- `revenue`: Tổng doanh thu từ brand này (VND)
- `soldCount`: Số lượng sản phẩm đã bán
- `productCount`: Số lượng products thuộc brand này trong kho

**Use Case**:
- Partner biết brand nào bán chạy nhất
- Quyết định nhập thêm hàng brand nào
- So sánh performance giữa các brands

**Postman Test**:
```
GET http://localhost:3001/api/partner/revenue-by-brand
Headers:
  Authorization: Bearer <partner_jwt_token>
```

---

## 👑 ADMIN APIs

### 2. Get Revenue by Shop

**Endpoint**: `GET /api/admin/revenue-by-shop`

**Authentication**: Required (JWT Token)

**Authorization**: Admin role only

**Description**: Admin xem doanh thu của TẤT CẢ partners/shops, so sánh performance

**Response Example**:
```json
[
  {
    "partnerId": "507f1f77bcf86cd799439011",
    "username": "tech_seller",
    "shopName": "Tech Solutions Store",
    "email": "partner1@laptop.com",
    "isApproved": true,
    "revenue": 285000000,
    "soldCount": 120,
    "orderCount": 85,
    "totalProducts": 25,
    "activeProducts": 23,
    "totalStock": 345
  },
  {
    "partnerId": "507f1f77bcf86cd799439012",
    "username": "gaming_hub",
    "shopName": "Gaming Hub",
    "email": "partner2@laptop.com",
    "isApproved": true,
    "revenue": 198000000,
    "soldCount": 87,
    "orderCount": 62,
    "totalProducts": 18,
    "activeProducts": 16,
    "totalStock": 210
  }
]
```

**Response Fields**:
- `partnerId`: ID của partner
- `username`: Tên đăng nhập
- `shopName`: Tên shop
- `email`: Email partner
- `isApproved`: Partner đã được approve chưa
- `revenue`: Tổng doanh thu (VND)
- `soldCount`: Tổng sản phẩm đã bán
- `orderCount`: Số lượng orders chứa products của partner
- `totalProducts`: Tổng số products trong kho
- `activeProducts`: Số products đang active
- `totalStock`: Tổng tồn kho

**Note**: Results are sorted by revenue (highest first)

**Use Case**:
- Admin so sánh performance các partners
- Xác định top performers
- Quyết định approve/disapprove partners
- Phân tích business metrics

**Postman Test**:
```
GET http://localhost:3001/api/admin/revenue-by-shop
Headers:
  Authorization: Bearer <admin_jwt_token>
```

---

### 3. Get Partner Detailed Revenue

**Endpoint**: `GET /api/admin/partners/:partnerId/revenue`

**Authentication**: Required (JWT Token)

**Authorization**: Admin role only

**Description**: Admin xem chi tiết doanh thu của 1 partner cụ thể

**URL Parameters**:
- `partnerId`: ID của partner cần xem

**Response Example**:
```json
{
  "partner": {
    "id": "507f1f77bcf86cd799439011",
    "username": "tech_seller",
    "shopName": "Tech Solutions Store",
    "email": "partner1@laptop.com",
    "isApproved": true
  },
  "summary": {
    "totalRevenue": 285000000,
    "totalSoldCount": 120,
    "totalProducts": 25,
    "activeProducts": 23
  },
  "monthlyRevenue": [
    { "month": "2025-05", "revenue": 45000000 },
    { "month": "2025-06", "revenue": 52000000 },
    { "month": "2025-07", "revenue": 48000000 },
    { "month": "2025-08", "revenue": 55000000 },
    { "month": "2025-09", "revenue": 49000000 },
    { "month": "2025-10", "revenue": 36000000 }
  ],
  "brandRevenue": [
    { "brand": "Dell", "revenue": 125000000 },
    { "brand": "HP", "revenue": 89000000 },
    { "brand": "Lenovo", "revenue": 71000000 }
  ],
  "bestSellers": [
    {
      "name": "Dell XPS 15 9520",
      "brand": "Dell",
      "price": 35990000,
      "soldCount": 45,
      "stock": 8,
      "isActive": true
    },
    {
      "name": "HP Spectre x360 14",
      "brand": "HP",
      "price": 38290000,
      "soldCount": 32,
      "stock": 6,
      "isActive": true
    }
  ]
}
```

**Response Structure**:
- `partner`: Thông tin partner
- `summary`: Tổng quan (total revenue, sold count, products)
- `monthlyRevenue`: Doanh thu 6 tháng gần nhất
- `brandRevenue`: Doanh thu theo từng brand (sorted by revenue)
- `bestSellers`: Top 10 sản phẩm bán chạy nhất

**Use Case**:
- Admin deep-dive vào performance của 1 partner
- Xem trend doanh thu theo tháng
- Phân tích products nào bán chạy
- Hỗ trợ partner tối ưu business

**Postman Test**:
```
GET http://localhost:3001/api/admin/partners/507f1f77bcf86cd799439011/revenue
Headers:
  Authorization: Bearer <admin_jwt_token>
```

---

## 📊 USE CASES & BUSINESS VALUE

### For Partners:

**Revenue by Brand Dashboard**:
```
╔═══════════════════════════════════════╗
║     MY REVENUE BY BRAND               ║
╠═══════════════════════════════════════╣
║                                       ║
║  📊 Dell                              ║
║     Revenue: 125,000,000 VND          ║
║     Sold: 45 units | Products: 8     ║
║     ████████████████░░░░ 43%          ║
║                                       ║
║  📊 HP                                ║
║     Revenue: 89,000,000 VND           ║
║     Sold: 32 units | Products: 5     ║
║     ████████████░░░░░░░░ 31%          ║
║                                       ║
║  📊 Lenovo                            ║
║     Revenue: 71,000,000 VND           ║
║     Sold: 28 units | Products: 6     ║
║     ██████████░░░░░░░░░░ 26%          ║
║                                       ║
╚═══════════════════════════════════════╝

Insights:
✅ Dell is your best performer
💡 Consider stocking more Dell products
⚠️ Lenovo has good product count but lower sales
```

### For Admin:

**Shop Performance Comparison**:
```
╔════════════════════════════════════════════════════════╗
║           TOP PERFORMING SHOPS                         ║
╠════════════════════════════════════════════════════════╣
║                                                        ║
║  🥇 Tech Solutions Store                              ║
║      Revenue: 285M VND | Orders: 85 | Products: 25   ║
║      Partner: tech_seller | ✅ Approved               ║
║                                                        ║
║  🥈 Gaming Hub                                        ║
║      Revenue: 198M VND | Orders: 62 | Products: 18   ║
║      Partner: gaming_hub | ✅ Approved                ║
║                                                        ║
║  🥉 Laptop Pro Store                                  ║
║      Revenue: 142M VND | Orders: 45 | Products: 15   ║
║      Partner: laptop_pro | ⏳ Pending Approval        ║
║                                                        ║
╚════════════════════════════════════════════════════════╝

Actions:
✅ Approve high-performing pending partners
📧 Contact low performers for support
📊 Analyze why top shops succeed
```

---

## 🔄 API FLOW

### Partner Flow:
```
1. Partner Login
   POST /api/auth/login
   → Get JWT token

2. View My Products
   GET /api/partner/my-products
   → See all my products

3. View Overall Stats
   GET /api/partner/stats
   → Total revenue, best sellers

4. View Revenue by Month
   GET /api/partner/revenue
   → 6-month trend chart

5. View Revenue by Brand ⭐ NEW
   GET /api/partner/revenue-by-brand
   → Which brands earn most
```

### Admin Flow:
```
1. Admin Login
   POST /api/auth/login
   → Get JWT token

2. View System Stats
   GET /api/admin/stats
   → Overview of entire system

3. View All Shops Performance ⭐ NEW
   GET /api/admin/revenue-by-shop
   → Compare all partners

4. Deep Dive One Shop ⭐ NEW
   GET /api/admin/partners/:id/revenue
   → Detailed analysis of one partner
   
5. Approve/Disapprove Partner
   PUT /api/admin/users/:id
   → Change isApproved status
```

---

## 🧪 TESTING CHECKLIST

### Partner Tests:
- [ ] Login as partner1
- [ ] Call GET /api/partner/revenue-by-brand
- [ ] Verify only seeing own products' brands
- [ ] Verify revenue calculation is correct
- [ ] Verify soldCount matches orders
- [ ] Try as partner2, see different results

### Admin Tests:
- [ ] Login as admin
- [ ] Call GET /api/admin/revenue-by-shop
- [ ] Verify seeing ALL partners
- [ ] Verify sorting by revenue (desc)
- [ ] Call GET /api/admin/partners/:partnerId/revenue
- [ ] Verify monthly revenue chart
- [ ] Verify brand breakdown
- [ ] Verify best sellers list

### Security Tests:
- [ ] Partner cannot access admin endpoints (403)
- [ ] Admin can access both partner & admin endpoints
- [ ] Client cannot access either (403)
- [ ] Unauthenticated requests rejected (401)

---

## 📈 FUTURE ENHANCEMENTS

1. **Time Range Filter**:
   - Add `?startDate=2025-01-01&endDate=2025-12-31` query params
   - Partner can view custom date ranges

2. **Export to CSV/Excel**:
   - Add `?format=csv` to download reports
   - Partner can export revenue data

3. **Real-time Updates**:
   - WebSocket notifications when new orders come in
   - Live revenue counter

4. **Comparison Tool**:
   - Partner compare current month vs last month
   - Admin compare partner vs partner

5. **Forecasting**:
   - Predict next month revenue based on trend
   - Suggest optimal stock levels

---

## 🎯 SUMMARY

### New Endpoints Added:

| Endpoint | Method | Role | Purpose |
|----------|--------|------|---------|
| `/api/partner/revenue-by-brand` | GET | Partner | View revenue by brand |
| `/api/admin/revenue-by-shop` | GET | Admin | View all shops performance |
| `/api/admin/partners/:id/revenue` | GET | Admin | View one shop detailed analytics |

### Data Insights Provided:

**For Partners**:
- Which brands earn most money
- Which brands sell most units
- Product count per brand
- Make data-driven stocking decisions

**For Admin**:
- Top performing shops
- Compare partners side-by-side
- Identify struggling partners
- Revenue trends by shop
- Individual shop deep-dive (monthly, brand, best sellers)

**Business Value**: Partners optimize inventory, Admin supports ecosystem growth! 🚀
