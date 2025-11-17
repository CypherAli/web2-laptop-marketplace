# 🗄️ MONGODB COMPASS - HƯỚNG DẪN TOÀN DIỆN

## 📊 DANH SÁCH TẤT CẢ COLLECTIONS

**Database:** `laptop-db`

| Collection | Mô Tả | Chức Năng |
|------------|-------|-----------|
| 👥 **users** | Tài khoản người dùng | Client, Partner, Admin |
| 💻 **products** | Sản phẩm laptop | Thông tin, giá, specs |
| 🛒 **carts** | Giỏ hàng | Sản phẩm đang chọn mua |
| 📦 **orders** | Đơn hàng | Lịch sử mua hàng |
| 💳 **payments** | Thanh toán | Giao dịch, hóa đơn |
| ⭐ **reviews** | Đánh giá | Reviews sản phẩm |
| 🔔 **notifications** | Thông báo | Alerts, messages |
| 💬 **chats** | Chat hỗ trợ | Trò chuyện client-partner |
| 🔧 **warranties** | Bảo hành | Quản lý bảo hành |
| 🎫 **vouchers** | Mã giảm giá | Vouchers, coupons |
| 📊 **comparisons** | So sánh | So sánh sản phẩm |
| 🔔 **pricealerts** | Cảnh báo giá | Theo dõi giá |
| 🎟️ **supporttickets** | Ticket hỗ trợ | Yêu cầu support |
| 💬 **messages** | Tin nhắn | Messaging system |
| 🗨️ **conversations** | Cuộc hội thoại | Chat threads |
| 📝 **blogs** | Bài viết | Blog posts |

---

## 🔌 KẾT NỐI

```
Connection String: mongodb://localhost:27017
Database: laptop-db
```

**Các bước:**
1. Mở MongoDB Compass
2. Nhập connection string
3. Click "Connect"
4. Chọn database "laptop-db"
5. Chọn collection muốn xem/sửa

---

## 👥 COLLECTION: USERS

### Schema Chính:
```json
{
  "_id": ObjectId,
  "username": String (unique),
  "email": String (unique),
  "password": String (bcrypt hash),
  "role": "client" | "partner" | "admin",
  "shopName": String (for partner),
  "isApproved": Boolean,
  "isActive": Boolean,
  "phone": String,
  "avatar": String,
  "addresses": Array,
  "preferences": Object,
  "stats": Object,
  "createdAt": Date,
  "updatedAt": Date
}
```

### Thao tác thường dùng:
```javascript
// Tìm user
{ "email": "user@example.com" }

// Duyệt partner
{ "$set": { "isApproved": true } }

// Khóa tài khoản
{ "$set": { "isActive": false } }
```

📖 **Chi tiết:** Xem `USER_SCHEMA_TEMPLATES.md`

---

## 💻 COLLECTION: PRODUCTS

### Schema Chính:
```json
{
  "_id": ObjectId,
  "name": String,
  "brand": String,
  "price": Number,
  "salePrice": Number,
  "category": String,
  "stock": Number,
  "images": [String],
  "specs": {
    "cpu": String,
    "ram": String,
    "storage": String,
    "display": String,
    "gpu": String,
    "battery": String,
    "weight": String,
    "os": String
  },
  "description": String,
  "warranty": Number,
  "seller": ObjectId (ref: User),
  "status": "active" | "out_of_stock" | "discontinued",
  "ratings": {
    "average": Number,
    "count": Number
  },
  "sold": Number,
  "views": Number,
  "featured": Boolean,
  "tags": [String],
  "createdAt": Date,
  "updatedAt": Date
}
```

### Thao tác:

**Thêm sản phẩm mới:**
```json
{
  "name": "Dell XPS 15",
  "brand": "Dell",
  "price": 35000000,
  "salePrice": 32000000,
  "category": "Laptop Gaming",
  "stock": 10,
  "images": ["/uploads/products/dell-xps-15.jpg"],
  "specs": {
    "cpu": "Intel Core i7-12700H",
    "ram": "16GB DDR5",
    "storage": "512GB SSD",
    "display": "15.6 inch FHD",
    "gpu": "NVIDIA RTX 3050",
    "battery": "86Wh",
    "weight": "2.0kg",
    "os": "Windows 11"
  },
  "description": "Laptop gaming mạnh mẽ",
  "warranty": 24,
  "seller": "USER_OBJECT_ID",
  "status": "active",
  "featured": true,
  "tags": ["gaming", "high-performance"]
}
```

