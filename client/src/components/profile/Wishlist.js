import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../api/axiosConfig';
import { useToast } from '../common/Toast';
import { PLACEHOLDER_IMAGES } from '../../utils/placeholder';
import './ProfileTabs.css';

const Wishlist = () => {
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const toast = useToast();

    useEffect(() => {
        fetchWishlist();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchWishlist = async () => {
        try {
            const response = await axios.get('/user/wishlist');
            setWishlist(response.data);
        } catch (error) {
            console.error('Fetch wishlist error:', error);
            toast.error('Không thể tải danh sách yêu thích');
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = async (productId) => {
        try {
            await axios.delete(`/user/wishlist/${productId}`);
            setWishlist(wishlist.filter(item => item.product._id !== productId));
            toast.success('Đã xóa khỏi danh sách yêu thích');
        } catch (error) {
            console.error('Remove wishlist error:', error);
            toast.error('Không thể xóa sản phẩm');
        }
    };

    const handleAddToCart = async (product) => {
        try {
            await axios.post('/cart', { 
                productId: product._id, 
                quantity: 1 
            });
            toast.success('Đã thêm vào giỏ hàng');
        } catch (error) {
            console.error('Add to cart error:', error);
            toast.error(error.response?.data?.message || 'Không thể thêm vào giỏ hàng');
        }
    };

    const handleViewProduct = (productId) => {
        navigate(`/product/${productId}`);
    };

    if (loading) {
        return (
            <div className="profile-tab-loading">
                <div className="spinner"></div>
                <p>Đang tải...</p>
            </div>
        );
    }

    if (wishlist.length === 0) {
        return (
            <div className="empty-state">
                <div className="empty-icon">❤️</div>
                <h3>Danh sách yêu thích trống</h3>
                <p>Bạn chưa thêm sản phẩm nào vào danh sách yêu thích</p>
                <button 
                    className="btn-primary"
                    onClick={() => navigate('/')}
                >
                    Khám phá sản phẩm
                </button>
            </div>
        );
    }

    return (
        <div className="wishlist-tab">
            <div className="tab-header">
                <h2>
                    <span className="icon">❤️</span>
                    Danh sách yêu thích
                </h2>
                <p className="subtitle">{wishlist.length} sản phẩm</p>
            </div>

            <div className="wishlist-grid">
                {wishlist.map((item) => (
                    <div key={item._id} className="wishlist-card">
                        <div className="wishlist-image">
                            <img 
                                src={item.product?.imageUrl || PLACEHOLDER_IMAGES.product} 
                                alt={item.product?.name}
                                onClick={() => handleViewProduct(item.product._id)}
                                style={{ cursor: 'pointer' }}
                            />
                            <button 
                                className="btn-remove"
                                onClick={() => handleRemove(item.product._id)}
                                title="Xóa khỏi yêu thích"
                            >
                                ×
                            </button>
                            {item.product?.stock === 0 && (
                                <div className="out-of-stock-badge">Hết hàng</div>
                            )}
                        </div>
                        
                        <div className="wishlist-info">
                            <h3 
                                onClick={() => handleViewProduct(item.product._id)}
                                style={{ cursor: 'pointer' }}
                            >
                                {item.product?.name}
                            </h3>
                            
                            <div className="product-specs">
                                {item.product?.brand && (
                                    <span className="spec-badge">{item.product.brand}</span>
                                )}
                                {item.product?.model && (
                                    <span className="spec-badge">{item.product.model}</span>
                                )}
                            </div>

                            <div className="wishlist-price">
                                <span className="price">
                                    {item.product?.price?.toLocaleString()} ₫
                                </span>
                            </div>

                            <div className="wishlist-actions">
                                <button 
                                    className="btn-add-cart"
                                    onClick={() => handleAddToCart(item.product)}
                                    disabled={item.product?.stock === 0}
                                >
                                    <span>🛒</span>
                                    Thêm vào giỏ
                                </button>
                                <button 
                                    className="btn-view"
                                    onClick={() => handleViewProduct(item.product._id)}
                                >
                                    Xem chi tiết
                                </button>
                            </div>

                            <div className="added-date">
                                Đã thêm: {new Date(item.addedAt).toLocaleDateString('vi-VN')}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Wishlist;
