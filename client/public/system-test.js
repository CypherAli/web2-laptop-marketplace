/**
 * COMPREHENSIVE SYSTEM TEST
 * Kiểm tra toàn bộ hệ thống sau khi refactor
 */

const tests = {
    passed: 0,
    failed: 0,
    warnings: 0
};

console.log('%c🔍 SYSTEM TEST - Partner & User Separation', 'color: #00ff00; font-size: 20px; font-weight: bold');
console.log('=====================================\n');

// Test 1: Check Chat Widgets
console.log('%c1️⃣ Testing Chat Widgets', 'color: #00aaff; font-weight: bold');
try {
    // Check if UserLiveChat exists
    fetch('/static/js/bundle.js')
        .then(r => r.text())
        .then(code => {
            if (code.includes('UserLiveChat')) {
                console.log('  ✅ UserLiveChat component found');
                tests.passed++;
            } else {
                console.error('  ❌ UserLiveChat component missing');
                tests.failed++;
            }
            
            if (code.includes('PartnerLiveChat')) {
                console.log('  ✅ PartnerLiveChat component found');
                tests.passed++;
            } else {
                console.error('  ❌ PartnerLiveChat component missing');
                tests.failed++;
            }
            
            if (!code.includes('Tìm Partner') && !code.includes('Email demo để test')) {
                console.log('  ✅ Old partner search removed from user chat');
                tests.passed++;
            } else {
                console.warn('  ⚠️  Old partner search code still present');
                tests.warnings++;
            }
        });
} catch (error) {
    console.error('  ❌ Chat widget test failed:', error);
    tests.failed++;
}

// Test 2: Check Routes
console.log('\n%c2️⃣ Testing Routes', 'color: #00aaff; font-weight: bold');
const routes = [
    { path: '/partner-dashboard', desc: 'Partner Dashboard', restricted: true },
    { path: '/manager', desc: 'Product Manager', restricted: true },
    { path: '/admin', desc: 'Admin Dashboard', restricted: true },
    { path: '/', desc: 'Home Page', restricted: false }
];

routes.forEach(route => {
    fetch(route.path, { method: 'HEAD' })
        .then(response => {
            if (route.restricted && response.status === 401) {
                console.log(`  ✅ ${route.desc} is protected`);
                tests.passed++;
            } else if (!route.restricted && response.ok) {
                console.log(`  ✅ ${route.desc} accessible`);
                tests.passed++;
            } else {
                console.warn(`  ⚠️  ${route.desc} unexpected status: ${response.status}`);
                tests.warnings++;
            }
        })
        .catch(err => {
            console.error(`  ❌ ${route.desc} error:`, err.message);
            tests.failed++;
        });
});

// Test 3: Check API Endpoints
console.log('\n%c3️⃣ Testing API Endpoints', 'color: #00aaff; font-weight: bold');
const apiEndpoints = [
    { url: '/api/partner/stats', desc: 'Partner Stats', needsAuth: true },
    { url: '/api/partner/revenue', desc: 'Partner Revenue', needsAuth: true },
    { url: '/api/partner/revenue-by-brand', desc: 'Revenue by Brand', needsAuth: true }
];

apiEndpoints.forEach(endpoint => {
    fetch(endpoint.url)
        .then(response => {
            if (endpoint.needsAuth && response.status === 401) {
                console.log(`  ✅ ${endpoint.desc} requires authentication`);
                tests.passed++;
            } else if (response.ok) {
                console.log(`  ✅ ${endpoint.desc} accessible`);
                tests.passed++;
            } else {
                console.warn(`  ⚠️  ${endpoint.desc} status: ${response.status}`);
                tests.warnings++;
            }
        })
        .catch(err => {
            console.error(`  ❌ ${endpoint.desc} error:`, err.message);
            tests.failed++;
        });
});

// Test 4: Check Components Load
console.log('\n%c4️⃣ Testing Component Loading', 'color: #00aaff; font-weight: bold');
setTimeout(() => {
    // Check if chat widget is visible
    const chatWidget = document.querySelector('.chat-toggle-btn, .partner-chat-toggle-btn');
    if (chatWidget) {
        console.log('  ✅ Chat widget rendered');
        tests.passed++;
    } else {
        console.error('  ❌ Chat widget not found');
        tests.failed++;
    }
    
    // Check if no old LiveChat exists
    const oldLiveChat = document.querySelector('[class*="LiveChat"]');
    if (!oldLiveChat) {
        console.log('  ✅ Old LiveChat component removed');
        tests.passed++;
    } else {
        console.warn('  ⚠️  Old LiveChat still present');
        tests.warnings++;
    }
}, 2000);

// Test 5: Socket Connection
console.log('\n%c5️⃣ Testing Socket.IO Connection', 'color: #00aaff; font-weight: bold');
try {
    const socket = window.io?.('http://localhost:5000', {
        transports: ['polling', 'websocket']
    });
    
    if (socket) {
        socket.on('connect', () => {
            console.log('  ✅ Socket.IO connected successfully');
            tests.passed++;
            socket.disconnect();
        });
        
        socket.on('connect_error', (error) => {
            console.error('  ❌ Socket.IO connection error:', error.message);
            tests.failed++;
        });
    } else {
        console.warn('  ⚠️  Socket.IO not available');
        tests.warnings++;
    }
} catch (error) {
    console.error('  ❌ Socket test failed:', error);
    tests.failed++;
}

// Results Summary
setTimeout(() => {
    console.log('\n' + '='.repeat(50));
    console.log('%c📊 TEST RESULTS', 'color: #00aaff; font-size: 18px; font-weight: bold');
    console.log('='.repeat(50));
    console.log(`%c✅ Passed:   ${tests.passed}`, 'color: #00ff00; font-weight: bold');
    console.log(`%c❌ Failed:   ${tests.failed}`, 'color: #ff0000; font-weight: bold');
    console.log(`%c⚠️  Warnings: ${tests.warnings}`, 'color: #ffaa00; font-weight: bold');
    console.log('='.repeat(50));
    
    const total = tests.passed + tests.failed + tests.warnings;
    const passRate = total > 0 ? Math.round((tests.passed / total) * 100) : 0;
    console.log(`%c🎯 Pass Rate: ${passRate}%`, 
        `color: white; background: ${passRate >= 90 ? '#00aa00' : passRate >= 70 ? '#ffaa00' : '#ff0000'}; padding: 10px; font-size: 16px; font-weight: bold`);
    
    if (tests.failed === 0 && tests.warnings === 0) {
        console.log('\n%c🎉 ALL TESTS PASSED! SYSTEM IS PERFECT!', 'color: #00ff00; font-size: 18px; font-weight: bold');
    } else if (tests.failed === 0) {
        console.log('\n%c✅ SYSTEM IS GOOD - Minor warnings only', 'color: #ffaa00; font-size: 16px');
    } else {
        console.log('\n%c⚠️  SYSTEM NEEDS ATTENTION', 'color: #ff0000; font-size: 16px');
    }
}, 5000);

console.log('\n%cTest running... Results in 5 seconds', 'color: #888; font-style: italic');
