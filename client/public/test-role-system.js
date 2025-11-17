// TEST SCRIPT - Chạy trong Browser Console (F12)
// Copy và paste vào console để test tự động

console.log('🧪 BẮT ĐẦU TEST HỆ THỐNG ROLE...\n');

// ============================================
// 1. TEST BADGE DISPLAY
// ============================================
console.log('📍 1. Kiểm tra Badge Display');

function checkBadge() {
    const roleLayout = document.querySelector('.role-based-layout');
    if (!roleLayout) {
        console.error('❌ Không tìm thấy RoleBasedLayout');
        return;
    }
    
    const className = roleLayout.className;
    const badge = window.getComputedStyle(roleLayout, '::before').content;
    
    console.log('  - Theme class:', className);
    console.log('  - Badge content:', badge);
    
    if (className.includes('theme-client')) {
        if (badge === '"🛒"' || badge === "'🛒'") {
            console.log('  ✅ Client badge đúng (chỉ có icon, không có text)');
        } else {
            console.error('  ❌ Client badge SAI:', badge);
            console.error('     Mong đợi: "🛒"');
            console.error('     Thực tế:', badge);
        }
    } else if (className.includes('theme-partner')) {
        console.log('  ✅ Partner badge hiển thị');
    } else if (className.includes('theme-admin')) {
        console.log('  ✅ Admin badge hiển thị');
    } else if (className.includes('theme-guest')) {
        console.log('  ℹ️ Guest - không có badge');
    }
}

checkBadge();

// ============================================
// 2. TEST LOCAL STORAGE TOKEN
// ============================================
console.log('\n📍 2. Kiểm tra Token trong LocalStorage');

function checkToken() {
    const token = localStorage.getItem('token');
    
    if (!token) {
        console.log('  ℹ️ Chưa đăng nhập (không có token)');
        return null;
    }
    
    try {
        // Decode JWT (simple base64 decode)
        const payload = JSON.parse(atob(token.split('.')[1]));
        console.log('  ✅ Token hợp lệ');
        console.log('  - User ID:', payload.id);
        console.log('  - Username:', payload.username);
        console.log('  - Role:', payload.role);
        console.log('  - Email:', payload.email);
        
        // Check expiration
        const now = Date.now() / 1000;
        if (payload.exp < now) {
            console.error('  ❌ Token đã HẾT HẠN!');
            console.error('     Expired at:', new Date(payload.exp * 1000));
        } else {
            const remainingTime = Math.floor((payload.exp - now) / 60);
            console.log(`  ✅ Token còn hạn: ${remainingTime} phút`);
        }
        
        return payload;
    } catch (error) {
        console.error('  ❌ Token không hợp lệ:', error.message);
        return null;
    }
}

const userData = checkToken();

// ============================================
// 3. TEST API AUTHORIZATION
// ============================================
console.log('\n📍 3. Test API Authorization');

async function testAPI() {
    const token = localStorage.getItem('token');
    
    if (!token) {
        console.log('  ⚠️ Bỏ qua (chưa đăng nhập)');
        return;
    }
    
    // Test user profile API (should work for all authenticated users)
    try {
        const response = await fetch('http://localhost:5000/api/users/profile', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.ok) {
            console.log('  ✅ API /users/profile: OK');
        } else {
            console.error(`  ❌ API /users/profile: ${response.status} ${response.statusText}`);
        }
    } catch (error) {
        console.error('  ❌ API Error:', error.message);
    }
}

testAPI();

// ============================================
// 4. TEST HEADER MENU
// ============================================
console.log('\n📍 4. Kiểm tra Header Menu theo Role');

function checkHeaderMenu() {
    const userMenu = document.querySelector('.user-menu');
    const dropdown = document.querySelector('.user-dropdown');
    
    if (!userMenu) {
        console.log('  ℹ️ Chưa đăng nhập (không có user menu)');
        return;
    }
    
    console.log('  ✅ User menu hiển thị');
    
    if (dropdown) {
        const items = Array.from(dropdown.querySelectorAll('.dropdown-item')).map(
            item => item.textContent.trim()
        );
        console.log('  - Menu items:', items);
        
        if (userData) {
            // Check expected menu items based on role
            const expectedItems = {
                'client': ['Hồ sơ của tôi', 'Đơn hàng của tôi', 'Đăng xuất'],
                'partner': ['Hồ sơ của tôi', 'Đơn hàng của tôi', 'Quản lý sản phẩm', 'Đăng xuất'],
                'admin': ['Hồ sơ của tôi', 'Đơn hàng của tôi', 'Admin Dashboard', 'Quản lý sản phẩm', 'Đăng xuất']
            };
            
            const expected = expectedItems[userData.role] || [];
            console.log('  - Expected:', expected);
            
            // Just check key items exist
            if (userData.role === 'admin' && items.some(i => i.includes('Admin Dashboard'))) {
                console.log('  ✅ Admin menu items đúng');
            } else if (userData.role === 'partner' && items.some(i => i.includes('Quản lý sản phẩm'))) {
                console.log('  ✅ Partner menu items đúng');
            } else if (userData.role === 'client' && !items.some(i => i.includes('Admin Dashboard'))) {
                console.log('  ✅ Client menu items đúng');
            }
        }
    }
}

