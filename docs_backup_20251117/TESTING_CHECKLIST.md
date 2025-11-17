# ✅ CHECKLIST KIỂM TRA UI/UX - LAPTOP MARKETPLACE

## 📋 Trước Khi Test

- [ ] Server đã chạy (port 5000)
- [ ] Client đã chạy (port 3000)
- [ ] Database có dữ liệu
- [ ] Browser đã clear cache
- [ ] DevTools mở sẵn (F12)

---

## 🖼️ MODAL XEM NHANH SẢN PHẨM

### Mở/Đóng Modal
- [ ] Click icon mắt trên card → Modal mở
- [ ] Click nút X → Modal đóng
- [ ] Click nền đen → Modal đóng
- [ ] Nhấn ESC → Modal đóng
- [ ] Body scroll bị lock khi modal mở
- [ ] Backdrop blur hiển thị đúng

### Ảnh & Zoom
- [ ] Ảnh chính hiển thị đúng
- [ ] Loading spinner hiện khi đang tải
- [ ] Hover vào ảnh → Zoom in (scale 2.5x)
- [ ] Click ảnh → Toggle zoom on/off
- [ ] Zoom hint hiển thị khi hover
- [ ] Transform origin theo vị trí chuột

### Thumbnails
- [ ] Thumbnails hiển thị đầy đủ
- [ ] Click thumbnail → Ảnh chính đổi
- [ ] Active thumbnail có border xanh
- [ ] Hover thumbnail → Lift effect
- [ ] Scrollbar custom gradient hiển thị

### Nội Dung
- [ ] Brand name hiển thị
- [ ] Product name đầy đủ
- [ ] Rating stars hiển thị
- [ ] Giá gốc (nếu có)
- [ ] Giá hiện tại đúng
- [ ] Tiết kiệm bao nhiêu (nếu sale)
- [ ] Specs grid đầy đủ (CPU, RAM, Storage, Screen)
- [ ] Description text
- [ ] Features list (nếu có)

### Buttons
- [ ] Nút "Thêm vào giỏ" hoạt động
- [ ] Nút "Xem chi tiết" link đúng
- [ ] Hover buttons → Hiệu ứng đúng

### Responsive
- [ ] Desktop (≥1200px): Layout 2 cột
- [ ] Tablet (≤968px): Layout 1 cột
- [ ] Mobile (≤640px): Modal fullscreen
- [ ] Thumbnails responsive
- [ ] Buttons stack vertical trên mobile

---

## 🔍 FILTER SIDEBAR

### Container & Layout
- [ ] Sidebar width 300px desktop
- [ ] Gradient background hiển thị
- [ ] Top gradient bar animation chạy
- [ ] Box-shadow đa tầng
- [ ] Scrollbar custom gradient

### Header
- [ ] Icon filter animated bounce
- [ ] Title "Tìm kiếm & Lọc" rõ ràng
- [ ] Active filters badge hiển thị số
- [ ] Badge pulse animation

### Search Box
- [ ] Icon search bên trái
- [ ] Placeholder text italic
- [ ] Focus → Border xanh
- [ ] Focus → Icon xoay + phóng to
- [ ] Focus → Box lift (translateY)
- [ ] Nút X clear search hiện khi có text
- [ ] Clear button hoạt động

### Filter Groups
- [ ] Tất cả groups có thể thu gọn/mở
- [ ] Click header → Toggle expand
- [ ] Icon mũi tên xoay khi collapsed
- [ ] Hover header → Hiệu ứng đúng
- [ ] Selected count badge hiển thị

### Brand Filter
- [ ] Checkbox items hiển thị đầy đủ
- [ ] Click checkbox → Check/uncheck
- [ ] Hover item → Lift effect
- [ ] Checked item → Blue gradient background
- [ ] Selected count cập nhật
- [ ] "Xem thêm" button nếu >5 items
- [ ] Show more/less hoạt động

### RAM Filter
- [ ] Tương tự Brand filter
- [ ] Checkbox size 20x20px
- [ ] Touch-friendly (≥44px height)

### CPU Filter
- [ ] Tương tự các filter trên
- [ ] Animation smooth

### Price Range
- [ ] 2 input fields hiển thị
- [ ] Separator "-" ở giữa
- [ ] Focus → Border xanh + ring shadow
- [ ] Placeholder text rõ ràng
- [ ] Nhập số hoạt động

### Sort Select
- [ ] Dropdown hiển thị đúng
- [ ] 4 options: Mới nhất, Giá tăng/giảm, Phổ biến
- [ ] Focus → Border xanh
- [ ] Hover → Background change

### In Stock Checkbox
- [ ] Checkbox size đủ lớn
- [ ] Label rõ ràng
- [ ] Hover → Background + border change
- [ ] Checked → Blue gradient

