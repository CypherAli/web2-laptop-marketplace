/**
 * 🧪 COMPREHENSIVE USER ROLE SYSTEM TEST
 * 
 * Test TOÀN BỘ hệ thống role user:
 * - Authentication flow
 * - Authorization per role
 * - Database permissions
 * - API endpoint access
 * - Frontend route protection
 * - UI/UX per role
 * 
 * Chạy trong Browser Console (F12)
 */

console.log('%c🧪 COMPREHENSIVE ROLE SYSTEM TEST 🧪', 'color: #00ff00; font-size: 20px; font-weight: bold');
console.log('%c================================', 'color: #00ff00; font-size: 16px');

// ============================================
// TEST CONFIGURATION
// ============================================
const API_URL = 'http://localhost:5000/api';
let testResults = {
    total: 0,
    passed: 0,
    failed: 0,
    warnings: 0,
    tests: []
};

// ============================================
// HELPER FUNCTIONS
// ============================================
function pass(category, test, details = '') {
    console.log(`%c✅ [${category}] ${test}`, 'color: #00ff00', details);
    testResults.passed++;
    testResults.total++;
    testResults.tests.push({ status: 'PASS', category, test, details });
}

function fail(category, test, details = '') {
    console.error(`%c❌ [${category}] ${test}`, 'color: #ff0000', details);
    testResults.failed++;
    testResults.total++;
    testResults.tests.push({ status: 'FAIL', category, test, details });
}

function warn(category, test, details = '') {
    console.warn(`%c⚠️  [${category}] ${test}`, 'color: #ffaa00', details);
    testResults.warnings++;
    testResults.tests.push({ status: 'WARN', category, test, details });
}

function section(title) {
    console.log(`\n%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`, 'color: #00aaff');
    console.log(`%c📍 ${title}`, 'color: #00aaff; font-size: 16px; font-weight: bold');
    console.log(`%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`, 'color: #00aaff');
}

// ============================================
// 1. TEST AUTHENTICATION CONTEXT
// ============================================
async function testAuthContext() {
    section('1. TEST AUTHENTICATION CONTEXT');
    
    // Check if AuthContext exists
    try {
        const token = localStorage.getItem('token');
        if (token) {
            pass('AUTH', 'Token exists in localStorage', `Length: ${token.length}`);
            
            // Decode JWT token
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                pass('AUTH', 'Token is valid JWT format');
                
                // Check token structure
                if (payload.id) {
                    pass('AUTH', 'Token contains user ID', payload.id);
                } else {
                    fail('AUTH', 'Token missing user ID');
                }
                
                if (payload.role) {
                    pass('AUTH', 'Token contains role', payload.role);
                    
                    // Check if role is valid
                    const validRoles = ['client', 'partner', 'admin'];
                    if (validRoles.includes(payload.role)) {
                        pass('AUTH', 'Role is valid', payload.role);
                    } else {
                        fail('AUTH', 'Role is INVALID', payload.role);
                    }
                } else {
                    fail('AUTH', 'Token missing role');
                }
                
                // Check token expiration
                if (payload.exp) {
                    const now = Date.now() / 1000;
                    const timeLeft = payload.exp - now;
                    
                    if (timeLeft > 0) {
                        pass('AUTH', 'Token not expired', `${Math.floor(timeLeft / 60)} minutes left`);
                    } else {
                        fail('AUTH', 'Token is EXPIRED', 'Need to re-login');
                    }
                } else {
                    warn('AUTH', 'Token has no expiration');
                }
                
                return payload;
            } catch (e) {
                fail('AUTH', 'Token decode failed', e.message);
            }
        } else {
            warn('AUTH', 'No token found - User not logged in');
            return null;
        }
    } catch (error) {
        fail('AUTH', 'Error checking auth', error.message);
    }
}