**Queries:**
```javascript
// Tìm sản phẩm theo brand
{ "brand": "Dell" }

// Tìm laptop gaming
{ "category": "Laptop Gaming" }

// Tìm sản phẩm giá dưới 20 triệu
{ "price": { "$lt": 20000000 } }

// Tìm sản phẩm hết hàng
{ "stock": 0 }

// Update giá
{ "$set": { "price": 30000000, "salePrice": 28000000 } }

// Tăng stock
{ "$inc": { "stock": 5 } }

// Set featured
{ "$set": { "featured": true } }

// Xóa sản phẩm
{ "_id": ObjectId("...") }
```

---

## 🛒 COLLECTION: CARTS

### Schema:
```json
{
  "_id": ObjectId,
  "user": ObjectId (ref: User),
  "items": [{
    "product": ObjectId (ref: Product),
    "quantity": Number,
    "price": Number,
    "addedAt": Date
  }],
  "totalAmount": Number,
  "updatedAt": Date
}
```

### Thao tác:
```javascript
// Xem giỏ hàng của user
{ "user": ObjectId("USER_ID") }

// Xóa giỏ hàng trống
{ "items": { "$size": 0 } }

// Xóa giỏ hàng cũ (> 30 ngày)
{ "updatedAt": { "$lt": new Date(Date.now() - 30*24*60*60*1000) } }
```

---

## 📦 COLLECTION: ORDERS

### Schema:
```json
{
  "_id": ObjectId,
  "orderNumber": String (unique),
  "user": ObjectId (ref: User),
  "items": [{
    "product": ObjectId,
    "name": String,
    "price": Number,
    "quantity": Number,
    "total": Number
  }],
  "shippingAddress": Object,
  "paymentMethod": String,
  "paymentStatus": "pending" | "paid" | "failed",
  "orderStatus": "pending" | "confirmed" | "shipping" | "delivered" | "cancelled",
  "totalAmount": Number,
  "shippingFee": Number,
  "discount": Number,
  "finalAmount": Number,
  "notes": String,
  "createdAt": Date,
  "updatedAt": Date
}
```

### Thao tác:
```javascript
// Tìm đơn hàng của user
{ "user": ObjectId("USER_ID") }

// Tìm đơn hàng chưa thanh toán
{ "paymentStatus": "pending" }

// Tìm đơn hàng đang giao
{ "orderStatus": "shipping" }

// Update trạng thái
{ "$set": { "orderStatus": "delivered" } }

// Hủy đơn
{ "$set": { "orderStatus": "cancelled" } }

// Xác nhận thanh toán
{ "$set": { "paymentStatus": "paid" } }

// Tìm đơn hàng theo số
{ "orderNumber": "ORD-20251117-0001" }
```

---

## 💳 COLLECTION: PAYMENTS

### Schema:
```json
{
  "_id": ObjectId,
  "order": ObjectId (ref: Order),
  "user": ObjectId (ref: User),
  "amount": Number,
  "method": "COD" | "Bank Transfer" | "Credit Card" | "E-Wallet",
  "status": "pending" | "completed" | "failed" | "refunded",
  "transactionId": String,
  "paymentDate": Date,
  "createdAt": Date
}
```

### Thao tác:
```javascript
// Tìm payment của order
{ "order": ObjectId("ORDER_ID") }

// Tìm payment thành công
{ "status": "completed" }

// Hoàn tiền
{ "$set": { "status": "refunded" } }
```

---

## ⭐ COLLECTION: REVIEWS

### Schema:
```json
{
  "_id": ObjectId,
  "product": ObjectId (ref: Product),
  "user": ObjectId (ref: User),
  "order": ObjectId (ref: Order),
  "rating": Number (1-5),
  "comment": String,
  "images": [String],
  "verified": Boolean,
  "likes": Number,
  "dislikes": Number,
  "helpful": [ObjectId],
  "createdAt": Date,
  "updatedAt": Date
}
```

