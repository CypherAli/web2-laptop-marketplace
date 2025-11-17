import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingCart, FiEye } from 'react-icons/fi';
import axios from '../../api/axiosConfig';
import CartContext from '../../context/CartContext';
import WishlistContext from '../../context/WishlistContext';
import { useToast } from '../common/Toast';
import QuickViewModal from '../modal/QuickViewModal';
import { PLACEHOLDER_IMAGES } from '../../utils/placeholder';
import './BestSellers.css';

const BestSellers = () => {
    const [bestSellers, setBestSellers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const { addToCart } = useContext(CartContext);
    const { toggleWishlist, isInWishlist } = useContext(WishlistContext);
    const toast = useToast();

    useEffect(() => {
        fetchBestSellers();
    }, []);

    const fetchBestSellers = async () => {
        try {
            const res = await axios.get('/products', {
                params: {
                    sortBy: 'popular',
                    limit: 5,
                    inStock: true
                }
            });
            
            // Add default values for missing fields
            const productsWithDefaults = (res.data.products || res.data).map(p => ({
                ...p,
                processor: p.processor || 'Đang cập nhật',
                ram: p.ram || 'Đang cập nhật',
                storage: p.storage || 'Đang cập nhật',
                screen: p.screen || 'Đang cập nhật',
                description: p.description || 'Sản phẩm chính hãng, bảo hành toàn quốc. Liên hệ hotline 084.686.5650 để biết thêm chi tiết.',
                features: p.features && p.features.length > 0 ? p.features : [
                    'Sản phẩm mới 100%, nguyên seal',
                    'Bảo hành chính hãng',
                    'Giao hàng toàn quốc',
                    'Hỗ trợ trả góp 0% lãi suất'
                ]
            }));
            
            setBestSellers(productsWithDefaults);
        } catch (err) {
            console.error('Failed to fetch best sellers:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleWishlistClick = (e, product) => {
        e.preventDefault();
        e.stopPropagation();
        toggleWishlist(product);
    };

    const handleAddToCart = (e, product) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart(product);
        toast.success(`Đã thêm ${product.name} vào giỏ hàng!`);
    };

    if (loading) {
        return <div className="section-loading">Đang tải...</div>;
    }

    return (
        <section className="best-sellers-section">
            <div className="section-container">
                <div className="section-header">
                    <h2 className="section-title">
                        <span className="title-icon">⭐</span>
                        Sản Phẩm Bán Chạy
                        <span className="title-icon">⭐</span>
                    </h2>
                    <p className="section-subtitle">
                        Top laptop được khách hàng yêu thích và tin dùng nhất
                    </p>
                </div>

                <div className="best-sellers-scroll">
                    {bestSellers.map((product, index) => (
                        <div key={product._id} className="bestseller-card-wrapper">
                            <div className="bestseller-card">
                                <div className="bestseller-rank">#{index + 1}</div>
                                {product.originalPrice && product.originalPrice > product.price && (
                                    <div className="bestseller-discount">
                                        -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                                    </div>
                                )}
                                
                                {/* Action Buttons */}
                                <div className="bestseller-actions">
                                    <button
                                        className={`bestseller-wishlist-btn ${isInWishlist(product._id) ? 'active' : ''}`}
                                        onClick={(e) => handleWishlistClick(e, product)}
                                        title={isInWishlist(product._id) ? 'Xóa khỏi yêu thích' : 'Thêm vào yêu thích'}
                                    >
                                        {isInWishlist(product._id) ? '❤️' : '🤍'}
                                    </button>
                                    <button
                                        className="bestseller-view-btn"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            setSelectedProduct(product);
                                        }}
                                        title="Xem nhanh"
                                    >
                                        <FiEye />
                                    </button>
                                </div>

                                <Link 
                                    to={`/product/${product._id}`}
                                    className="bestseller-image-link"
                                >
                                    <div className="bestseller-image">
                                        <img 
                                            src={product.imageUrl || PLACEHOLDER_IMAGES.productSmall} 
                                            alt={product.name}
                                        />
                                    </div>
                                </Link>
                                
                                <div className="bestseller-info">
                                    <span className="bestseller-brand">{product.brand}</span>
                                    <Link to={`/product/${product._id}`}>
                                        <h3 className="bestseller-name">{product.name}</h3>
                                    </Link>
                                    <div className="bestseller-price">
                                        {product.originalPrice && product.originalPrice > product.price && (
                                            <span className="original-price">
                                                {product.originalPrice.toLocaleString()}₫
                                            </span>
                                        )}
                                        <span className="current-price">
                                            {product.price.toLocaleString()}₫
                                        </span>
                                    </div>
                                    <div className="bestseller-stats">
                                        <span>⭐ 4.8</span>
                                        <span>📦 Đã bán {product.soldCount || Math.floor(Math.random() * 500) + 100}</span>
                                    </div>
                                    
                                    {/* Add to Cart Button */}
                                    <button
                                        className="bestseller-add-to-cart"
                                        onClick={(e) => handleAddToCart(e, product)}
                                        title="Thêm vào giỏ hàng"
                                    >
                                        <FiShoppingCart /> Thêm giỏ hàng
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="section-footer">
                    <button 
                        className="view-all-btn"
                        onClick={() => {
                            const productsSection = document.getElementById('products-section');
                            if (productsSection) {
                                productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            }
                        }}
                    >
                        Xem tất cả sản phẩm →
                    </button>
                </div>
            </div>

            {/* Quick View Modal */}
            {selectedProduct && (
                <QuickViewModal
                    product={selectedProduct}
                    onClose={() => setSelectedProduct(null)}
                    onAddToCart={(product) => {
                        addToCart(product);
                        toast.success(`Đã thêm ${product.name} vào giỏ hàng!`);
                    }}
                />
            )}
        </section>
    );
};

export default BestSellers;
