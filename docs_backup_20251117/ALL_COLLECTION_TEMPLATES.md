# 📦 ORDER & OTHER COLLECTION TEMPLATES

## 📦 ORDER TEMPLATE

```json
{
  "orderNumber": "ORD-20251117-0001",
  "user": { "$oid": "USER_OBJECT_ID" },
  "items": [
    {
      "product": { "$oid": "PRODUCT_OBJECT_ID" },
      "name": "ASUS ROG Strix G15",
      "price": 32000000,
      "quantity": 1,
      "total": 32000000,
      "specs": {
        "cpu": "AMD Ryzen 7 6800H",
        "ram": "16GB DDR5",
        "storage": "512GB SSD"
      }
    }
  ],
  "shippingAddress": {
    "fullName": "Nguyễn Văn A",
    "phone": "0901234567",
    "street": "123 Nguyễn Huệ",
    "ward": "Phường Bến Nghé",
    "district": "Quận 1",
    "city": "TP. Hồ Chí Minh",
    "zipCode": "700000"
  },
  "paymentMethod": "Bank Transfer",
  "paymentStatus": "pending",
  "orderStatus": "pending",
  "totalAmount": 32000000,
  "shippingFee": 50000,
  "discount": 500000,
  "finalAmount": 31550000,
  "notes": "Giao giờ hành chính",
  "trackingNumber": "",
  "estimatedDelivery": { "$date": "2025-11-20T00:00:00.000Z" },
  "seller": { "$oid": "SELLER_OBJECT_ID" },
  "createdAt": { "$date": "2025-11-17T10:00:00.000Z" }
}
```

---

## 💳 PAYMENT TEMPLATE

```json
{
  "order": { "$oid": "ORDER_OBJECT_ID" },
  "user": { "$oid": "USER_OBJECT_ID" },
  "amount": 31550000,
  "method": "Bank Transfer",
  "status": "pending",
  "transactionId": "TXN202511170001",
  "bankDetails": {
    "bankName": "Vietcombank",
    "accountNumber": "1234567890",
    "accountName": "NGUYEN VAN A",
    "transferCode": "LAPTOP20251117"
  },
  "paymentDate": null,
  "confirmedBy": null,
  "notes": "",
  "createdAt": { "$date": "2025-11-17T10:00:00.000Z" }
}
```

---

## ⭐ REVIEW TEMPLATE

```json
{
  "product": { "$oid": "PRODUCT_OBJECT_ID" },
  "user": { "$oid": "USER_OBJECT_ID" },
  "order": { "$oid": "ORDER_OBJECT_ID" },
  "rating": 5,
  "comment": "Sản phẩm rất tốt, giao hàng nhanh, đóng gói cẩn thận. Hiệu năng laptop mạnh mẽ, chơi game mượt mà.",
  "images": [
    "/uploads/reviews/review-1.jpg",
    "/uploads/reviews/review-2.jpg"
  ],
  "verified": true,
  "likes": 0,
  "dislikes": 0,
  "helpful": [],
  "reply": null,
  "createdAt": { "$date": "2025-11-17T10:00:00.000Z" }
}
```

---

## 🔧 WARRANTY TEMPLATE

```json
{
  "serialNumber": "SN202511170001",
  "product": { "$oid": "PRODUCT_OBJECT_ID" },
  "user": { "$oid": "USER_OBJECT_ID" },
  "order": { "$oid": "ORDER_OBJECT_ID" },
  "productName": "ASUS ROG Strix G15",
  "startDate": { "$date": "2025-11-17T00:00:00.000Z" },
  "endDate": { "$date": "2027-11-17T00:00:00.000Z" },
  "warrantyPeriod": 24,
  "status": "active",
  "claims": [],
  "warrantyCard": "/uploads/warranties/warranty-card-001.pdf",
  "notes": "",
  "createdAt": { "$date": "2025-11-17T10:00:00.000Z" }
}
```

---

## 🎫 VOUCHER TEMPLATE

```json
{
  "code": "BLACKFRIDAY2025",
  "name": "Black Friday Sale",
  "description": "Giảm 30% cho đơn hàng trên 20 triệu",
  "type": "percentage",
  "value": 30,
  "minOrderValue": 20000000,
  "maxDiscount": 5000000,
  "usageLimit": 1000,
  "usedCount": 0,
  "usagePerUser": 1,
  "validFrom": { "$date": "2025-11-20T00:00:00.000Z" },
  "validTo": { "$date": "2025-11-30T23:59:59.999Z" },
  "isActive": true,
  "applicableTo": "all",
  "products": [],
  "categories": [],
  "excludedProducts": [],
  "createdBy": { "$oid": "ADMIN_OBJECT_ID" },
  "createdAt": { "$date": "2025-11-17T10:00:00.000Z" }
}
```