### Thao tác:
```javascript
// Xem reviews của sản phẩm
{ "product": ObjectId("PRODUCT_ID") }

// Reviews 5 sao
{ "rating": 5 }

// Reviews có hình ảnh
{ "images": { "$ne": [] } }

// Xóa review spam
{ "_id": ObjectId("REVIEW_ID") }

// Approve review
{ "$set": { "verified": true } }
```

---

## 🔧 COLLECTION: WARRANTIES

### Schema:
```json
{
  "_id": ObjectId,
  "serialNumber": String (unique),
  "product": ObjectId (ref: Product),
  "user": ObjectId (ref: User),
  "order": ObjectId (ref: Order),
  "startDate": Date,
  "endDate": Date,
  "status": "active" | "expired" | "claimed" | "void",
  "claims": [{
    "date": Date,
    "issue": String,
    "status": String,
    "notes": String
  }],
  "createdAt": Date
}
```

### Thao tác:
```javascript
// Tìm warranty của user
{ "user": ObjectId("USER_ID") }

// Warranty còn hiệu lực
{ "status": "active", "endDate": { "$gt": new Date() } }

// Warranty hết hạn
{ "endDate": { "$lt": new Date() } }

// Update status
{ "$set": { "status": "expired" } }
```

---

## 🎫 COLLECTION: VOUCHERS

### Schema:
```json
{
  "_id": ObjectId,
  "code": String (unique),
  "type": "percentage" | "fixed",
  "value": Number,
  "minOrderValue": Number,
  "maxDiscount": Number,
  "usageLimit": Number,
  "usedCount": Number,
  "validFrom": Date,
  "validTo": Date,
  "isActive": Boolean,
  "applicableTo": "all" | "specific",
  "products": [ObjectId],
  "categories": [String],
  "createdAt": Date
}
```

### Thao tác:
```javascript
// Thêm voucher mới
{
  "code": "SUMMER2025",
  "type": "percentage",
  "value": 20,
  "minOrderValue": 10000000,
  "maxDiscount": 2000000,
  "usageLimit": 100,
  "usedCount": 0,
  "validFrom": new Date("2025-06-01"),
  "validTo": new Date("2025-08-31"),
  "isActive": true,
  "applicableTo": "all"
}

// Tìm voucher còn hiệu lực
{ 
  "isActive": true,
  "validTo": { "$gt": new Date() },
  "usedCount": { "$lt": "$usageLimit" }
}

// Vô hiệu hóa voucher
{ "$set": { "isActive": false } }
```

---

## 🔔 COLLECTION: NOTIFICATIONS

### Schema:
```json
{
  "_id": ObjectId,
  "user": ObjectId (ref: User),
  "type": "order" | "payment" | "promotion" | "system",
  "title": String,
  "message": String,
  "data": Object,
  "isRead": Boolean,
  "priority": "low" | "medium" | "high",
  "createdAt": Date
}
```

### Thao tác:
```javascript
// Notifications của user
{ "user": ObjectId("USER_ID") }

// Chưa đọc
{ "isRead": false }

// Đánh dấu đã đọc
{ "$set": { "isRead": true } }

// Xóa notifications cũ
{ "createdAt": { "$lt": new Date(Date.now() - 30*24*60*60*1000) } }
```

---

## 🎟️ COLLECTION: SUPPORTTICKETS

### Schema:
```json
{
  "_id": ObjectId,
  "ticketNumber": String (unique),
  "user": ObjectId (ref: User),
  "subject": String,
  "category": "technical" | "order" | "payment" | "other",
  "priority": "low" | "medium" | "high",
  "status": "open" | "in_progress" | "resolved" | "closed",
  "messages": [{
    "sender": ObjectId,
    "senderType": "user" | "admin",
    "message": String,
    "timestamp": Date,
    "attachments": [String]
  }],
  "assignedTo": ObjectId (ref: User),
  "createdAt": Date,
  "updatedAt": Date
}
```

### Thao tác:
```javascript
// Tickets đang mở
{ "status": "open" }

// Tickets ưu tiên cao
{ "priority": "high" }

// Assign ticket
{ "$set": { "assignedTo": ObjectId("ADMIN_ID"), "status": "in_progress" } }

// Đóng ticket
{ "$set": { "status": "closed" } }
```

---

## 💬 COLLECTION: CHATS

