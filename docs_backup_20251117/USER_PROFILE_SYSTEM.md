# 👤 USER PROFILE SYSTEM - COMPLETE GUIDE

## 🎯 TỔNG QUAN

Hệ thống hồ sơ người dùng hoàn chỉnh cho **TẤT CẢ ROLES** (Client, Partner, Admin) với các tính năng:

✅ Upload avatar từ máy tính  
✅ Chỉnh sửa thông tin cá nhân  
✅ Thay đổi mật khẩu  
✅ Preview ảnh realtime  
✅ Validation đầy đủ  
✅ Responsive design  

---

## 📁 FILES CREATED/MODIFIED

### Frontend:
1. **`client/src/pages/ProfilePage.js`** (400+ lines)
   - Component chính cho trang profile
   - Upload avatar với preview
   - Form chỉnh sửa thông tin
   - Password change functionality

2. **`client/src/pages/ProfilePage.css`** (400+ lines)
   - Professional styling
   - Gradient header với avatar
   - Responsive layout
   - Animation effects

3. **`client/src/App.js`**
   - Added route: `/profile` (protected, all roles)

4. **`client/src/components/Header.js`**
   - Added "👤 Hồ sơ của tôi" link in dropdown menu

### Backend:
5. **`server/controllers/authController.js`**
   - Added `updateProfile` function
   - Handle avatar upload
   - Password change logic
   - Validation

6. **`server/routes/authRoute.js`**
   - Added route: `PUT /api/auth/profile`
   - Integrated multer middleware

7. **`server/middleware/upload.js`** (NEW)
   - Multer configuration
   - File validation (images only, max 5MB)
   - Auto-create uploads directory

8. **`server/server.js`**
   - Serve static files for uploads: `/uploads`

---

## 🎨 FEATURES

### 1. Avatar Upload

**How it works:**
- Click camera icon on avatar
- Choose image from computer
- Preview immediately
- Submit form to save

**Validations:**
- ✅ Only image files (jpeg, jpg, png, gif, webp)
- ✅ Max file size: 5MB
- ✅ Auto-resize/crop (client-side preview)

**File naming:**
```
avatar-{userId}-{timestamp}-{random}.{ext}
Example: avatar-6372b1f8e4a2c1234567890a-1668123456789-123456789.jpg
```

**Storage location:**
```
server/uploads/avatars/
```

**URL served:**
```
http://localhost:5000/uploads/avatars/avatar-xxx.jpg
```

---

### 2. Profile Information

**Editable fields for ALL roles:**
- ✅ Name (Họ và Tên)
- ✅ Username (Tên đăng nhập)
- ✅ Email
- ✅ Phone (Số điện thoại)
- ✅ Address (Địa chỉ)

**Additional for Partner role:**
- ✅ Shop Name (Tên cửa hàng)

**Read-only:**
- Role badge (Admin/Partner/Client)

---

### 3. Password Change

**Optional section:**
- Current Password (required if changing)
- New Password (min 6 chars)
- Confirm Password (must match)

**Logic:**
- All 3 fields must be filled to change password
- Validates current password against database
- New password hashed before saving

---

### 4. Form Validation

**Client-side:**
- Required fields marked with *
- Email format validation
- Password length check
- Password match confirmation
- File type and size validation

**Server-side:**
- Duplicate email/username check
- Current password verification
- Field length validation
- Sanitization (trim whitespace)

---

## 🚀 API ENDPOINT

### `PUT /api/auth/profile`

**Authentication:** Required (JWT token)

**Content-Type:** `multipart/form-data`

**Request Body:**
```javascript
{
  name: "Nguyen Van A",
  username: "nguyenvana",
  email: "email@example.com",
  phone: "0912345678",
  address: "123 Street, City",
  shopName: "My Shop", // Only for partners
  currentPassword: "oldpass123", // Optional
  newPassword: "newpass456", // Optional
  avatar: File // Optional, image file
}
```

**Success Response (200):**
```json
{
  "message": "Cập nhật hồ sơ thành công!",
  "user": {
    "id": "...",
    "name": "Nguyen Van A",
    "username": "nguyenvana",
    "email": "email@example.com",
    "phone": "0912345678",
    "address": "123 Street, City",
    "role": "client",
    "isApproved": true,
    "shopName": "My Shop",
    "avatar": "/uploads/avatars/avatar-xxx.jpg",
    "isActive": true
  }
}
```

