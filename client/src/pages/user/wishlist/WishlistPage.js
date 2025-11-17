import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import WishlistContext from '../../../context/WishlistContext';
import CartContext from '../../../context/CartContext';
import { PLACEHOLDER_IMAGES } from '../../../utils/placeholder';
import './WishlistPage.css';

const WishlistPage = () => {
    const { wishlist, removeFromWishlist, clearWishlist } = useContext(WishlistContext);
    const { addToCart } = useContext(CartContext);
    const navigate = useNavigate();

    const handleAddToCart = (product) => {
        addToCart(product);
        alert(`${product.name} đã được thêm vào giỏ hàng!`);
    };

    const handleMoveToCart = (product) => {
        addToCart(product);
        removeFromWishlist(product._id);
        alert(`${product.name} đã được chuyển vào giỏ hàng!`);
    };

    if (wishlist.length === 0) {
        return (
            <div className="wishlist-page">
                <div className="wishlist-empty">
                    <div className="empty-icon">❤️</div>
                    <h2>Danh sách yêu thích trống</h2>
                    <p>Hãy thêm những sản phẩm bạn yêu thích để xem lại sau!</p>
                    <button className="btn-shop" onClick={() => navigate('/')}>
                        Khám phá sản phẩm
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="wishlist-page">
            <div className="wishlist-header">
                <div className="header-left">
                    <h1>
                        <span className="heart-icon">❤️</span>
                        Danh sách yêu thích
                    </h1>
                    <span className="wishlist-count">{wishlist.length} sản phẩm</span>
                </div>
                <button className="btn-clear-all" onClick={clearWishlist}>
                    🗑️ Xóa tất cả
                </button>
            </div>

            <div className="wishlist-grid">
                {wishlist.map(product => (
                    <div key={product._id} className="wishlist-card">
                        <button
                            className="btn-remove-item"
                            onClick={() => removeFromWishlist(product._id)}
                            title="Xóa khỏi wishlist"
                        >
                            ✕
                        </button>

                        <div className="wishlist-image-wrapper">
                            <img 
                                src={product.imageUrl || PLACEHOLDER_IMAGES.product} 
                                alt={product.name}
                                className="wishlist-image"
                            />
                            {product.stock === 0 && (
                                <div className="out-of-stock-overlay">
                                    <span>Hết hàng</span>
                                </div>
                            )}
                        </div>

                        <div className="wishlist-info">
                            <h3 className="wishlist-product-name">{product.name}</h3>
                            <p className="wishlist-brand">{product.brand}</p>
                            
                            <div className="wishlist-price">
                                <span className="price-value">
                                    {product.price.toLocaleString()} VNĐ
                                </span>
                            </div>

                            <div className="wishlist-stock">
                                {product.stock > 0 ? (
                                    <span className="in-stock">
                                        ✓ Còn {product.stock} sản phẩm
                                    </span>
                                ) : (
                                    <span className="out-of-stock">
                                        ✕ Hết hàng
                                    </span>
                                )}
                            </div>

                            <div className="wishlist-actions">
                                <button
                                    className="btn-move-to-cart"
                                    onClick={() => handleMoveToCart(product)}
                                    disabled={product.stock === 0}
                                >
                                    🛒 Chuyển vào giỏ
                                </button>
                                <button
                                    className="btn-add-to-cart"
                                    onClick={() => handleAddToCart(product)}
                                    disabled={product.stock === 0}
                                >
                                    + Thêm vào giỏ
                                </button>
                            </div>
                        </div>

                        {product.addedAt && (
                            <div className="added-date">
                                Đã thêm: {new Date(product.addedAt).toLocaleDateString('vi-VN')}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WishlistPage;
