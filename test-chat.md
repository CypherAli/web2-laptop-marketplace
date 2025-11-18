# Hướng dẫn Test Chat giữa Client và Partner

## Những gì đã sửa:

### 1. **Thêm API lấy danh sách customers cho partner**
- Endpoint: `GET /api/chat/partner/:partnerId/customers`
- File: `server/routes/chat.js`
- Trả về danh sách khách hàng đã chat với partner

### 2. **Cập nhật Socket.IO để gửi tin nhắn cho partner**
- File: `server/server.js`
- Socket giờ emit tin nhắn đến 2 room:
  - `chatRoomId` - cho người đang trong conversation
  - `user:${receiverId}` - cho partner nhận notification

### 3. **Thêm handler `partner:join` trên server**
- File: `server/server.js`
- Partner giờ join vào room `user:${partnerId}` để nhận tin nhắn

### 4. **Thêm Socket.IO vào PartnerChatWidget (Client)**
- File: `client/src/components/chat/PartnerChatWidget.js`
- Client giờ kết nối Socket.IO và emit tin nhắn real-time
- Join chat room khi chọn partner
- Lắng nghe tin nhắn mới

## Cách test:

### Bước 1: Khởi động lại server
```bash
cd e:\laptop-marketplace\server
# Tắt server cũ (Ctrl+C)
node server.js
```

### Bước 2: Khởi động lại client
```bash
cd e:\laptop-marketplace\client
# Tắt client cũ (Ctrl+C)
npm start
```

### Bước 3: Test chat

1. **Đăng nhập partner** (support_partner@laptop.com)
   - Mở tab 1: http://localhost:3001
   - Đăng nhập
   - Click vào dropdown menu → thấy "Customers (0)"
   - Để chat widget mở

2. **Đăng nhập client** (client@laptop.com)
   - Mở tab 2: http://localhost:3001 (incognito hoặc browser khác)
   - Đăng nhập
   - Click nút "Chat Partner" (góc dưới phải)
   - Chọn partner từ danh sách
   - Gửi tin nhắn: "Hello partner!"

3. **Kiểm tra partner nhận tin nhắn**
   - Quay lại tab 1 (partner)
   - Chat widget sẽ update:
     - "Customers (1)" 
     - Hiện tên client trong danh sách
   - Click vào client → xem tin nhắn
   - Trả lời tin nhắn

4. **Kiểm tra client nhận tin nhắn**
   - Quay lại tab 2 (client)
   - Tin nhắn từ partner sẽ hiện ngay lập tức

## Kiểm tra Console logs:

### Client console (F12):
- ✅ Client connected to chat
- 📤 Sending message: {...}
- 📥 Response: {...}
- 📩 Received message: {...}

### Partner console (F12):
- ✅ Partner connected to chat
- 📩 Received message: {...}

### Server console:
- ✅ User {clientId} joined
- ✅ Partner {partnerId} joined and ready to receive messages
- 📨 User joined chat room: {chatRoomId}
- 💬 Message sent: {senderId} -> {receiverId}

## Nếu vẫn không hoạt động:

1. **Xóa cache browser**: Ctrl+Shift+Delete
2. **Kiểm tra database có tin nhắn không**:
```bash
cd e:\laptop-marketplace\server
node -e "const Chat = require('./models/Chat'); const mongoose = require('mongoose'); require('dotenv').config(); mongoose.connect(process.env.MONGO_URI).then(async () => { const msgs = await Chat.find().sort({createdAt: -1}).limit(5); console.log('Recent messages:', msgs); process.exit(); });"
```

3. **Kiểm tra network tab**: Xem có request `/api/chat/send` thành công không

4. **Restart cả server và client** để đảm bảo code mới được load