**Error Responses:**

**400 - Validation Error:**
```json
{
  "message": "Email đã được sử dụng"
}
```

**400 - Password Error:**
```json
{
  "message": "Mật khẩu hiện tại không đúng"
}
```

**404 - Not Found:**
```json
{
  "message": "Người dùng không tồn tại"
}
```

**500 - Server Error:**
```json
{
  "message": "Lỗi server khi cập nhật hồ sơ",
  "error": "..."
}
```

---

## 💻 FRONTEND CODE STRUCTURE

### ProfilePage Component:

```javascript
// State management
const [avatarPreview, setAvatarPreview] = useState(user?.avatar || '');
const [avatarFile, setAvatarFile] = useState(null);
const [formData, setFormData] = useState({ ... });

// File handling
const handleFileChange = (e) => {
  const file = e.target.files[0];
  // Validate type & size
  // Create preview with FileReader
}

// Form submission
const handleSubmit = async (e) => {
  e.preventDefault();
  const submitData = new FormData();
  // Append all fields
  // Submit to API
  // Update context
}
```

### Key Functions:

**1. Avatar Preview:**
```javascript
const reader = new FileReader();
reader.onloadend = () => {
  setAvatarPreview(reader.result); // Base64 preview
};
reader.readAsDataURL(file);
```

**2. FormData Construction:**
```javascript
const submitData = new FormData();
submitData.append('name', formData.name);
submitData.append('avatar', avatarFile); // Binary file
```

**3. Context Update:**
```javascript
setUser(response.data.user);
localStorage.setItem('user', JSON.stringify(response.data.user));
```

---

## 🎨 UI DESIGN

### Layout:

```
┌─────────────────────────────────────────┐
│         Hồ Sơ Người Dùng               │ ← Header
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  [Avatar]    Nguyen Van A              │ ← Gradient section
│    🎯📷        [Partner Badge]          │
│              Click to upload...         │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  Thông Tin Cá Nhân                     │
│  ─────────────────────────────────────  │
│  [Name Field]    [Username Field]       │
│  [Email Field]   [Phone Field]          │
│  [Address Field]                        │
│  [Shop Name Field] ← Only for partners  │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  Thay Đổi Mật Khẩu (Tùy chọn)          │
│  ─────────────────────────────────────  │
│  [Current Password]                     │
│  [New Password]  [Confirm Password]     │
└─────────────────────────────────────────┘

                [Hủy]  [Lưu Thay Đổi]
```

### Color Scheme:

- **Background:** Gradient (light blue to purple)
- **Avatar Section:** Gradient purple (`#667eea` to `#764ba2`)
- **Cards:** White with shadow
- **Buttons:** Gradient primary, gray cancel
- **Badges:** Role-specific colors (red/blue/green)

---

## 📱 RESPONSIVE

### Desktop (>768px):
- 2-column form layout
- Large avatar (150px)
- Side-by-side action buttons

### Tablet (768px):
- Single column form
- Medium avatar (120px)
- Stacked avatar section

### Mobile (<480px):
- Full width inputs
- Small avatar (100px)
- Full width buttons

---

## 🔐 SECURITY

### File Upload Security:

1. **File Type Validation:**
   - Client: Accept attribute `image/*`
   - Server: Mimetype check + extension check

2. **File Size Limit:**
   - Client: Alert before upload
   - Server: Multer limit (5MB)

3. **Filename Sanitization:**
   - Auto-generated unique names
   - No user input in filename

4. **Storage Location:**
   - Outside public root
   - Served via Express static

### Password Security:

1. **Current Password Verification:**
   - Check with bcrypt before allowing change

2. **New Password Requirements:**
   - Minimum 6 characters
   - Hashed with bcrypt (pre-save hook)

3. **Password Fields:**
   - Type="password" (hidden input)
   - Cleared after successful update

---

## 🧪 TESTING CHECKLIST

### Profile Page:
- [ ] Navigate to `/profile` after login
- [ ] See current user info populated
- [ ] Avatar shows if exists, placeholder if not
- [ ] Role badge displays correct role

### Avatar Upload:
- [ ] Click camera icon opens file picker
- [ ] Select image shows preview immediately
- [ ] X button removes preview
- [ ] Submit uploads and saves avatar
- [ ] Avatar appears in header dropdown