---

## 🔔 NOTIFICATION TEMPLATE

```json
{
  "user": { "$oid": "USER_OBJECT_ID" },
  "type": "order",
  "title": "Đơn hàng đã được xác nhận",
  "message": "Đơn hàng ORD-20251117-0001 của bạn đã được xác nhận và đang được chuẩn bị.",
  "data": {
    "orderId": "ORDER_OBJECT_ID",
    "orderNumber": "ORD-20251117-0001",
    "action": "view_order"
  },
  "isRead": false,
  "priority": "medium",
  "expiresAt": null,
  "createdAt": { "$date": "2025-11-17T10:00:00.000Z" }
}
```

---

## 💬 CHAT TEMPLATE

```json
{
  "participants": [
    { "$oid": "CLIENT_OBJECT_ID" },
    { "$oid": "PARTNER_OBJECT_ID" }
  ],
  "product": { "$oid": "PRODUCT_OBJECT_ID" },
  "messages": [
    {
      "sender": { "$oid": "CLIENT_OBJECT_ID" },
      "message": "Xin chào, sản phẩm này còn hàng không ạ?",
      "timestamp": { "$date": "2025-11-17T10:00:00.000Z" },
      "read": false,
      "attachments": []
    },
    {
      "sender": { "$oid": "PARTNER_OBJECT_ID" },
      "message": "Dạ vẫn còn hàng ạ. Bạn cần tư vấn thêm gì không?",
      "timestamp": { "$date": "2025-11-17T10:05:00.000Z" },
      "read": true,
      "attachments": []
    }
  ],
  "lastMessage": "Dạ vẫn còn hàng ạ. Bạn cần tư vấn thêm gì không?",
  "lastMessageAt": { "$date": "2025-11-17T10:05:00.000Z" },
  "isActive": true,
  "createdAt": { "$date": "2025-11-17T10:00:00.000Z" }
}
```

---

## 🎟️ SUPPORT TICKET TEMPLATE

```json
{
  "ticketNumber": "TKT-20251117-0001",
  "user": { "$oid": "USER_OBJECT_ID" },
  "subject": "Sản phẩm bị lỗi",
  "category": "technical",
  "priority": "high",
  "status": "open",
  "description": "Laptop bị lỗi không bật được màn hình sau 2 ngày sử dụng",
  "messages": [
    {
      "sender": { "$oid": "USER_OBJECT_ID" },
      "senderType": "user",
      "message": "Laptop bị lỗi không bật được màn hình",
      "timestamp": { "$date": "2025-11-17T10:00:00.000Z" },
      "attachments": ["/uploads/tickets/error-image.jpg"]
    }
  ],
  "order": { "$oid": "ORDER_OBJECT_ID" },
  "product": { "$oid": "PRODUCT_OBJECT_ID" },
  "assignedTo": null,
  "resolvedAt": null,
  "resolution": null,
  "createdAt": { "$date": "2025-11-17T10:00:00.000Z" }
}
```

---

## 🔔 PRICE ALERT TEMPLATE

```json
{
  "user": { "$oid": "USER_OBJECT_ID" },
  "product": { "$oid": "PRODUCT_OBJECT_ID" },
  "productName": "ASUS ROG Strix G15",
  "targetPrice": 30000000,
  "currentPrice": 32000000,
  "isActive": true,
  "notified": false,
  "notifiedAt": null,
  "emailSent": false,
  "createdAt": { "$date": "2025-11-17T10:00:00.000Z" }
}
```

---

## 📊 COMPARISON TEMPLATE

```json
{
  "user": { "$oid": "USER_OBJECT_ID" },
  "products": [
    { "$oid": "PRODUCT_1_ID" },
    { "$oid": "PRODUCT_2_ID" },
    { "$oid": "PRODUCT_3_ID" }
  ],
  "productNames": [
    "ASUS ROG Strix G15",
    "MSI Katana 15",
    "Acer Predator Helios 300"
  ],
  "notes": "",
  "createdAt": { "$date": "2025-11-17T10:00:00.000Z" }
}
```

---

## 🛒 CART TEMPLATE

```json
{
  "user": { "$oid": "USER_OBJECT_ID" },
  "items": [
    {
      "product": { "$oid": "PRODUCT_OBJECT_ID" },
      "name": "ASUS ROG Strix G15",
      "price": 32000000,
      "salePrice": 32000000,
      "quantity": 1,
      "image": "/uploads/products/asus-rog-strix-g15-1.jpg",
      "addedAt": { "$date": "2025-11-17T10:00:00.000Z" }
    }
  ],
  "totalAmount": 32000000,
  "totalItems": 1,
  "updatedAt": { "$date": "2025-11-17T10:00:00.000Z" }
}
```

