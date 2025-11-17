import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import CartContext from '../../context/CartContext';
import WishlistContext from '../../context/WishlistContext';
import CartSidebar from '../cart/CartSidebar';
import NotificationBell from '../notification/NotificationBell';

const Header = () => {
    const { user, logout } = useContext(AuthContext);
    const { getCartCount } = useContext(CartContext);
    const { wishlist } = useContext(WishlistContext);
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [isCartSidebarOpen, setIsCartSidebarOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            // Navigate to home with search query (HomePage will handle the filter)
            navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    return (
        <>
            {/* Top Bar - Hotline & Trust Signals */}
            <div className="top-bar">
                <div className="top-bar-container">
                    <div className="top-bar-left">
                        <span className="trust-signal">🚚 Miễn phí vận chuyển toàn quốc từ 10 triệu</span>
                        <span className="trust-signal">🔄 Đổi trả 15 ngày nếu có lỗi từ NSX</span>
                        <span className="trust-signal">🛡️ Bảo hành chính hãng 12-24 tháng</span>
                    </div>
                    <div className="top-bar-right">
                        <span className="promo-text">💳 Trả góp 0% - Duyệt nhanh 30 phút</span>
                    </div>
                </div>
            </div>

            {/* Main Header */}
            <nav className="main-header">
                <div className="nav-container">
                    <div className="nav-left">
                        <Link to="/" className="logo">
                            <div className="logo-icon-wrapper">
                                <span className="logo-icon">💻</span>
                            </div>
                            <div className="logo-text-wrapper">
                                <span className="logo-text">Laptop Store</span>
                                <span className="logo-tagline">Premium Quality</span>
                            </div>
                        </Link>
                        
                        {/* Hotline nổi bật */}
                        <a href="tel:0848565650" className="hotline-prominent">
                            <span className="hotline-icon">📞</span>
                            <div className="hotline-info">
                                <span className="hotline-label">Tư vấn miễn phí</span>
                                <span className="hotline-number">084.856.5650</span>
                            </div>
                        </a>
                    </div>

                    {/* Center Search Bar */}
                    <div className="nav-center">
                        <form className="header-search" onSubmit={handleSearch}>
                            <input 
                                type="text" 
                                placeholder="Tìm kiếm laptop, phụ kiện..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="header-search-input"
                            />
                            <button type="submit" className="header-search-btn">
                                🔍
                            </button>
                        </form>
                    </div>

                    <div className="nav-right">
                        {user ? (
                            <>
                                <NotificationBell />
                                
                                <Link to="/wishlist" className="icon-link">
                                    <span className="icon">❤️</span>
                                    <span className="icon-label">Yêu thích</span>
                                    {wishlist.length > 0 && (
                                        <span className="icon-badge">{wishlist.length}</span>
                                    )}
                                </Link>
                                <button 
                                    className="icon-link cart-icon-btn" 
                                    onClick={() => setIsCartSidebarOpen(true)}
                                >
                                    <span className="icon">🛒</span>
                                    <span className="icon-label">Giỏ hàng</span>
                                    {getCartCount() > 0 && (
                                        <span className="icon-badge cart-badge">{getCartCount()}</span>
                                    )}
                                </button>
                                
                                {/* User Dropdown */}
                                <div className="user-menu">
                                    <button className="user-menu-btn">
                                        <span className="user-icon">�</span>
                                        <span className="user-name">{user.username}</span>
                                        <span className="dropdown-arrow">▼</span>
                                    </button>
                                    <div className="user-dropdown">
                                        <Link to="/profile" className="dropdown-item">
                                            👤 Hồ sơ của tôi
                                        </Link>
                                        <Link to="/orders" className="dropdown-item">
                                            📦 Đơn hàng của tôi
                                        </Link>
                                        {user && user.role === 'admin' && (
                                            <Link to="/admin" className="dropdown-item">
                                                🛡️ Admin Dashboard
                                            </Link>
                                        )}
                                        {user && (user.role === 'admin' || user.role === 'partner') && (
                                            <Link to="/manager" className="dropdown-item">
                                                📊 Quản lý sản phẩm
                                            </Link>
                                        )}
                                        <button onClick={handleLogout} className="dropdown-item logout-item">
                                            🚪 Đăng xuất
                                        </button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <Link to="/wishlist" className="icon-link">
                                    <span className="icon">❤️</span>
                                    <span className="icon-label">Yêu thích</span>
                                    {wishlist.length > 0 && (
                                        <span className="icon-badge">{wishlist.length}</span>
                                    )}
                                </Link>
                                <button 
                                    className="icon-link cart-icon-btn" 
                                    onClick={() => setIsCartSidebarOpen(true)}
                                >
                                    <span className="icon">🛒</span>
                                    <span className="icon-label">Giỏ hàng</span>
                                    {getCartCount() > 0 && (
                                        <span className="icon-badge cart-badge">{getCartCount()}</span>
                                    )}
                                </button>
                                <Link to="/login" className="nav-link login-link">
                                    <span className="link-icon">🔑</span>
                                    Đăng nhập
                                </Link>
                                <Link to="/register" className="nav-link register-link">
                                    <span className="link-icon">✨</span>
                                    Đăng ký
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </nav>

            {/* Navigation Menu */}
            <div className="main-nav">
                <div className="main-nav-container">
                    <Link to="/" className="nav-menu-item">
                        🏠 Trang chủ
                    </Link>
                    <Link to="/#products" className="nav-menu-item" onClick={(e) => {
                        if (window.location.pathname === '/') {
                            e.preventDefault();
                            const productsSection = document.getElementById('products-section');
                            if (productsSection) {
                                productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            }
                        }
                    }}>
                        💻 Sản phẩm
                    </Link>
                    <Link to="/deals" className="nav-menu-item hot-item">
                        🔥 Khuyến mãi Hot
                    </Link>
                    <Link to="/best-sellers" className="nav-menu-item">
                        ⭐ Bán chạy
                    </Link>
                    <Link to="/blog" className="nav-menu-item">
                        📰 Tin tức & Đánh giá
                    </Link>
                    <Link to="/about" className="nav-menu-item">
                        ℹ️ Giới thiệu
                    </Link>
                    <Link to="/contact" className="nav-menu-item">
                        📧 Liên hệ
                    </Link>
                </div>
            </div>

            {/* Cart Sidebar */}
            <CartSidebar 
                isOpen={isCartSidebarOpen} 
                onClose={() => setIsCartSidebarOpen(false)} 
            />
        </>
    );
};

export default Header;