### Information Update:
- [ ] Edit name, save successfully
- [ ] Edit email (unique), save successfully
- [ ] Edit phone, address, save successfully
- [ ] Partner can edit shop name
- [ ] Changes reflect immediately

### Password Change:
- [ ] Leave blank = no change
- [ ] Fill current + new + confirm = change password
- [ ] Wrong current password = error
- [ ] Mismatch confirm = error
- [ ] Short password = error
- [ ] Success = can login with new password

### Validation:
- [ ] Duplicate email = error
- [ ] Duplicate username = error
- [ ] Invalid email format = error
- [ ] Large file (>5MB) = error
- [ ] Non-image file = error

### Responsive:
- [ ] Works on desktop (wide layout)
- [ ] Works on tablet (medium layout)
- [ ] Works on mobile (stacked layout)

---

## 🚀 USAGE

### For Users:

1. **Login** to your account (any role)
2. **Click dropdown** menu (top right, your username)
3. **Select "👤 Hồ sơ của tôi"**
4. **Edit information:**
   - Click avatar to upload new photo
   - Update name, email, phone, address
   - (Partners) Update shop name
   - (Optional) Change password
5. **Click "Lưu Thay Đổi"**
6. **Success!** Your profile is updated

### For Developers:

**Start server with uploads directory:**
```bash
cd server
npm start
# Creates uploads/avatars/ automatically
```

**Access profile page:**
```
http://localhost:3000/profile
```

**Test API endpoint:**
```bash
curl -X PUT http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "name=John Doe" \
  -F "email=john@example.com" \
  -F "avatar=@/path/to/image.jpg"
```

---

## 📊 DATA FLOW

### Profile Update Flow:

```
User fills form
    ↓
Click "Lưu Thay Đổi"
    ↓
Client validation (email format, password match)
    ↓
Create FormData (including file)
    ↓
POST /api/auth/profile with multipart/form-data
    ↓
Server: auth middleware (verify JWT)
    ↓
Server: multer middleware (process file upload)
    ↓
Server: authController.updateProfile
    ↓
Validate fields (unique email/username)
    ↓
Update User model
    ↓
Save avatar path
    ↓
Save to database
    ↓
Return updated user data
    ↓
Client: Update AuthContext
    ↓
Client: Update localStorage
    ↓
Success toast!
```

---

## 🎯 KEY FEATURES SUMMARY

### For All Roles:
- ✅ Upload avatar (drag-drop style)
- ✅ Preview before save
- ✅ Edit name, username, email
- ✅ Add phone, address
- ✅ Change password securely
- ✅ Responsive design
- ✅ Real-time validation

### For Partners:
- ✅ All above features
- ✅ Edit shop name
- ✅ Shop badge visible

### For Admins:
- ✅ All above features
- ✅ Admin badge visible
- ✅ Full control over own profile

---

## 🐛 COMMON ISSUES

### Issue 1: Avatar not showing after upload
**Solution:** Check server uploads directory permissions, ensure static middleware configured

### Issue 2: File too large error
**Solution:** File must be < 5MB, resize image before upload

### Issue 3: Email/username already exists
**Solution:** These must be unique across all users

### Issue 4: Password change not working
**Solution:** Ensure all 3 password fields filled, current password correct

### Issue 5: 404 on avatar URL
**Solution:** Check server static middleware: `app.use('/uploads', express.static(...))`

---

## 📚 DEPENDENCIES ADDED

### Backend:
```json
{
  "multer": "^1.4.5-lts.1"
}
```

Install:
```bash
cd server
npm install multer
```

### Frontend:
No new dependencies (uses existing axios, react-router, etc.)

---

## ✅ COMPLETION STATUS

- ✅ Frontend ProfilePage component
- ✅ Frontend CSS styling
- ✅ Backend API endpoint
- ✅ Multer file upload middleware
- ✅ Static file serving
- ✅ Route protection (all roles)
- ✅ Header dropdown link
- ✅ Validation (client + server)
- ✅ Context integration
- ✅ LocalStorage sync

**EVERYTHING IS READY TO USE!** 🎉

---

**Date:** November 11, 2025  
**Status:** ✅ COMPLETE  
**Access:** Login → Dropdown Menu → "👤 Hồ sơ của tôi"
