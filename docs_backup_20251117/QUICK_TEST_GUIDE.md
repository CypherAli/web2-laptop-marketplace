# 🧪 CHECKLIST TESTING - THÔNG SỐ KỸ THUẬT CHÍNH XÁC

## 📋 CÁC BƯỚC KIỂM TRA

### ✅ BƯỚC 1: Kiểm Tra Database
```bash
cd server
node -e "require('dotenv').config(); const mongoose = require('mongoose'); const Product = require('./models/Product'); mongoose.connect(process.env.MONGO_URI).then(async () => { const count = await Product.countDocuments(); console.log('Total products:', count); const sample = await Product.findOne().lean(); console.log('Sample specs:', sample.specifications); process.exit(0); });"
```

**Kết quả mong đợi:**
- [x] Total products: 22 ✅
- [x] Sample specs có đầy đủ processor, ram, storage, display, graphics, operatingSystem, weight, battery ✅

---

### ✅ BƯỚC 2: Test QuickView Modal Trên Browser

#### 2.1. Test Product Dell XPS 13 9310
1. Mở `http://localhost:3000`
2. Tìm sản phẩm **Dell XPS 13 9310**
3. Click nút **"Quick View"** 👁️
4. Kiểm tra thông số:

**Thông số kỹ thuật:**
- [ ] CPU: Intel Core i7-1165G7 ✓
- [ ] RAM: 16GB LPDDR4x ✓
- [ ] Ổ cứng: 512GB NVMe SSD ✓
- [ ] Màn hình: 13.4" FHD+ (1920x1200) ✓
- [ ] Card đồ họa: Intel Iris Xe Graphics ✓
- [ ] Hệ điều hành: Windows 11 Pro ✓
- [ ] Trọng lượng: 1.2kg ✓
- [ ] Pin: 52Wh, ~10 giờ ✓

**Mô tả sản phẩm:**
- [ ] Có hiển thị mô tả chi tiết ✓

**Điểm nổi bật:**
- [ ] Thiết kế siêu mỏng nhẹ, dễ dàng mang theo ✓
- [ ] Pin sử dụng cả ngày làm việc ✓
- [ ] Màn hình sắc nét, độ phân giải cao ✓
- [ ] Bàn phím có đèn nền tiện lợi ✓
- [ ] Sạc nhanh, đầy 50% trong 30 phút ✓

---

## 🎯 TEST NGAY

### Quick Test Command
```bash
# Test Dell XPS
cd server
node -e "require('dotenv').config(); const mongoose = require('mongoose'); const Product = require('./models/Product'); mongoose.connect(process.env.MONGO_URI).then(async () => { const p = await Product.findOne({name: 'Dell XPS 13 9310'}).lean(); console.log('CPU:', p.specifications.processor); console.log('RAM:', p.specifications.ram); console.log('Storage:', p.specifications.storage); console.log('Display:', p.specifications.display); console.log('Graphics:', p.specifications.graphics); console.log('OS:', p.specifications.operatingSystem); console.log('Weight:', p.specifications.weight); console.log('Battery:', p.specifications.battery); process.exit(0); });"
```

---

**Version:** 2.2.0  
**Last Updated:** 14/11/2025  
**Status:** ✅ READY FOR TESTING
