import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from '../../api/axiosConfig';
import CartContext from '../../context/CartContext';
import WishlistContext from '../../context/WishlistContext';
import { PLACEHOLDER_IMAGES } from '../../utils/placeholder';
import './BestSellersPage.css';

const BestSellersPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { addToCart } = useContext(CartContext);
    const { toggleWishlist, isInWishlist } = useContext(WishlistContext);

    useEffect(() => {
        fetchBestSellers();
    }, []);

    const fetchBestSellers = async () => {
        try {
            setLoading(true);
            const res = await axios.get('/products', {
                params: {
                    limit: 50,
                    sortBy: 'soldCount',
                    inStock: true
                }
            });
            
            const productsData = res.data.products || res.data;
            // Lọc và sắp xếp theo soldCount
            const bestSellers = productsData
                .filter(p => p.soldCount > 0)
                .sort((a, b) => b.soldCount - a.soldCount);
            
            setProducts(bestSellers);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching best sellers:', err);
            setError('Không thể tải danh sách sản phẩm bán chạy');
            setLoading(false);
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    const handleAddToCart = (product) => {
        addToCart(product);
        alert(`Đã thêm ${product.name} vào giỏ hàng!`);
    };

    const getRankBadge = (index) => {
        if (index === 0) return { emoji: '🥇', text: 'Top 1', color: '#FFD700' };
        if (index === 1) return { emoji: '🥈', text: 'Top 2', color: '#C0C0C0' };
        if (index === 2) return { emoji: '🥉', text: 'Top 3', color: '#CD7F32' };
        return { emoji: '⭐', text: `Top ${index + 1}`, color: '#4CAF50' };
    };

    if (loading) {
        return (
            <div className="bestsellers-page">
                <div className="loading-container">
                    <div className="spinner"></div>
                    <p>Đang tải sản phẩm bán chạy...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bestsellers-page">
                <div className="error-container">
                    <p className="error-message">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bestsellers-page">
            {/* Hero Banner */}
            <div className="bestsellers-hero">
                <div className="bestsellers-hero-content">
                    <h1 className="bestsellers-title">⭐ Top Sản Phẩm Bán Chạy</h1>
                    <p className="bestsellers-subtitle">
                        Được tin dùng bởi hàng nghìn khách hàng
                    </p>
                    <div className="bestsellers-stats">
                        <div className="stat-item">
                            <span className="stat-number">{products.length}</span>
                            <span className="stat-label">Sản phẩm bán chạy</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-number">
                                {products.reduce((sum, p) => sum + (p.soldCount || 0), 0)}
                            </span>
                            <span className="stat-label">Đã bán</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-number">4.8★</span>
                            <span className="stat-label">Đánh giá trung bình</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Why Choose Best Sellers */}
            <div className="why-bestsellers">
                <div className="why-content">
                    <h2>🏆 Tại sao nên chọn sản phẩm bán chạy?</h2>
                    <div className="why-grid">
                        <div className="why-item">
                            <span className="why-icon">✓</span>
                            <h4>Được kiểm chứng</h4>
                            <p>Hàng nghìn người đã mua và tin dùng</p>
                        </div>
                        <div className="why-item">
                            <span className="why-icon">⭐</span>
                            <h4>Đánh giá cao</h4>
                            <p>Review tích cực từ khách hàng thực</p>
                        </div>
                        <div className="why-item">
                            <span className="why-icon">💎</span>
                            <h4>Chất lượng đảm bảo</h4>
                            <p>Sản phẩm được lựa chọn kỹ lưỡng</p>
                        </div>
                        <div className="why-item">
                            <span className="why-icon">🚀</span>
                            <h4>Xu hướng hot</h4>
                            <p>Theo kịp công nghệ mới nhất</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Products Grid */}
            <div className="bestsellers-content">
                {products.length === 0 ? (
                    <div className="no-bestsellers">
                        <p className="no-bestsellers-icon">📦</p>
                        <h3>Chưa có sản phẩm bán chạy</h3>
                        <p>Vui lòng quay lại sau</p>
                        <Link to="/" className="back-home-btn">
                            🏠 Về trang chủ
                        </Link>
                    </div>
                ) : (
                    <div className="products-grid">
                        {products.map((product, index) => {
                            const rankBadge = getRankBadge(index);
                            return (
                                <div key={product._id} className="product-card bestseller-card">
                                    <div 
                                        className="rank-badge" 
                                        style={{ background: rankBadge.color }}
                                    >
                                        <span className="rank-emoji">{rankBadge.emoji}</span>
                                        <span className="rank-text">{rankBadge.text}</span>
                                    </div>
                                    
                                    <div className="product-image-wrapper">
                                        <Link to={`/product/${product._id}`}>
                                            <img 
                                                src={product.imageUrl || PLACEHOLDER_IMAGES.product} 
                                                alt={product.name}
                                                className="product-image"
                                            />
                                        </Link>
                                        <button 
                                            className={`wishlist-btn ${isInWishlist(product._id) ? 'active' : ''}`}
                                            onClick={() => toggleWishlist(product)}
                                        >
                                            {isInWishlist(product._id) ? '❤️' : '🤍'}
                                        </button>
                                    </div>

                                    <div className="product-info">
                                        <Link to={`/product/${product._id}`} className="product-name">
                                            {product.name}
                                        </Link>
                                        
                                        <div className="product-rating">
                                            <span className="stars">⭐⭐⭐⭐⭐</span>
                                            <span className="rating-count">(4.8/5)</span>
                                        </div>

                                        <div className="sold-count">
                                            🔥 Đã bán: <strong>{product.soldCount || 0}</strong> sản phẩm
                                        </div>

                                        <div className="product-specs">
                                            <span className="spec-item">💻 {product.processor || 'N/A'}</span>
                                            <span className="spec-item">🎮 {product.ram || 'N/A'}</span>
                                        </div>

                                        <div className="price-section">
                                            {product.originalPrice && product.originalPrice > product.price ? (
                                                <>
                                                    <span className="original-price">
                                                        {formatPrice(product.originalPrice)}
                                                    </span>
                                                    <span className="current-price">
                                                        {formatPrice(product.price)}
                                                    </span>
                                                    <span className="discount-percent">
                                                        -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                                                    </span>
                                                </>
                                            ) : (
                                                <span className="current-price">
                                                    {formatPrice(product.price)}
                                                </span>
                                            )}
                                        </div>

                                        <div className="product-actions">
                                            <button 
                                                className="add-to-cart-btn"
                                                onClick={() => handleAddToCart(product)}
                                                disabled={!product.inStock}
                                            >
                                                {product.inStock ? '🛒 Thêm vào giỏ' : '⛔ Hết hàng'}
                                            </button>
                                        </div>

                                        {product.inStock && product.stock < 10 && (
                                            <div className="stock-warning">
                                                ⚠️ Chỉ còn {product.stock} sản phẩm
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default BestSellersPage;