### Action Buttons
- [ ] **Áp dụng button**:
  - [ ] Gradient background (Indigo→Purple)
  - [ ] Hover → Lift + shadow increase
  - [ ] Hover → Icon rotate 360deg
  - [ ] Active filters count hiển thị
  - [ ] Click → Apply filters

- [ ] **Xóa tất cả button**:
  - [ ] Chỉ hiện khi có filters
  - [ ] Hover → Red background
  - [ ] Hover → Icon rotate 180deg
  - [ ] Click → Clear all filters

### Responsive
- [ ] **Tablet (≤768px)**:
  - [ ] Width 100%
  - [ ] Position relative
  - [ ] Margin bottom 24px

- [ ] **Mobile (≤480px)**:
  - [ ] Padding 16px
  - [ ] Font sizes nhỏ hơn
  - [ ] Min heights giảm
  - [ ] Touch targets ≥44px

---

## 🎴 PRODUCT CARD

### Container
- [ ] Card background gradient
- [ ] Border subtle
- [ ] Box-shadow đa tầng
- [ ] Hover → Lift effect (translateY -8px)
- [ ] Hover → Glow effect xuất hiện
- [ ] Hover → Border color change

### Image Section
- [ ] Background gradient
- [ ] Aspect ratio 5:4
- [ ] Hover → Background color change
- [ ] Image drop-shadow
- [ ] Hover → Shadow enhance

### Badges
- [ ] Sale badge góc trên trái (nếu sale)
- [ ] Discount % hiển thị đúng
- [ ] Sold out badge (nếu hết hàng)
- [ ] Badge animation on appear

### Quick View Button
- [ ] Button ẩn ban đầu
- [ ] Hover card → Button xuất hiện
- [ ] Button góc dưới phải
- [ ] Size 52x52px
- [ ] Border white 3px
- [ ] Icon eye 22px
- [ ] Hover button → Rotate 360deg + scale
- [ ] Click → Mở modal

### Action Buttons
- [ ] **Wishlist button** (góc trên phải):
  - [ ] Icon heart
  - [ ] Click → Toggle active
  - [ ] Active → Red background
  - [ ] Animation heartBeat khi active

- [ ] **Compare button**:
  - [ ] Icon hiển thị
  - [ ] Click → Add to compare

### Product Info
- [ ] **Brand tag**:
  - [ ] Background light blue
  - [ ] Left border 4px blue
  - [ ] Uppercase text
  
- [ ] **Product name**:
  - [ ] 2 lines max
  - [ ] Hover card → Color change
  - [ ] Font-weight 800
  
- [ ] **Description**:
  - [ ] 2 lines max
  - [ ] Color gray

### Price Section
- [ ] Background gradient (light blue)
- [ ] Border subtle
- [ ] Shimmer animation chạy
- [ ] Original price strikethrough (nếu sale)
- [ ] Current price:
  - [ ] Gradient text (blue hoặc red nếu sale)
  - [ ] Font-size 22px
  - [ ] Font-weight 900

### Footer
- [ ] Stock status hiển thị
- [ ] Stock color green
- [ ] **Add to cart button**:
  - [ ] Green gradient
  - [ ] Icon shopping cart
  - [ ] Hover → Lift + shadow
  - [ ] Click → Add to cart
  
- [ ] **Notify button** (nếu hết hàng):
  - [ ] Gray background
  - [ ] Disabled cursor

### Advanced Effects
- [ ] Floating animation khi hover
- [ ] Sparkle ✨ trên price khi hover
- [ ] Gradient shift animation
- [ ] Glow border animation

### Responsive
- [ ] Mobile: Border-radius 16px
- [ ] Mobile: Font sizes nhỏ hơn
- [ ] Mobile: Animations disable
- [ ] Mobile: Quick view 44x44px

---

## 🏠 HOMEPAGE

### Container
- [ ] Max-width 1440px
- [ ] Gradient background
- [ ] Centered layout
- [ ] Flex layout (sidebar + main)

### Products Header
- [ ] Fire icon 🔥 animated
- [ ] Title "Sản Phẩm Nổi Bật"
- [ ] Products count badge
- [ ] Gradient background
- [ ] Box-shadow

### Products Grid
- [ ] Auto-fill responsive
- [ ] Gap 28px
- [ ] Min 300px per card
- [ ] Smooth layout

### Loading State
- [ ] Spinner 60px
- [ ] Spin animation smooth
- [ ] Loading text
- [ ] FadeInOut animation
- [ ] Centered layout

### Empty State
- [ ] Large icon 80px
- [ ] Bounce animation
- [ ] Clear title
- [ ] Description text
- [ ] CTA button
- [ ] Dashed border
- [ ] Click CTA → Action

### Error State
- [ ] Error icon 80px
- [ ] Shake animation
- [ ] Red gradient background
- [ ] Error message
- [ ] Retry button
- [ ] Click retry → Reload

### Pagination
- [ ] Previous button
- [ ] Next button
- [ ] Page info centered
- [ ] Hover → Lift effect
- [ ] Disabled state khi cần
- [ ] Icons animated
- [ ] Gradient buttons

