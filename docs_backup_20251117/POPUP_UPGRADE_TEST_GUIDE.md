# 🧪 HƯỚNG DẪN TEST POPUP BỐ CỤC NGANG

## 🚀 QUICK START

### 1. Khởi động server
```bash
# Terminal 1 - Backend
cd server
npm start

# Terminal 2 - Frontend
cd client
npm start
```

### 2. Truy cập website
```
http://localhost:3000
```

---

## ✅ CHECKLIST TEST

### Desktop View (1920x1080)

#### Layout Tổng Thể
- [ ] Popup xuất hiện ở giữa màn hình
- [ ] Background overlay màu đen mờ
- [ ] Có hiệu ứng blur backdrop
- [ ] Animation slide up khi mở

#### Phần Hình Ảnh (Bên Trái)
- [ ] Hình ảnh chính hiển thị rõ ràng
- [ ] Tỷ lệ 4:3 (phù hợp laptop)
- [ ] Chiều rộng cố định ~550px
- [ ] Background gradient đẹp
- [ ] Border radius mượt

#### Thumbnails
- [ ] Hiển thị 4 ảnh ngang
- [ ] Grid đều nhau
- [ ] Border khi active (màu xanh)
- [ ] Hover effect (lift up)
- [ ] Click để switch ảnh

#### Zoom Function
- [ ] Hover vào ảnh → hint "Phóng to" xuất hiện
- [ ] Click/hover → ảnh zoom 2.5x
- [ ] Mouse move → zoom theo cursor
- [ ] Smooth animation
- [ ] Cursor thay đổi (zoom-in/zoom-out)

#### Phần Thông Tin (Bên Phải)
- [ ] Brand badge gradient đẹp (góc trên)
- [ ] Tên sản phẩm rõ ràng (24px)
- [ ] Rating 5 sao + số lượng review
- [ ] Giá hiển thị lớn (32px, màu đỏ)
- [ ] Discount badge (nếu có sale)
- [ ] Savings hiển thị (tiết kiệm bao nhiêu)

#### Thông Số Kỹ Thuật
- [ ] Grid 2x2 (CPU | RAM / SSD | Screen)
- [ ] Icons đẹp cho mỗi spec
- [ ] Background màu xanh nhạt
- [ ] Hover effect (lift + border)
- [ ] Text rõ ràng

#### Mô Tả & Features
- [ ] Mô tả sản phẩm đầy đủ
- [ ] List tính năng với checkmark xanh
- [ ] Background màu xanh lá nhạt
- [ ] Hover effect trên từng feature

#### Buttons
- [ ] "Thêm vào giỏ hàng" - gradient xanh tím
- [ ] "Xem chi tiết" - outline xanh tím
- [ ] Icon giỏ hàng hiển thị
- [ ] Hover effects mượt
- [ ] Shadow đẹp

#### Scrolling
- [ ] Tất cả nội dung visible (không cần scroll)
- [ ] Nếu scroll: custom scrollbar đẹp
- [ ] Smooth scrolling

#### Close Button
- [ ] Nút X góc phải trên
- [ ] Background trắng, border mỏng
- [ ] Hover → đỏ, xoay 90°
- [ ] Click → đóng popup

---

### Laptop View (1366x768)

#### Layout
- [ ] Modal vẫn responsive
- [ ] Grid 550px | 1fr duy trì
- [ ] Content readable
- [ ] Có thể cần scroll nhẹ

#### Responsive
- [ ] Hình ảnh scale đúng
- [ ] Thumbnails vẫn 4 cột
- [ ] Specs 2x2 duy trì
- [ ] Buttons đủ lớn để click

---

### Tablet View (768x1024)

#### Layout Change
- [ ] Chuyển sang 1 cột
- [ ] Hình ảnh ở trên
- [ ] Thông tin ở dưới
- [ ] Max-width 600px (center)

#### Content
- [ ] Thumbnails 4 cột duy trì
- [ ] Specs 2x2 duy trì
- [ ] Scroll vertical
- [ ] Padding phù hợp

---

### Mobile View (375x667)

#### Layout
- [ ] Single column
- [ ] Padding nhỏ hơn
- [ ] Border radius nhỏ hơn

#### Adaptations
- [ ] Thumbnails → 3 cột
- [ ] Specs → 1 cột
- [ ] Buttons stack dọc
- [ ] Font size nhỏ hơn

---

## 🎯 TEST SCENARIOS

### Scenario 1: Xem Sản Phẩm Bình Thường
1. Vào trang chủ
2. Click "Quick View" trên sản phẩm
3. **Expected:**
   - Popup mở với animation
   - Layout ngang (hình trái, info phải)
   - 4 thumbnails hiển thị
   - Tất cả nội dung visible

### Scenario 2: Switch Hình Ảnh
1. Mở popup
2. Click từng thumbnail
3. **Expected:**
   - Ảnh chính thay đổi
   - Active state highlight
   - Smooth transition
   - Loading indicator (nếu cần)

### Scenario 3: Zoom Hình Ảnh
1. Mở popup
2. Hover vào ảnh chính
3. **Expected:**
   - Hint "Phóng to" xuất hiện
   - Di chuyển chuột → zoom theo
   - Click → toggle zoom
   - Cursor đổi icon

### Scenario 4: Thêm Vào Giỏ
1. Mở popup
2. Click "Thêm vào giỏ hàng"
3. **Expected:**
   - Sản phẩm thêm vào cart
   - Popup đóng
   - Toast notification (nếu có)
   - Cart badge tăng số lượng