checkHeaderMenu();

// ============================================
// 5. TEST CONSOLE ERRORS
// ============================================
console.log('\n📍 5. Kiểm tra Console Errors');

// Store original console.error
const originalError = console.error;
let errorCount = 0;
const errors = [];

// Override console.error to count
console.error = function(...args) {
    errorCount++;
    errors.push(args.join(' '));
    originalError.apply(console, args);
};

setTimeout(() => {
    console.error = originalError; // Restore
    
    if (errorCount > 0) {
        console.warn(`  ⚠️ Phát hiện ${errorCount} lỗi trong console`);
        errors.forEach((err, idx) => {
            console.warn(`     ${idx + 1}. ${err.substring(0, 100)}...`);
        });
    } else {
        console.log('  ✅ Không có lỗi trong console');
    }
}, 2000);

// ============================================
// 6. TEST ROUTING PROTECTION
// ============================================
console.log('\n📍 6. Test Route Protection (Manual)');
console.log('  Thử truy cập các URL sau để test:');

if (!userData) {
    console.log('  → http://localhost:3000/profile (phải redirect login)');
    console.log('  → http://localhost:3000/dashboard/admin (phải redirect login)');
} else if (userData.role === 'client') {
    console.log('  → http://localhost:3000/profile (OK)');
    console.log('  → http://localhost:3000/dashboard/partner (redirect home)');
    console.log('  → http://localhost:3000/dashboard/admin (redirect home)');
} else if (userData.role === 'partner') {
    console.log('  → http://localhost:3000/dashboard/partner (OK)');
    console.log('  → http://localhost:3000/dashboard/admin (redirect home)');
} else if (userData.role === 'admin') {
    console.log('  → http://localhost:3000/dashboard/admin (OK)');
    console.log('  → http://localhost:3000/dashboard/partner (OK)');
}

// ============================================
// 7. TEST THEME COLORS
// ============================================
console.log('\n📍 7. Kiểm tra Theme Colors');

function checkTheme() {
    const roleLayout = document.querySelector('.role-based-layout');
    if (!roleLayout) return;
    
    const styles = window.getComputedStyle(roleLayout);
    const primaryColor = styles.getPropertyValue('--primary-color');
    
    console.log('  - Primary color:', primaryColor);
    
    const expectedColors = {
        'theme-client': '#3498db',
        'theme-partner': '#16a085',
        'theme-admin': '#8e44ad',
        'theme-guest': '#667eea'
    };
    
    const className = roleLayout.className;
    for (const [theme, color] of Object.entries(expectedColors)) {
        if (className.includes(theme)) {
            if (primaryColor.includes(color.replace('#', ''))) {
                console.log(`  ✅ ${theme} color đúng`);
            } else {
                console.warn(`  ⚠️ ${theme} color có thể sai`);
                console.warn(`     Mong đợi: ${color}`);
                console.warn(`     Thực tế: ${primaryColor}`);
            }
            break;
        }
    }
}

checkTheme();

// ============================================
// SUMMARY
// ============================================
setTimeout(() => {
    console.log('\n' + '='.repeat(50));
    console.log('📊 KẾT QUẢ TESTING');
    console.log('='.repeat(50));
    
    if (userData) {
        console.log(`👤 User: ${userData.username} (${userData.role})`);
        console.log(`📧 Email: ${userData.email}`);
    } else {
        console.log('👤 User: Chưa đăng nhập');
    }
    
    console.log('\n✅ Test hoàn thành!');
    console.log('\n💡 Để test đầy đủ:');
    console.log('1. Đăng nhập với các role khác nhau');
    console.log('2. Thử truy cập protected routes');
    console.log('3. Test logout và login lại');
    console.log('4. Kiểm tra responsive trên mobile');
    
    console.log('\n📝 Xem hướng dẫn chi tiết: USER_ROLE_TESTING_GUIDE.md');
    console.log('='.repeat(50) + '\n');
}, 3000);

// ============================================
// HELPER FUNCTIONS FOR MANUAL TESTING
// ============================================
console.log('\n💡 Helper Functions:');
console.log('  - checkBadge()      : Kiểm tra badge display');
console.log('  - checkToken()      : Kiểm tra token và decode');
console.log('  - checkHeaderMenu() : Kiểm tra menu items');
console.log('  - checkTheme()      : Kiểm tra theme colors');
console.log('\nVí dụ: gõ checkBadge() để kiểm tra lại badge\n');

// Export helper functions to global scope
window.testHelpers = {
    checkBadge,
    checkToken,
    checkHeaderMenu,
    checkTheme,
    testAPI
};
