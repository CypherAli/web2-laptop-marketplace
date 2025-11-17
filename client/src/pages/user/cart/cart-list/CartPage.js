import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CartContext from '../../../../context/CartContext';
import AuthContext from '../../../../context/AuthContext';
import axios from '../../../../api/axiosConfig';
import { PLACEHOLDER_IMAGES } from '../../../../utils/placeholder';
import './CartPage.css';

const CartPage = () => {
    const { cartItems, removeFromCart, updateQuantity } = useContext(CartContext);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [selectedItems, setSelectedItems] = useState(cartItems.map(item => item._id));
    const [shippingInfo, setShippingInfo] = useState({
        fullName: user?.username || '',
        phone: '',
        address: '',
        city: 'Hồ Chí Minh'
    });
    const [paymentMethod, setPaymentMethod] = useState('cod');
    const [notes, setNotes] = useState('');
    const [showCheckoutModal, setShowCheckoutModal] = useState(false);

    // Toggle item selection
    const toggleItemSelection = (itemId) => {
        setSelectedItems(prev => 
            prev.includes(itemId) 
                ? prev.filter(id => id !== itemId)
                : [...prev, itemId]
        );
    };

    // Select all items
    const toggleSelectAll = () => {
        if (selectedItems.length === cartItems.length) {
            setSelectedItems([]);
        } else {
            setSelectedItems(cartItems.map(item => item._id));
        }
    };

    // Calculate selected items total
    const getSelectedTotal = () => {
        return cartItems
            .filter(item => selectedItems.includes(item._id))
            .reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    // Calculate shipping fee
    const getShippingFee = () => {
        const total = getSelectedTotal();
        if (total >= 15000000) return 0; // Free shipping for orders >= 15M
        return 30000; // 30k shipping
    };

    const handleCheckout = async (e) => {
        e.preventDefault();

        if (!user) {
            alert('⚠️ Vui lòng đăng nhập để đặt hàng');
            navigate('/login');
            return;
        }

        if (selectedItems.length === 0) {
            alert('⚠️ Vui lòng chọn ít nhất một sản phẩm');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const selectedCartItems = cartItems.filter(item => selectedItems.includes(item._id));
            
            const orderData = {
                items: selectedCartItems.map(item => ({
                    product: item._id,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    imageUrl: item.imageUrl
                })),
                totalAmount: getSelectedTotal() + getShippingFee(),
                shippingAddress: shippingInfo,
                paymentMethod: paymentMethod,
                notes: notes
            };

            await axios.post('/orders', orderData);
            
            setSuccess(true);
            
            // Remove ordered items from cart
            selectedCartItems.forEach(item => removeFromCart(item._id));
            
            setTimeout(() => {
                navigate('/orders');
            }, 2000);
        } catch (err) {
            console.error('Checkout error:', err);
            setError(err.response?.data?.message || 'Đặt hàng thất bại. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className="cart-empty-container">
                <div className="empty-cart-illustration">
                    <div className="empty-cart-icon">🛒</div>
                    <h2>Giỏ hàng trống</h2>
                    <p>Hãy thêm sản phẩm vào giỏ hàng để tiếp tục mua sắm!</p>
                    <button onClick={() => navigate('/')} className="btn-continue-shopping">
                        <span>🏠</span>
                        <span>Tiếp tục mua sắm</span>
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="cart-page-container">
            {/* Success Modal */}
            {success && (
                <div className="success-modal-overlay">
                    <div className="success-modal">
                        <div className="success-icon">✅</div>
                        <h2>Đặt hàng thành công!</h2>
                        <p>Đơn hàng của bạn đang được xử lý</p>
                        <div className="success-animation"></div>
                    </div>
                </div>
            )}

            <div className="cart-header">
                <h1>
                    <span className="cart-icon">🛒</span>
                    Giỏ Hàng Của Bạn
                </h1>
                <div className="cart-count">
                    {cartItems.length} sản phẩm
                </div>
            </div>

            <div className="cart-layout">
                {/* Left: Cart Items */}
                <div className="cart-items-section">
                    {/* Select All Header */}
                    <div className="cart-select-all">
                        <label className="checkbox-container">
                            <input 
                                type="checkbox"
                                checked={selectedItems.length === cartItems.length && cartItems.length > 0}
                                onChange={toggleSelectAll}
                            />
                            <span className="checkmark"></span>
                            <span className="label-text">Chọn tất cả ({cartItems.length})</span>
                        </label>
                        {selectedItems.length > 0 && (
                            <button 
                                onClick={() => {
                                    if (window.confirm(`Xóa ${selectedItems.length} sản phẩm đã chọn?`)) {
                                        selectedItems.forEach(id => removeFromCart(id));
                                        setSelectedItems([]);
                                    }
                                }}
                                className="btn-delete-selected"
                            >
                                <span>🗑️</span>
                                <span>Xóa đã chọn</span>
                            </button>
                        )}
                    </div>

                    {/* Cart Items List */}
                    <div className="cart-items-list">
                        {cartItems.map(item => (
                            <div 
                                key={item._id} 
                                className={`cart-item-card ${selectedItems.includes(item._id) ? 'selected' : ''}`}
                            >
                                <label className="checkbox-container">
                                    <input 
                                        type="checkbox"
                                        checked={selectedItems.includes(item._id)}
                                        onChange={() => toggleItemSelection(item._id)}
                                    />
                                    <span className="checkmark"></span>
                                </label>

                                <div className="item-image">
                                    <img 
                                        src={item.imageUrl || PLACEHOLDER_IMAGES.cart} 
                                        alt={item.name}
                                    />
                                    {item.stock <= 5 && (
                                        <div className="low-stock-badge">Chỉ còn {item.stock}</div>
                                    )}
                                </div>

                                <div className="item-details">
                                    <h3 className="item-name">{item.name}</h3>
                                    <div className="item-meta">
                                        <span className="item-brand">🏷️ {item.brand}</span>
                                        <span className="item-stock">📦 Kho: {item.stock}</span>
                                    </div>
                                    <div className="item-price-section">
                                        <div className="current-price">
                                            {item.price.toLocaleString('vi-VN')} đ
                                        </div>
                                        {item.discountedPrice && (
                                            <div className="original-price">
                                                {item.discountedPrice.toLocaleString('vi-VN')} đ
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="item-actions">
                                    <div className="quantity-controller">
                                        <button 
                                            onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                            disabled={item.quantity <= 1}
                                            className="qty-btn"
                                        >
                                            <span>−</span>
                                        </button>
                                        <input 
                                            type="number" 
                                            value={item.quantity}
                                            onChange={(e) => {
                                                const val = parseInt(e.target.value) || 1;
                                                if (val >= 1 && val <= item.stock) {
                                                    updateQuantity(item._id, val);
                                                }
                                            }}
                                            min="1"
                                            max={item.stock}
                                            className="qty-input"
                                        />
                                        <button 
                                            onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                            disabled={item.quantity >= item.stock}
                                            className="qty-btn"
                                        >
                                            <span>+</span>
                                        </button>
                                    </div>

                                    <div className="item-subtotal">
                                        {(item.price * item.quantity).toLocaleString('vi-VN')} đ
                                    </div>

                                    <button 
                                        onClick={() => {
                                            if (window.confirm('Xóa sản phẩm này khỏi giỏ hàng?')) {
                                                removeFromCart(item._id);
                                                setSelectedItems(prev => prev.filter(id => id !== item._id));
                                            }
                                        }}
                                        className="btn-remove-item"
                                        title="Xóa sản phẩm"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right: Order Summary */}
                <div className="cart-summary-section">
                    <div className="summary-card">
                        <h2 className="summary-title">
                            <span>📋</span>
                            <span>Thông tin đơn hàng</span>
                        </h2>

                        <div className="summary-details">
                            <div className="summary-row">
                                <span>Tạm tính ({selectedItems.length} sản phẩm)</span>
                                <span className="amount">{getSelectedTotal().toLocaleString('vi-VN')} đ</span>
                            </div>
                            
                            <div className="summary-row">
                                <span>Phí vận chuyển</span>
                                <span className={`amount ${getShippingFee() === 0 ? 'free' : ''}`}>
                                    {getShippingFee() === 0 ? 'Miễn phí' : `${getShippingFee().toLocaleString('vi-VN')} đ`}
                                </span>
                            </div>

                            {getSelectedTotal() < 15000000 && getSelectedTotal() > 0 && (
                                <div className="shipping-notice">
                                    💡 Mua thêm {(15000000 - getSelectedTotal()).toLocaleString('vi-VN')} đ để được miễn phí vận chuyển
                                </div>
                            )}

                            <div className="summary-divider"></div>

                            <div className="summary-row total-row">
                                <span>Tổng cộng</span>
                                <span className="total-amount">
                                    {(getSelectedTotal() + getShippingFee()).toLocaleString('vi-VN')} đ
                                </span>
                            </div>
                        </div>

                        <button 
                            onClick={() => {
                                if (!user) {
                                    navigate('/login');
                                    return;
                                }
                                if (selectedItems.length === 0) {
                                    alert('⚠️ Vui lòng chọn sản phẩm để thanh toán');
                                    return;
                                }
                                navigate('/checkout');
                            }}
                            className="btn-checkout"
                            disabled={selectedItems.length === 0}
                        >
                            <span>Thanh Toán ({selectedItems.length})</span>
                            <span>→</span>
                        </button>

                        <div className="security-badges">
                            <div className="badge">
                                <span>🔒</span>
                                <span>Thanh toán an toàn</span>
                            </div>
                            <div className="badge">
                                <span>📦</span>
                                <span>Giao hàng toàn quốc</span>
                            </div>
                            <div className="badge">
                                <span>↩️</span>
                                <span>Đổi trả dễ dàng</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Checkout Modal */}
            {showCheckoutModal && (
                <div className="checkout-modal-overlay" onClick={() => setShowCheckoutModal(false)}>
                    <div className="checkout-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>
                                <span>📝</span>
                                <span>Thông tin giao hàng</span>
                            </h2>
                            <button onClick={() => setShowCheckoutModal(false)} className="btn-close-modal">
                                ✕
                            </button>
                        </div>

                        {error && (
                            <div className="checkout-error">
                                <span>⚠️</span>
                                <span>{error}</span>
                            </div>
                        )}

                        <form onSubmit={handleCheckout} className="checkout-form">
                            <div className="form-section">
                                <label className="form-label">
                                    <span>👤</span>
                                    <span>Họ và tên</span>
                                </label>
                                <input 
                                    type="text"
                                    placeholder="Nguyễn Văn A"
                                    value={shippingInfo.fullName}
                                    onChange={(e) => setShippingInfo({...shippingInfo, fullName: e.target.value})}
                                    required
                                    className="form-input"
                                />
                            </div>

                            <div className="form-section">
                                <label className="form-label">
                                    <span>📱</span>
                                    <span>Số điện thoại</span>
                                </label>
                                <input 
                                    type="tel"
                                    placeholder="0901234567"
                                    value={shippingInfo.phone}
                                    onChange={(e) => setShippingInfo({...shippingInfo, phone: e.target.value})}
                                    required
                                    pattern="[0-9]{10}"
                                    className="form-input"
                                />
                            </div>

                            <div className="form-section">
                                <label className="form-label">
                                    <span>🏠</span>
                                    <span>Địa chỉ nhận hàng</span>
                                </label>
                                <textarea 
                                    placeholder="Số nhà, tên đường, phường/xã"
                                    value={shippingInfo.address}
                                    onChange={(e) => setShippingInfo({...shippingInfo, address: e.target.value})}
                                    required
                                    rows="3"
                                    className="form-textarea"
                                />
                            </div>

                            <div className="form-section">
                                <label className="form-label">
                                    <span>🏙️</span>
                                    <span>Tỉnh/Thành phố</span>
                                </label>
                                <select 
                                    value={shippingInfo.city}
                                    onChange={(e) => setShippingInfo({...shippingInfo, city: e.target.value})}
                                    required
                                    className="form-select"
                                >
                                    <option value="Hồ Chí Minh">Hồ Chí Minh</option>
                                    <option value="Hà Nội">Hà Nội</option>
                                    <option value="Đà Nẵng">Đà Nẵng</option>
                                    <option value="Cần Thơ">Cần Thơ</option>
                                    <option value="Khác">Khác</option>
                                </select>
                            </div>

                            <div className="form-section">
                                <label className="form-label">
                                    <span>💳</span>
                                    <span>Phương thức thanh toán</span>
                                </label>
                                <div className="payment-methods">
                                    <label className={`payment-option ${paymentMethod === 'cod' ? 'selected' : ''}`}>
                                        <input 
                                            type="radio"
                                            name="payment"
                                            value="cod"
                                            checked={paymentMethod === 'cod'}
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                        />
                                        <div className="payment-content">
                                            <span className="payment-icon">💵</span>
                                            <div>
                                                <div className="payment-name">Thanh toán khi nhận hàng (COD)</div>
                                                <div className="payment-desc">Thanh toán bằng tiền mặt khi nhận hàng</div>
                                            </div>
                                        </div>
                                    </label>

                                    <label className={`payment-option ${paymentMethod === 'bank_transfer' ? 'selected' : ''}`}>
                                        <input 
                                            type="radio"
                                            name="payment"
                                            value="bank_transfer"
                                            checked={paymentMethod === 'bank_transfer'}
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                        />
                                        <div className="payment-content">
                                            <span className="payment-icon">🏦</span>
                                            <div>
                                                <div className="payment-name">Chuyển khoản ngân hàng</div>
                                                <div className="payment-desc">Chuyển khoản trước khi nhận hàng</div>
                                            </div>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            <div className="form-section">
                                <label className="form-label">
                                    <span>📝</span>
                                    <span>Ghi chú (không bắt buộc)</span>
                                </label>
                                <textarea 
                                    placeholder="Ghi chú cho người bán..."
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    rows="2"
                                    className="form-textarea"
                                />
                            </div>

                            <div className="modal-summary">
                                <div className="summary-item">
                                    <span>Tổng tiền hàng:</span>
                                    <span>{getSelectedTotal().toLocaleString('vi-VN')} đ</span>
                                </div>
                                <div className="summary-item">
                                    <span>Phí vận chuyển:</span>
                                    <span>{getShippingFee().toLocaleString('vi-VN')} đ</span>
                                </div>
                                <div className="summary-item total">
                                    <span>Tổng thanh toán:</span>
                                    <span className="total-price">
                                        {(getSelectedTotal() + getShippingFee()).toLocaleString('vi-VN')} đ
                                    </span>
                                </div>
                            </div>

                            <div className="modal-actions">
                                <button 
                                    type="button"
                                    onClick={() => setShowCheckoutModal(false)}
                                    className="btn-cancel"
                                    disabled={loading}
                                >
                                    Hủy
                                </button>
                                <button 
                                    type="submit" 
                                    className="btn-submit-order"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <span className="spinner-icon"></span>
                                            <span>Đang xử lý...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>Đặt hàng</span>
                                            <span>→</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CartPage;