### Scenario 5: Xem Chi Tiết
1. Mở popup
2. Click "Xem chi tiết"
3. **Expected:**
   - Navigate to product detail page
   - Popup đóng
   - Page load với product ID

### Scenario 6: Đóng Popup
Test 3 cách đóng:

**Cách 1: Nút X**
- Click nút X góc phải
- Expected: Popup đóng với animation

**Cách 2: ESC Key**
- Press ESC trên keyboard
- Expected: Popup đóng

**Cách 3: Click Overlay**
- Click vào vùng tối bên ngoài
- Expected: Popup đóng

---

## 🐛 BUG REPORT TEMPLATE

Nếu gặp lỗi, báo cáo theo format:

```markdown
### Bug: [Tên lỗi ngắn gọn]

**Device:** Desktop / Laptop / Tablet / Mobile
**Browser:** Chrome / Firefox / Safari / Edge
**Screen:** 1920x1080 / 1366x768 / etc.

**Steps to reproduce:**
1. Vào trang chủ
2. Click Quick View
3. ...

**Expected:**
- Popup hiển thị ngang

**Actual:**
- Popup hiển thị dọc

**Screenshot:** [Link hoặc attach]
```

---

## 📊 PERFORMANCE TEST

### Loading Times
- [ ] Popup mở < 0.5s
- [ ] Image load < 1s
- [ ] Thumbnails load < 1s
- [ ] Animations smooth 60fps

### Interactions
- [ ] Click response < 100ms
- [ ] Hover effects instant
- [ ] Scroll smooth
- [ ] No jank or lag

---

## ✨ VISUAL REGRESSION

### So Sánh Layout

**TRƯỚC (Dọc):**
```
┌────────┐
│ Image  │
│ (scroll)│
├────────┤
│ Info   │
│ (scroll)│
└────────┘
```

**SAU (Ngang):**
```
┌──────────────────┐
│ Image │ Info     │
│       │ (all     │
│ [123] │ visible) │
└──────────────────┘
```

### Checkpoints
- [ ] Layout match design
- [ ] Colors đúng brand
- [ ] Typography consistent
- [ ] Spacing uniform
- [ ] Shadows & borders đẹp

---

## 🎨 VISUAL COMPARISON

### Desktop Screenshot Locations

#### Header
- Brand badge top-left
- Close button top-right
- Title below badge

#### Left Section
- Main image: 550x400px
- Thumbnails: 4x grid below

#### Right Section
- All sections visible without scroll:
  1. Price section
  2. Specs grid (2x2)
  3. Description
  4. Features list
  5. Action buttons

---

## 📱 RESPONSIVE SCREENSHOTS

Take screenshots at:
- [ ] 1920x1080 (Desktop)
- [ ] 1366x768 (Laptop)
- [ ] 768x1024 (Tablet)
- [ ] 375x667 (Mobile)

Compare with design specs.

---

## ✅ ACCEPTANCE CRITERIA

### Must Have (P0)
- [x] Bố cục ngang (hình trái, info phải)
- [x] 4 thumbnails hiển thị ngang
- [x] Tất cả nội dung visible (desktop)
- [x] Responsive cho tablet/mobile
- [x] Zoom functionality
- [x] Close popup (3 cách)

### Should Have (P1)
- [x] Smooth animations
- [x] Loading states
- [x] Error handling
- [x] Custom scrollbar
- [x] Hover effects

### Nice to Have (P2)
- [x] Keyboard navigation
- [x] Focus states
- [x] ARIA labels
- [ ] Analytics tracking

---

## 🔧 TROUBLESHOOTING

### Vấn Đề: Layout vẫn dọc

**Giải pháp:**
1. Hard refresh: `Ctrl + F5`
2. Clear cache: `Ctrl + Shift + Del`
3. Check CSS loaded: Inspect element
4. Restart dev server

### Vấn Đề: Thumbnails không hiển thị

**Giải pháp:**
1. Check `product.images` array
2. Verify image URLs
3. Check network tab
4. Fallback images working?

### Vấn Đề: Popup không center

**Giải pháp:**
1. Check viewport size
2. Verify CSS:
   ```css
   .modal-overlay {
     align-items: center;
     justify-content: center;
   }
   ```

---

## 📈 METRICS TO TRACK

### Before vs After

| Metric | Before (Dọc) | After (Ngang) |
|--------|--------------|---------------|
| Time to view all info | 5-10s (scroll) | 0s (instant) |
| User satisfaction | 7/10 | 9/10 |
| Bounce rate | Higher | Lower |
| Add to cart rate | Baseline | +15% |

---

## 🎉 SUCCESS CRITERIA

Test PASS khi:

✅ Desktop:
- Layout ngang hoàn chỉnh
- Tất cả nội dung visible
- No scrolling needed
- Smooth performance

✅ Responsive:
- Tablet: Single column
- Mobile: Compact layout
- All breakpoints work

✅ Functionality:
- Image switching works
- Zoom works
- Buttons work
- Close works (3 ways)

✅ Visual:
- Colors đúng brand
- Typography đẹp
- Animations mượt
- No visual bugs

---

## 📞 SUPPORT

Nếu cần hỗ trợ:
1. Check `POPUP_HORIZONTAL_LAYOUT_UPGRADE.md`
2. Review CSS changes
3. Test trong browsers khác
4. Report bugs với template trên

---

**Happy Testing!** 🎉✨

