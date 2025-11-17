# Hướng Dẫn Sử Dụng Hệ Thống Live Chat

## 🚀 Tổng Quan

Hệ thống Live Chat cho phép người dùng (không cần đăng nhập) chat trực tiếp với các partner thông qua:

- **Tìm kiếm Partner**: Tìm partner theo email
- **Chat Real-time**: Tin nhắn được gửi và nhận ngay lập tức
- **Lưu trữ tin nhắn**: Lịch sử chat được lưu trong database
- **UI thân thiện**: Chat box đẹp và responsive

---

## 🛠 Cài Đặt và Khởi Chạy

### 1. Khởi động Server
```bash
cd server
npm start
# Server chạy trên port 5000 với Socket.IO
```

### 2. Khởi động Client
```bash
cd client
npm start
# Client chạy trên port 3000
```

### 3. Kiểm tra kết nối
- Mở browser và vào `http://localhost:3000`
- Kiểm tra console để thấy kết nối Socket.IO

---

## 🎯 Cách Sử Dụng

### Bước 1: Mở Chat Box
1. Trên trang chủ, nhấp vào icon chat ở góc dưới bên phải
2. Chat box sẽ hiện ra với màn hình tìm kiếm

### Bước 2: Tìm Partner
1. Nhập email của partner muốn chat
2. Nhấn nút tìm kiếm hoặc Enter
3. Chọn partner từ kết quả tìm kiếm

### Bước 3: Bắt Đầu Chat
1. Nhập tin nhắn vào ô chat
2. Nhấn Enter hoặc nút gửi
3. Tin nhắn sẽ hiển thị ngay lập tức

### Bước 4: Tính Năng Khác
- **Minimize**: Thu nhỏ chat box
- **Switch Partner**: Chọn partner khác
- **Close**: Đóng chat box

---

## 🔧 Cấu Trúc File

### Frontend (Client)
```
client/src/components/
├── LiveChat.js          # Component chính
├── LiveChat.css         # Styling cho chat box
└── Toast.js            # Thông báo

client/src/pages/
└── HomePage.js         # Tích hợp LiveChat
```

### Backend (Server)
```
server/
├── models/Chat.js      # Schema lưu tin nhắn
├── routes/chat.js      # API endpoints
└── server.js          # Socket.IO integration
```

---

## 📡 API Endpoints

### Tìm Partner
```
GET /api/partners/search?email=partner@email.com
```

### Gửi Tin Nhắn
```
POST /api/chat/send
{
  "senderId": "user_xxx",
  "senderName": "Khách hàng 123",
  "receiverId": "partner_id",
  "receiverName": "Partner ABC",
  "message": "Xin chào!"
}
```

### Lấy Lịch Sử Chat
```
GET /api/chat/history/:userId/:partnerId
```

### Đánh Dấu Đã Đọc
```
PUT /api/chat/read/:chatRoomId/:userId
```

---

## 🌐 Socket.IO Events

### Client Events
- `user:join` - Tham gia hệ thống chat
- `chat:join` - Tham gia phòng chat cụ thể
- `chat:send` - Gửi tin nhắn real-time
- `chat:typing` - Hiển thị typing indicator

### Server Events  
- `chat:message` - Nhận tin nhắn mới
- `user:online/offline` - Trạng thái online
- `error` - Thông báo lỗi

---

## 🎨 Tùy Chỉnh UI

### CSS Classes
```css
.chat-toggle-btn      /* Nút mở chat */
.chat-window          /* Cửa sổ chat */
.chat-header          /* Header với actions */
.search-step          /* Màn hình tìm partner */
.partner-item         /* Item partner */
.chat-messages        /* Khu vực tin nhắn */
.message.user         /* Tin nhắn của user */
.message.partner      /* Tin nhắn của partner */
.chat-input          /* Input gửi tin nhắn */
```

### Responsive Design
- Mobile: Chat box toàn màn hình
- Desktop: Chat box cố định góc phải
- Tablet: Tương thích tốt

---

## 🔐 Bảo Mật

### Xác Thực
- Người dùng không cần đăng nhập
- Tự động tạo `userId` duy nhất
- Lưu thông tin trong localStorage

### Validation
- Tin nhắn tối đa 2000 ký tự
- Validate email khi tìm partner
- Sanitize input để tránh XSS

---

## 🐛 Debug và Testing

### Kiểm Tra Kết Nối
```javascript
// Mở Console Developer Tools
console.log('Socket connected:', socket.connected);
```

### Test API
```bash
# Test search partner
curl "http://localhost:5000/api/partners/search?email=test@partner.com"

# Test send message
curl -X POST http://localhost:5000/api/chat/send \
  -H "Content-Type: application/json" \
  -d '{"senderId":"user_123","senderName":"Test","receiverId":"partner_456","receiverName":"Partner","message":"Hello"}'
```

### Logs
- Server logs: Terminal chạy `npm start`
- Client logs: Browser Console (F12)
- Socket.IO logs: Enabled trong development

---

## ⚡ Performance

### Tối Ưu Hóa
- Messages được phân trang (50 tin nhắn/page)
- Socket.IO chỉ gửi cho room cụ thể
- Lazy loading cho chat history
- Auto-scroll optimized

### Monitoring
- Track số lượng users online
- Monitor message frequency
- Database indexing cho performance

---

## 🎯 Tính Năng Mở Rộng

### Trong Tương Lai
1. **File Upload**: Gửi hình ảnh, documents
2. **Emoji Reactions**: React tin nhắn bằng emoji  
3. **Voice Messages**: Tin nhắn thoại
4. **Video Call**: Cuộc gọi video
5. **Chatbot**: AI assistant
6. **Push Notifications**: Thông báo real-time
7. **Message Encryption**: Mã hóa tin nhắn
8. **Group Chat**: Chat nhóm với nhiều partners

### Cải Tiến
1. **Better Search**: Tìm kiếm thông minh
2. **Offline Support**: Chat khi offline
3. **Message Status**: Delivered/Read status
4. **Typing Indicator**: Hiển thị đang nhập
5. **Chat Templates**: Tin nhắn mẫu

---

## 💡 Tips và Tricks

### Cho Users
1. Nhập chính xác email partner
2. Kiểm tra kết nối internet
3. Refresh nếu có lỗi kết nối
4. Chat được lưu tự động

### Cho Developers
1. Luôn check socket connection trước khi emit
2. Implement retry logic cho failed messages
3. Use debounce cho typing indicator
4. Optimize re-renders với React.memo

---

## 🤝 Hỗ Trợ

Nếu có vấn đề:
1. Check console logs
2. Verify API endpoints
3. Test socket connection
4. Check database records

---

**🚀 Chúc bạn sử dụng hệ thống Live Chat thành công!**