---

## 📝 BLOG POST TEMPLATE

```json
{
  "title": "Top 10 Laptop Gaming Tốt Nhất 2025",
  "slug": "top-10-laptop-gaming-tot-nhat-2025",
  "content": "<p>Nội dung bài viết...</p>",
  "excerpt": "Tổng hợp 10 chiếc laptop gaming được đánh giá cao nhất năm 2025",
  "author": { "$oid": "ADMIN_OBJECT_ID" },
  "category": "Review",
  "tags": ["gaming", "laptop", "review", "2025"],
  "featuredImage": "/uploads/blogs/laptop-gaming-2025.jpg",
  "status": "published",
  "views": 0,
  "likes": 0,
  "comments": [],
  "seo": {
    "metaTitle": "Top 10 Laptop Gaming Tốt Nhất 2025",
    "metaDescription": "Khám phá 10 laptop gaming...",
    "keywords": ["laptop gaming", "gaming 2025"]
  },
  "publishedAt": { "$date": "2025-11-17T10:00:00.000Z" },
  "createdAt": { "$date": "2025-11-17T09:00:00.000Z" },
  "updatedAt": { "$date": "2025-11-17T10:00:00.000Z" }
}
```

---

## 🔄 COMMON UPDATE QUERIES

### Update Order Status
```json
// Filter
{ "orderNumber": "ORD-20251117-0001" }

// Update - Confirm Order
{ "$set": { "orderStatus": "confirmed" } }

// Update - Shipping
{ "$set": { 
  "orderStatus": "shipping",
  "trackingNumber": "VNP123456789"
} }

// Update - Delivered
{ "$set": { 
  "orderStatus": "delivered",
  "deliveredAt": { "$date": "2025-11-20T15:30:00.000Z" }
} }
```

### Update Payment Status
```json
// Filter
{ "order": { "$oid": "ORDER_ID" } }

// Update - Mark as Paid
{ "$set": { 
  "status": "completed",
  "paymentDate": { "$date": "2025-11-17T11:00:00.000Z" },
  "confirmedBy": { "$oid": "ADMIN_ID" }
} }
```

### Assign Support Ticket
```json
// Filter
{ "ticketNumber": "TKT-20251117-0001" }

// Update
{ "$set": { 
  "assignedTo": { "$oid": "ADMIN_ID" },
  "status": "in_progress"
} }
```

### Close Support Ticket
```json
// Update
{ "$set": { 
  "status": "resolved",
  "resolvedAt": { "$date": "2025-11-17T16:00:00.000Z" },
  "resolution": "Đã xử lý và gửi sản phẩm mới cho khách hàng"
} }
```

### Activate/Deactivate Voucher
```json
// Activate
{ "$set": { "isActive": true } }

// Deactivate
{ "$set": { "isActive": false } }

// Increment usage
{ "$inc": { "usedCount": 1 } }
```

### Mark Notifications as Read
```json
// Filter - User's unread notifications
{ "user": { "$oid": "USER_ID" }, "isRead": false }

// Update - Mark all as read
{ "$set": { "isRead": true } }
```

---

## 🗑️ COMMON DELETE QUERIES

### Delete Old Carts (>30 days)
```json
{ "updatedAt": { "$lt": { "$date": "2024-10-17T00:00:00.000Z" } } }
```

### Delete Read Notifications (>30 days)
```json
{
  "isRead": true,
  "createdAt": { "$lt": { "$date": "2024-10-17T00:00:00.000Z" } }
}
```

### Delete Expired Price Alerts
```json
{
  "isActive": false,
  "notified": true,
  "createdAt": { "$lt": { "$date": "2024-10-17T00:00:00.000Z" } }
}
```

### Delete Old Comparisons (>7 days)
```json
{ "createdAt": { "$lt": { "$date": "2025-11-10T00:00:00.000Z" } } }
```

---

## 💡 TIPS & BEST PRACTICES

### ObjectId Format
```json
// Correct
{ "$oid": "6915b1696451579c3df81c1a" }

// Also works in filter
{ "user": ObjectId("6915b1696451579c3df81c1a") }
```

### Date Format
```json
// ISO Date
{ "$date": "2025-11-17T10:00:00.000Z" }

// In queries
{ "createdAt": { "$gte": new Date("2025-11-01") } }
```

### Array Operations
```json
// Add item to array
{ "$push": { "items": { ... } } }

// Remove item from array
{ "$pull": { "items": { "product": ObjectId("...") } } }

// Add to set (no duplicates)
{ "$addToSet": { "tags": "new-tag" } }
```

---

✅ **Tất cả templates đã sẵn sàng để copy vào MongoDB Compass!**