### Schema:
```json
{
  "_id": ObjectId,
  "participants": [ObjectId],
  "product": ObjectId (ref: Product),
  "messages": [{
    "sender": ObjectId,
    "message": String,
    "timestamp": Date,
    "read": Boolean,
    "attachments": [String]
  }],
  "lastMessage": String,
  "lastMessageAt": Date,
  "isActive": Boolean,
  "createdAt": Date
}
```

### Thao tác:
```javascript
// Chat của user
{ "participants": ObjectId("USER_ID") }

// Chat về sản phẩm
{ "product": ObjectId("PRODUCT_ID") }

// Xóa chat cũ
{ "lastMessageAt": { "$lt": new Date(Date.now() - 90*24*60*60*1000) } }
```

---

## 📊 COLLECTION: COMPARISONS

### Schema:
```json
{
  "_id": ObjectId,
  "user": ObjectId (ref: User),
  "products": [ObjectId],
  "createdAt": Date
}
```

### Thao tác:
```javascript
// Comparisons của user
{ "user": ObjectId("USER_ID") }

// Xóa comparisons cũ
{ "createdAt": { "$lt": new Date(Date.now() - 7*24*60*60*1000) } }
```

---

## 🔔 COLLECTION: PRICEALERTS

### Schema:
```json
{
  "_id": ObjectId,
  "user": ObjectId (ref: User),
  "product": ObjectId (ref: Product),
  "targetPrice": Number,
  "currentPrice": Number,
  "isActive": Boolean,
  "notified": Boolean,
  "createdAt": Date
}
```

### Thao tác:
```javascript
// Price alerts của user
{ "user": ObjectId("USER_ID") }

// Alerts đang active
{ "isActive": true }

// Vô hiệu hóa alert
{ "$set": { "isActive": false } }
```

---

## 📝 COLLECTION: BLOGS

### Schema:
```json
{
  "_id": ObjectId,
  "title": String,
  "slug": String (unique),
  "content": String,
  "excerpt": String,
  "author": ObjectId (ref: User),
  "category": String,
  "tags": [String],
  "featuredImage": String,
  "status": "draft" | "published",
  "views": Number,
  "publishedAt": Date,
  "createdAt": Date,
  "updatedAt": Date
}
```

### Thao tác:
```javascript
// Published blogs
{ "status": "published" }

// Blogs của author
{ "author": ObjectId("USER_ID") }

// Publish blog
{ "$set": { "status": "published", "publishedAt": new Date() } }
```

---

## 🎯 CÁC QUERY HỮU ÍCH

### Đếm documents
```javascript
// Đếm users
{}  // và click "Options" → "Explain"

// Hoặc dùng Aggregation:
[{ "$count": "total" }]
```

### Xóa hàng loạt
```javascript
// Xóa tất cả giỏ hàng trống
{ "items": { "$size": 0 } }

// Xóa notifications cũ
{ "createdAt": { "$lt": new Date("2025-01-01") } }
```

### Update hàng loạt
```javascript
// Đánh dấu tất cả notifications là đã đọc
Filter: { "user": ObjectId("USER_ID"), "isRead": false }
Update: { "$set": { "isRead": true } }
Options: Update Multiple Documents = true
```

---

## 🛠️ SCRIPTS HỖ TRỢ

```bash
# Tạo password hash
node scripts\generate-hash.js <password>

# Xem tất cả users
node scripts\check-users.js all

# Reset password
node scripts\fix-passwords.js reset <email> <password>
```

---

## ⚠️ LƯU Ý QUAN TRỌNG

1. **BACKUP** trước khi xóa/sửa hàng loạt
2. **ObjectId** phải đúng format khi reference
3. **Dates** phải format ISO: `new Date("2025-11-17")`
4. **Arrays** có thể empty [] nhưng không null
5. **Unique fields**: email, username, code, serialNumber, orderNumber
6. **Indexes**: Không xóa indexes của unique fields

---

## 📚 TÀI LIỆU THAM KHẢO

- `USER_SCHEMA_TEMPLATES.md` - Templates users
- `PRODUCT_SCHEMA_TEMPLATES.md` - Templates products (sẽ tạo)
- `ORDER_SCHEMA_TEMPLATES.md` - Templates orders (sẽ tạo)
- `QUICK_REFERENCE.txt` - Quick reference

---

**✅ Bây giờ bạn có thể quản lý TẤT CẢ dữ liệu trong MongoDB Compass!**