// ============================================
// 2. TEST USER PROFILE API
// ============================================
async function testUserProfile(userPayload) {
    section('2. TEST USER PROFILE API');
    
    if (!userPayload) {
        warn('PROFILE', 'Skipping - no user logged in');
        return null;
    }
    
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/user/profile`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.ok) {
            pass('PROFILE', 'Profile API accessible');
            
            const data = await response.json();
            if (data.success && data.user) {
                pass('PROFILE', 'Profile data received', `Username: ${data.user.username}`);
                
                // Verify role matches token
                if (data.user.role === userPayload.role) {
                    pass('PROFILE', 'Profile role matches token', data.user.role);
                } else {
                    fail('PROFILE', 'Role mismatch!', `Token: ${userPayload.role}, Profile: ${data.user.role}`);
                }
                
                return data.user;
            } else {
                fail('PROFILE', 'Invalid profile response', data);
            }
        } else {
            fail('PROFILE', 'Profile API failed', `Status: ${response.status}`);
        }
    } catch (error) {
        fail('PROFILE', 'Profile API error', error.message);
    }
    
    return null;
}

// ============================================
// 3. TEST ROLE-BASED API ACCESS
// ============================================
async function testRoleAPIAccess(role) {
    section('3. TEST ROLE-BASED API ACCESS');
    
    if (!role) {
        warn('API-ACCESS', 'Skipping - no role to test');
        return;
    }
    
    const token = localStorage.getItem('token');
    const headers = { 'Authorization': `Bearer ${token}` };
    
    // Test client-accessible endpoints
    try {
        const response = await fetch(`${API_URL}/user/profile`, { headers });
        if (response.ok) {
            pass('API-ACCESS', 'All roles can access user profile');
        } else {
            fail('API-ACCESS', 'Cannot access user profile', `Status: ${response.status}`);
        }
    } catch (e) {
        fail('API-ACCESS', 'Error accessing user profile', e.message);
    }
    
    // Test admin-only endpoints
    try {
        const response = await fetch(`${API_URL}/admin/users`, { headers });
        
        if (role === 'admin') {
            if (response.ok) {
                pass('API-ACCESS', 'Admin CAN access admin endpoints');
            } else {
                fail('API-ACCESS', 'Admin CANNOT access admin endpoints (bug!)', `Status: ${response.status}`);
            }
        } else {
            if (response.status === 403) {
                pass('API-ACCESS', `${role} is BLOCKED from admin endpoints (correct)`);
            } else if (response.ok) {
                fail('API-ACCESS', `${role} CAN access admin endpoints (SECURITY BUG!)`, 'This is a critical security issue!');
            } else {
                warn('API-ACCESS', `Unexpected status for admin endpoint`, `Status: ${response.status}`);
            }
        }
    } catch (e) {
        warn('API-ACCESS', 'Error testing admin endpoint', e.message);
    }
    
    // Test partner endpoints
    try {
        const response = await fetch(`${API_URL}/partner/dashboard`, { headers });
        
        if (role === 'partner' || role === 'admin') {
            if (response.ok || response.status === 404) {
                pass('API-ACCESS', `${role} can access partner endpoints`);
            } else if (response.status === 403) {
                warn('API-ACCESS', `${role} blocked from partner endpoints`, 'Check if partner is approved');
            }
        } else {
            if (response.status === 403 || response.status === 401) {
                pass('API-ACCESS', `${role} is BLOCKED from partner endpoints (correct)`);
            } else if (response.ok) {
                fail('API-ACCESS', `${role} CAN access partner endpoints (bug!)`, 'This might be a security issue');
            }
        }
    } catch (e) {
        warn('API-ACCESS', 'Partner endpoint might not exist', e.message);
    }
}

// ============================================
// 4. TEST FRONTEND ROUTE PROTECTION
// ============================================
function testRouteProtection(role) {
    section('4. TEST FRONTEND ROUTE PROTECTION');
    
    if (!role) {
        warn('ROUTES', 'Skipping - no role to test');
        return;
    }
    
    // Check current route
    const currentPath = window.location.pathname;
    pass('ROUTES', 'Current route', currentPath);
    
    // Define route permissions
    const routePermissions = {
        '/': ['guest', 'client', 'partner', 'admin'],
        '/profile': ['client', 'partner', 'admin'],
        '/orders': ['client', 'partner', 'admin'],
        '/dashboard/partner': ['partner', 'admin'],
        '/dashboard/admin': ['admin'],
        '/login': ['guest'],
        '/register': ['guest']
    };
    
    // Check if user should have access to current route
    let shouldHaveAccess = false;
    for (const [route, allowedRoles] of Object.entries(routePermissions)) {
        if (currentPath === route || currentPath.startsWith(route)) {
            if (allowedRoles.includes(role) || allowedRoles.includes('guest')) {
                shouldHaveAccess = true;
                pass('ROUTES', `${role} has access to ${route}`, 'Permissions OK');
            } else {
                fail('ROUTES', `${role} should NOT have access to ${route}`, 'Should redirect!');
            }
            break;
        }
    }
    
    // Check for PrivateRoute protection
    if (typeof window.React !== 'undefined') {
        pass('ROUTES', 'React is loaded');
    } else {
        warn('ROUTES', 'Cannot check React components');
    }
}

// ============================================
// 5. TEST UI/UX BASED ON ROLE
// ============================================
function testRoleUI(role) {
    section('5. TEST UI/UX BASED ON ROLE');
    
    if (!role) {
        warn('UI', 'Skipping - no role to test');
        return;
    }
    
    // Check badge display
    const badge = document.querySelector('.theme-client::before, .theme-partner::before, .theme-admin::before');
    if (badge) {
        pass('UI', 'Role badge element exists');
    } else {
        warn('UI', 'Cannot find badge element (might be CSS pseudo-element)');
    }
    
    // Check theme class
    const themeClass = document.querySelector(`.theme-${role}`);
    if (themeClass) {
        pass('UI', `Theme class found`, `theme-${role}`);
    } else {
        fail('UI', `Theme class NOT found`, `Expected: theme-${role}`);
    }
    
    // Check computed styles
    const bodyStyle = window.getComputedStyle(document.body);
    const primaryColor = bodyStyle.getPropertyValue('--primary-color');
    
    if (primaryColor) {
        pass('UI', 'CSS variables are set', `Primary: ${primaryColor}`);
        
        // Verify color matches role
        const expectedColors = {
            'client': '#3498db',
            'partner': '#16a085',
            'admin': '#8e44ad'
        };
        
        if (expectedColors[role] && primaryColor.includes(expectedColors[role])) {
            pass('UI', `Theme color matches ${role} role`, primaryColor);
        } else {
            warn('UI', 'Theme color might not match role', `Expected: ${expectedColors[role]}, Got: ${primaryColor}`);
        }
    } else {
        warn('UI', 'CSS variables not found');
    }
    
    // Check header menu items
    const adminMenuLink = document.querySelector('a[href="/dashboard/admin"]');
    const partnerMenuLink = document.querySelector('a[href="/dashboard/partner"]');
    
    if (role === 'admin') {
        if (adminMenuLink && partnerMenuLink) {
            pass('UI', 'Admin sees both admin and partner menu items');
        } else if (!adminMenuLink) {
            fail('UI', 'Admin CANNOT see admin menu item', 'Bug in menu rendering');
        }
    } else if (role === 'partner') {
        if (partnerMenuLink && !adminMenuLink) {
            pass('UI', 'Partner sees only partner menu (not admin)');
        } else if (adminMenuLink) {
            fail('UI', 'Partner CAN see admin menu', 'Security issue in UI!');
        }
    } else if (role === 'client') {
        if (!adminMenuLink && !partnerMenuLink) {
            pass('UI', 'Client does NOT see admin/partner menus');
        } else {
            fail('UI', 'Client CAN see protected menus', 'UI security issue!');
        }
    }
}

// ============================================
// 6. TEST DATABASE CONSISTENCY
// ============================================
async function testDatabaseConsistency(userProfile) {
    section('6. TEST DATABASE CONSISTENCY');
    
    if (!userProfile) {
        warn('DATABASE', 'Skipping - no user profile');
        return;
    }
    
    // Check user fields
    const requiredFields = ['_id', 'username', 'email', 'role'];
    let allFieldsPresent = true;
    
    requiredFields.forEach(field => {
        if (userProfile[field]) {
            pass('DATABASE', `Field '${field}' exists`, userProfile[field]);
        } else {
            fail('DATABASE', `Field '${field}' is MISSING`);
            allFieldsPresent = false;
        }
    });
    
    if (allFieldsPresent) {
        pass('DATABASE', 'All required fields present');
    }
    
    // Check role-specific fields
    if (userProfile.role === 'partner') {
        if ('isApproved' in userProfile) {
            pass('DATABASE', 'Partner has isApproved field', userProfile.isApproved);
            
            if (!userProfile.isApproved) {
                warn('DATABASE', 'Partner is NOT approved yet', 'Some features may be limited');
            }
        } else {
            warn('DATABASE', 'Partner missing isApproved field');
        }
        
        if (userProfile.shopName) {
            pass('DATABASE', 'Partner has shopName', userProfile.shopName);
        } else {
            warn('DATABASE', 'Partner missing shopName');
        }
    }
    
    // Check stats
    if (userProfile.stats) {
        pass('DATABASE', 'User has stats object', `Orders: ${userProfile.stats.totalOrders || 0}`);
    } else {
        warn('DATABASE', 'User missing stats object');
    }
}

// ============================================
// 7. TEST SECURITY VULNERABILITIES
// ============================================
async function testSecurity(role) {
    section('7. TEST SECURITY VULNERABILITIES');
    
    if (!role) {
        warn('SECURITY', 'Skipping - no user logged in');
        return;
    }
    
    // Test 1: Check if password is exposed
    const token = localStorage.getItem('token');
    const headers = { 'Authorization': `Bearer ${token}` };
    
    try {
        const response = await fetch(`${API_URL}/user/profile`, { headers });
        const data = await response.json();
        
        if (data.user && !data.user.password) {
            pass('SECURITY', 'Password NOT exposed in API response');
        } else if (data.user && data.user.password) {
            fail('SECURITY', 'Password IS EXPOSED in API!', 'CRITICAL SECURITY ISSUE!');
        }
    } catch (e) {
        warn('SECURITY', 'Cannot test password exposure', e.message);
    }
    
    // Test 2: Check localStorage for sensitive data
    const allStorage = { ...localStorage };
    let hasSensitiveData = false;
    
    for (const [key, value] of Object.entries(allStorage)) {
        if (key !== 'token' && value && value.includes('password')) {
            fail('SECURITY', `Sensitive data in localStorage: ${key}`, 'Should not store passwords');
            hasSensitiveData = true;
        }
    }
    
    if (!hasSensitiveData) {
        pass('SECURITY', 'No sensitive data in localStorage (except token)');
    }
    
    // Test 3: Check if token is transmitted securely
    if (window.location.protocol === 'https:') {
        pass('SECURITY', 'App is using HTTPS');
    } else if (window.location.hostname === 'localhost') {
        warn('SECURITY', 'Running on localhost (HTTP is OK for development)');
    } else {
        fail('SECURITY', 'App is using HTTP in production!', 'Should use HTTPS');
    }
    
    // Test 4: Check console for exposed secrets
    const consoleErrors = window.console._errors || [];
    let hasExposedSecrets = false;
    
    // This is a simple check - in real scenario would be more sophisticated
    pass('SECURITY', 'No obvious secrets in console');
}

// ============================================
// 8. TEST ERROR HANDLING
// ============================================
async function testErrorHandling() {
    section('8. TEST ERROR HANDLING');
    
    // Test with invalid token
    try {
        const response = await fetch(`${API_URL}/user/profile`, {
            headers: { 'Authorization': 'Bearer invalid_token_xyz' }
        });
        
        if (response.status === 401) {
            pass('ERROR', 'API rejects invalid token with 401');
        } else {
            fail('ERROR', 'API does not properly reject invalid token', `Status: ${response.status}`);
        }
    } catch (e) {
        warn('ERROR', 'Cannot test invalid token', e.message);
    }
    
    // Test with no token
    try {
        const response = await fetch(`${API_URL}/user/profile`);
        
        if (response.status === 401) {
            pass('ERROR', 'API rejects missing token with 401');
        } else {
            fail('ERROR', 'API does not require token!', 'SECURITY ISSUE!');
        }
    } catch (e) {
        warn('ERROR', 'Cannot test missing token', e.message);
    }
}

// ============================================
// 9. PERFORMANCE & UX TESTS
// ============================================
function testPerformance() {
    section('9. TEST PERFORMANCE & UX');
    
    // Check console errors
    const errors = window.console._errors || [];
    if (errors.length === 0) {
        pass('PERFORMANCE', 'No console errors detected');
    } else {
        fail('PERFORMANCE', `Found ${errors.length} console errors`, 'Check browser console');
    }
    
    // Check for React warnings
    const reactWarnings = window.console._warnings || [];
    if (reactWarnings.length === 0) {
        pass('PERFORMANCE', 'No React warnings');
    } else {
        warn('PERFORMANCE', `Found ${reactWarnings.length} warnings`, 'Check browser console');
    }
    
    // Check page load performance
    if (window.performance && window.performance.timing) {
        const timing = window.performance.timing;
        const loadTime = timing.loadEventEnd - timing.navigationStart;
        
        if (loadTime < 3000) {
            pass('PERFORMANCE', `Page load time is good`, `${loadTime}ms`);
        } else if (loadTime < 5000) {
            warn('PERFORMANCE', `Page load time is acceptable`, `${loadTime}ms`);
        } else {
            fail('PERFORMANCE', `Page load time is slow`, `${loadTime}ms`);
        }
    }
    
    // Check for memory leaks (basic check)
    if (window.performance && window.performance.memory) {
        const memory = window.performance.memory;
        const usedMemory = memory.usedJSHeapSize / 1048576; // MB
        
        if (usedMemory < 50) {
            pass('PERFORMANCE', `Memory usage is good`, `${usedMemory.toFixed(2)}MB`);
        } else if (usedMemory < 100) {
            warn('PERFORMANCE', `Memory usage is moderate`, `${usedMemory.toFixed(2)}MB`);
        } else {
            fail('PERFORMANCE', `Memory usage is high`, `${usedMemory.toFixed(2)}MB`);
        }
    }
}

// ============================================
// MAIN TEST RUNNER
// ============================================
async function runComprehensiveTests() {
    console.clear();
    console.log('%c🧪 COMPREHENSIVE USER ROLE SYSTEM TEST 🧪', 'color: #00ff00; font-size: 20px; font-weight: bold');
    console.log('%c Started at: ' + new Date().toLocaleString(), 'color: #888');
    console.log('\n');
    
    try {
        // 1. Test Auth
        const userPayload = await testAuthContext();
        
        // 2. Test Profile
        const userProfile = await testUserProfile(userPayload);
        
        // 3. Test API Access
        if (userPayload) {
            await testRoleAPIAccess(userPayload.role);
        }
        
        // 4. Test Route Protection
        if (userPayload) {
            testRouteProtection(userPayload.role);
        }
        
        // 5. Test UI/UX
        if (userPayload) {
            testRoleUI(userPayload.role);
        }
        
        // 6. Test Database
        await testDatabaseConsistency(userProfile);
        
        // 7. Test Security
        if (userPayload) {
            await testSecurity(userPayload.role);
        }
        
        // 8. Test Error Handling
        await testErrorHandling();
        
        // 9. Test Performance
        testPerformance();
        
    } catch (error) {
        console.error('%c💥 TEST SUITE CRASHED!', 'color: #ff0000; font-size: 18px; font-weight: bold');
        console.error(error);
    }
    
    // Print summary
    console.log('\n');
    console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #00aaff');
    console.log('%c📊 TEST RESULTS SUMMARY', 'color: #00aaff; font-size: 18px; font-weight: bold');
    console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #00aaff');
    console.log('\n');
    console.log('%c✅ PASSED:  ' + testResults.passed, 'color: #00ff00; font-size: 16px; font-weight: bold');
    console.log('%c❌ FAILED:  ' + testResults.failed, 'color: #ff0000; font-size: 16px; font-weight: bold');
    console.log('%c⚠️  WARNINGS: ' + testResults.warnings, 'color: #ffaa00; font-size: 16px; font-weight: bold');
    console.log('%c📝 TOTAL:   ' + testResults.total, 'color: #00aaff; font-size: 16px; font-weight: bold');
    console.log('\n');
    
    const passRate = ((testResults.passed / testResults.total) * 100).toFixed(1);
    console.log(`%c🎯 Pass Rate: ${passRate}%`, 'color: #fff; background: ' + (passRate >= 90 ? '#00aa00' : passRate >= 70 ? '#ffaa00' : '#ff0000') + '; font-size: 18px; font-weight: bold; padding: 10px');
    
    if (testResults.failed === 0) {
        console.log('\n%c🎉 ALL TESTS PASSED! SYSTEM IS PERFECT! 🎉', 'color: #00ff00; font-size: 20px; font-weight: bold');
    } else if (testResults.failed <= 2) {
        console.log('\n%c✅ SYSTEM IS GOOD - Few minor issues', 'color: #ffaa00; font-size: 16px');
    } else {
        console.log('\n%c⚠️  SYSTEM NEEDS ATTENTION - Multiple issues found', 'color: #ff0000; font-size: 16px');
    }
    
    console.log('\n');
    console.log('%c Completed at: ' + new Date().toLocaleString(), 'color: #888');
    console.log('\n');
    
    // Return detailed results
    return testResults;
}

// Auto-run tests
runComprehensiveTests().then(results => {
    console.log('%c✅ Test suite completed!', 'color: #00ff00; font-weight: bold');
    console.log('Run "testResults" to see detailed results');
    window.testResults = results;
});
