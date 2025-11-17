# 🚀 QUICK START GUIDE

## ⚡ Khởi động nhanh Laptop Marketplace

### 📋 Prerequisites
- ✅ Node.js >= 14.x
- ✅ MongoDB >= 4.x (hoặc MongoDB Atlas)
- ✅ npm hoặc yarn

---

## 🔧 SETUP (Lần đầu tiên)

### 1. Clone & Install

```bash
# Clone repository
git clone <repository-url>
cd laptop-marketplace

# Install Backend
cd server
npm install

# Install Frontend
cd ../client
npm install
```

### 2. Configure Backend (.env)

Tạo file `server/.env`:

```env
# Database
MONGO_URI=mongodb://localhost:27017/laptop-marketplace
# Hoặc dùng MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/laptop-marketplace

# JWT Secret (change this!)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Server Port
PORT=5000
```

### 3. Seed Data (Optional)

```bash
cd server

# Seed products
node seedProducts.js

# Create test users
node createUsers.js

# Seed blogs (if available)
node seedBlogs.js
```

---

## ▶️ START PROJECT

### Option 1: Manual Start (2 terminals)

**Terminal 1 - Backend:**
```bash
cd server
npm start
# Server sẽ chạy trên http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
cd client
npm start
# App sẽ mở tự động trên http://localhost:3000
```

### Option 2: Using Scripts (Windows)

```bash
# Từ thư mục root
START_ALL.bat
```

Hoặc dùng PowerShell:
```bash
.\start.ps1
```

---

## 🧪 TEST API

### Test Backend API:
```bash
# Health check
curl http://localhost:5000/

# Get products
curl http://localhost:5000/api/products

# Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"123456"}'
```

---

## 📱 ACCESS APPLICATION

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend** | http://localhost:3000 | React App |
| **Backend API** | http://localhost:5000 | Express Server |
| **MongoDB** | mongodb://localhost:27017 | Database |

---

## 👤 TEST ACCOUNTS

Sau khi seed data, bạn có thể login với:

**Admin Account:**
```
Username: admin
Password: admin123
```

**Partner Account:**
```
Username: partner1
Password: partner123
```

**Client Account:**
```
Username: client1
Password: client123
```

---

## 🔥 FEATURES TO TRY

### 🛍️ For Customers:
1. ✅ Browse products với advanced filters
2. ✅ Search products
3. ✅ Compare up to 4 products
4. ✅ View product details & reviews
5. ✅ Add to cart & wishlist
6. ✅ Place orders
7. ✅ Write reviews (after purchase)
8. ✅ Track orders

### 👨‍💼 For Partners:
1. ✅ Login as partner
2. ✅ Add new products
3. ✅ Manage inventory
4. ✅ View sales analytics
5. ✅ Respond to reviews
6. ✅ Process orders

### 👨‍💻 For Admins:
1. ✅ View dashboard analytics
2. ✅ Manage all products
3. ✅ Manage all orders
4. ✅ Moderate reviews
5. ✅ View customer analytics
6. ✅ Monitor low stock

---

## 🐛 TROUBLESHOOTING

### Problem: MongoDB connection error
```bash
# Check if MongoDB is running
# Windows:
services.msc # Look for MongoDB

# Or use MongoDB Atlas cloud database
# Update MONGO_URI in .env
```

### Problem: Port 3000 or 5000 already in use
```bash
# Windows - Kill process on port
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or change port in server/.env (PORT=5001)
# And client/package.json (proxy: "http://localhost:5001")
```

### Problem: JWT token invalid
```bash
# Clear localStorage in browser
localStorage.clear()

# Or logout and login again
```

### Problem: Missing dependencies
```bash
# Reinstall
cd server && npm install
cd ../client && npm install
```

---

## 📊 API ENDPOINTS OVERVIEW

### Public Endpoints (No auth required)
- `GET /api/products` - List products
- `GET /api/products/:id` - Get product
- `GET /api/reviews/product/:id` - Get reviews
- `POST /api/auth/register` - Register
- `POST /api/auth/login` - Login

### Protected Endpoints (Auth required)
- `POST /api/orders` - Create order
- `POST /api/reviews/product/:id` - Write review
- `GET /api/orders` - Get my orders
- `GET /api/reviews/my-reviews` - Get my reviews

### Partner Endpoints (Partner/Admin)
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `POST /api/reviews/:id/response` - Respond to review
- `GET /api/analytics/*` - View analytics

### Admin Endpoints (Admin only)
- `PUT /api/reviews/:id/moderate` - Moderate review
- `GET /api/admin/*` - Admin operations

---

## 📚 DOCUMENTATION

Để biết thêm chi tiết:

1. **README.md** - Overview & installation
2. **DEVELOPER_GUIDE.md** - Technical implementation
3. **FEATURES_SUMMARY.md** - Complete features list
4. **UPGRADE_REPORT.md** - What's new & changes

---

## 🎯 DEVELOPMENT WORKFLOW

### 1. Create Feature Branch
```bash
git checkout -b feature/your-feature-name
```

### 2. Make Changes
- Edit code
- Test locally
- Write tests

### 3. Commit & Push
```bash
git add .
git commit -m "Add: your feature description"
git push origin feature/your-feature-name
```

### 4. Create Pull Request
- Review changes
- Get approval
- Merge to main

---

## 🚢 PRODUCTION DEPLOYMENT

### Backend (Node.js)
```bash
cd server
npm install --production
npm start

# Recommended: Use PM2
npm install -g pm2
pm2 start server.js --name laptop-api
pm2 save
pm2 startup
```

### Frontend (React)
```bash
cd client
npm run build
# Serve the build/ folder với nginx, apache, hoặc static hosting
```

### Environment Variables (Production)
```env
NODE_ENV=production
MONGO_URI=your-production-mongodb-uri
JWT_SECRET=your-strong-secret-key
PORT=5000
```

---

## 🆘 NEED HELP?

1. Check documentation files
2. Read code comments
3. Check browser console for errors
4. Check server logs
5. Open GitHub issue

---

## ✅ CHECKLIST

### Before Starting:
- [ ] Node.js installed
- [ ] MongoDB running (or Atlas URI ready)
- [ ] .env file created
- [ ] Dependencies installed (npm install)

### After Starting:
- [ ] Backend running on port 5000
- [ ] Frontend running on port 3000
- [ ] Can access http://localhost:3000
- [ ] Can login/register
- [ ] Can see products

### Features Working:
- [ ] Product listing & filtering
- [ ] Product comparison
- [ ] Reviews & ratings
- [ ] Shopping cart
- [ ] Checkout process
- [ ] Order tracking
- [ ] Partner dashboard
- [ ] Admin analytics

---

## 🎊 READY TO GO!

Your Laptop Marketplace is now ready! 🚀

Visit: http://localhost:3000

Happy coding! 💻✨

---

**Last Updated:** November 2025  
**Version:** 2.0.0  
**Status:** Production Ready ✅