### Scroll to Top
- [ ] Fixed bottom-right
- [ ] Ẩn khi ở trên
- [ ] Hiện khi scroll xuống
- [ ] Circle button 56x56px
- [ ] Border white 3px
- [ ] Gradient background
- [ ] Icon float animation
- [ ] Click → Smooth scroll to top

### Responsive
- [ ] **Desktop (≥1200px)**:
  - [ ] 3-4 columns grid
  - [ ] Sidebar fixed left
  - [ ] Full features

- [ ] **Tablet (≤968px)**:
  - [ ] 2-3 columns grid
  - [ ] Sidebar full width top
  - [ ] Adjusted spacing

- [ ] **Mobile (≤640px)**:
  - [ ] 1 column grid
  - [ ] Sidebar full width
  - [ ] Pagination vertical stack
  - [ ] Compact spacing

---

## ⌨️ KEYBOARD NAVIGATION

- [ ] Tab key → Navigate elements
- [ ] Enter → Activate buttons
- [ ] Space → Toggle checkboxes
- [ ] ESC → Close modal
- [ ] Focus-visible styles hiển thị
- [ ] Tab order logical

---

## ♿ ACCESSIBILITY

- [ ] Color contrast đủ (WCAG AA)
- [ ] Touch targets ≥44x44px
- [ ] Focus indicators rõ ràng
- [ ] ARIA labels đúng (nếu có)
- [ ] Screen reader friendly
- [ ] Keyboard navigation đầy đủ
- [ ] Skip links (nếu có)
- [ ] Alt text cho images

---

## ⚡ PERFORMANCE

- [ ] **Network Tab**:
  - [ ] Images load nhanh
  - [ ] API calls không duplicate
  - [ ] Resources cached đúng

- [ ] **Performance Tab**:
  - [ ] FPS ≥60 khi animate
  - [ ] No layout thrashing
  - [ ] Paint times < 16ms

- [ ] **Lighthouse Score**:
  - [ ] Performance ≥90
  - [ ] Accessibility ≥90
  - [ ] Best Practices ≥90
  - [ ] SEO ≥90

---

## 🌐 BROWSER TESTING

### Desktop Browsers
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

### Mobile Browsers
- [ ] iOS Safari
- [ ] Android Chrome
- [ ] Samsung Internet

### DevTools Testing
- [ ] Responsive mode
- [ ] Device emulation
- [ ] Throttling (Slow 3G)
- [ ] Offline mode
- [ ] Print preview

---

## 📸 VISUAL REGRESSION

- [ ] Screenshots desktop
- [ ] Screenshots tablet
- [ ] Screenshots mobile
- [ ] Compare với design
- [ ] Colors match palette
- [ ] Spacing consistent
- [ ] Fonts render correctly
- [ ] Icons display properly

---

## 🐛 COMMON ISSUES

### Modal Issues
- [ ] Modal không mở → Check product data
- [ ] Backdrop không blur → Check browser support
- [ ] Zoom không work → Check transform support
- [ ] Ảnh không load → Check image URLs

### Filter Issues
- [ ] Filters không apply → Click "Áp dụng"
- [ ] Checkbox không check → Check event handlers
- [ ] API không response → Check network
- [ ] Results không update → Check state management

### Card Issues
- [ ] Animations lag → Check device performance
- [ ] Hover không work → Check pointer events
- [ ] Buttons không click → Check z-index
- [ ] Images bị crop → Check object-fit

### Layout Issues
- [ ] Sidebar overlap → Check z-index
- [ ] Grid break → Check breakpoints
- [ ] Spacing off → Check padding/margin
- [ ] Scroll không smooth → Check CSS

---

## ✅ ACCEPTANCE CRITERIA

### Must Have
- [x] Modal hoạt động 100%
- [x] Filter apply đúng
- [x] Cards render đẹp
- [x] Responsive mọi device
- [x] Performance OK
- [x] No console errors

### Nice to Have
- [ ] A/B test results
- [ ] User feedback positive
- [ ] Analytics tracking
- [ ] Error tracking
- [ ] Performance monitoring

---

## 📝 NOTES

### Đã Test
- [ ] Desktop Chrome: ___/___/2025
- [ ] Mobile iOS: ___/___/2025
- [ ] Tablet iPad: ___/___/2025

### Issues Found
```
[Ghi chú issues tại đây]

1. 
2. 
3. 
```

### Next Steps
```
[Ghi chú next steps]

1. 
2. 
3. 
```

---

## 🎉 SIGN OFF

- [ ] All critical tests passed
- [ ] All browsers tested
- [ ] All devices tested
- [ ] Performance acceptable
- [ ] Accessibility verified
- [ ] Ready for production

**Tester**: ________________  
**Date**: ___/___/2025  
**Status**: PASS / FAIL  

---

**Version**: 2.0.0  
**Last Updated**: 12/11/2025
