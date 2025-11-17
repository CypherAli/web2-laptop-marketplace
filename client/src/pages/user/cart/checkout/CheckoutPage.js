import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../../../api/axiosConfig';
import AuthContext from '../../../../context/AuthContext';
import { useToast } from '../../../../components/common/Toast';
import { PLACEHOLDER_IMAGES } from '../../../../utils/placeholder';
import './CheckoutPage.css';

const CheckoutPage = () => {
    const { user } = useContext(AuthContext);
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();
    const toast = useToast();

    // Shipping Information
    const [shippingInfo, setShippingInfo] = useState({
        fullName: user?.name || '',
        email: user?.email || '',
        phone: '',
        address: '',
        city: '',
        district: '',
        ward: '',
        notes: ''
    });

    // Payment Method
    const [paymentMethod, setPaymentMethod] = useState('cod'); // cod, bank, momo, zalopay

    const fetchCart = async () => {
        try {
            const res = await axios.get('/cart');
            setCartItems(res.data.items || []);
        } catch (err) {
            toast.error('Không thể tải giỏ hàng');
        } finally {
            setLoading(false);
        }
    };

    // Load cart on mount
    React.useEffect(() => {
        if (!user) {
            toast.error('Vui lòng đăng nhập để thanh toán');
            navigate('/login');
            return;
        }
        fetchCart();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, navigate]);

    const calculateSubtotal = () => {
        return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    };

    const calculateShipping = () => {
        const subtotal = calculateSubtotal();
        return subtotal >= 10000000 ? 0 : 30000; // Free shipping for orders >= 10M
    };

    const calculateTotal = () => {
        return calculateSubtotal() + calculateShipping();
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setShippingInfo(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validateForm = () => {
        if (!shippingInfo.fullName.trim()) {
            toast.error('Vui lòng nhập họ tên');
            return false;
        }
        if (!shippingInfo.phone.trim()) {
            toast.error('Vui lòng nhập số điện thoại');
            return false;
        }
        if (!shippingInfo.address.trim()) {
            toast.error('Vui lòng nhập địa chỉ');
            return false;
        }
        if (!shippingInfo.city.trim()) {
            toast.error('Vui lòng chọn Tỉnh/Thành phố');
            return false;
        }
        return true;
    };

    const handleSubmitOrder = async (e) => {
        e.preventDefault();

        if (cartItems.length === 0) {
            toast.error('Giỏ hàng trống');
            return;
        }

        if (!validateForm()) {
            return;
        }

        setSubmitting(true);

        try {
            const orderData = {
                items: cartItems.map(item => ({
                    productId: item.product._id,  // Changed from 'product' to 'productId'
                    quantity: item.quantity
                })),
                shippingAddress: {
                    fullName: shippingInfo.fullName,
                    phone: shippingInfo.phone,
                    address: shippingInfo.address,
                    ward: shippingInfo.ward,
                    district: shippingInfo.district,
                    city: shippingInfo.city
                },
                paymentMethod: paymentMethod,
                notes: shippingInfo.notes
            };

            console.log('📦 Submitting order:', orderData);
            const response = await axios.post('/orders', orderData);
            console.log('✅ Order response:', response.data);
            
            // Clear cart after successful order
            await axios.delete('/cart/clear/all');
            
            toast.success('Đặt hàng thành công!');
            navigate(`/orders`);
        } catch (err) {
            console.error('Order submission failed', err);
            const errorMsg = err.response?.data?.message || 'Đặt hàng thất bại. Vui lòng thử lại.';
            toast.error(errorMsg);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <h2>Đang tải thông tin...</h2>
            </div>
        );
    }

    if (cartItems.length === 0) {
        return (
            <div className="empty-checkout">
                <div className="empty-icon">🛒</div>
                <h2>Giỏ hàng trống</h2>
                <p>Vui lòng thêm sản phẩm vào giỏ hàng trước khi thanh toán</p>
                <button onClick={() => navigate('/')} className="btn-shop">
                    Tiếp tục mua sắm
                </button>
            </div>
        );
    }

    return (
        <div className="checkout-page">
            <div className="checkout-container">
                <h1 className="checkout-title">
                    <span className="title-icon">💳</span>
                    Thanh Toán
                </h1>

                <form onSubmit={handleSubmitOrder} className="checkout-form">
                    <div className="checkout-main">
                        {/* Shipping Information */}
                        <div className="checkout-section">
                            <h2 className="section-title">
                                <span className="section-icon">📍</span>
                                Thông tin giao hàng
                            </h2>

                            <div className="form-grid">
                                <div className="form-group full-width">
                                    <label>Họ và tên <span className="required">*</span></label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={shippingInfo.fullName}
                                        onChange={handleInputChange}
                                        placeholder="Nguyễn Văn A"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={shippingInfo.email}
                                        onChange={handleInputChange}
                                        placeholder="email@example.com"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Số điện thoại <span className="required">*</span></label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={shippingInfo.phone}
                                        onChange={handleInputChange}
                                        placeholder="0912345678"
                                        required
                                    />
                                </div>

                                <div className="form-group full-width">
                                    <label>Địa chỉ <span className="required">*</span></label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={shippingInfo.address}
                                        onChange={handleInputChange}
                                        placeholder="Số nhà, tên đường"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Phường/Xã</label>
                                    <input
                                        type="text"
                                        name="ward"
                                        value={shippingInfo.ward}
                                        onChange={handleInputChange}
                                        placeholder="Phường 1"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Quận/Huyện</label>
                                    <input
                                        type="text"
                                        name="district"
                                        value={shippingInfo.district}
                                        onChange={handleInputChange}
                                        placeholder="Quận 1"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Tỉnh/Thành phố <span className="required">*</span></label>
                                    <select
                                        name="city"
                                        value={shippingInfo.city}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        <option value="">Chọn Tỉnh/Thành phố</option>
                                        <option value="Hà Nội">Hà Nội</option>
                                        <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</option>
                                        <option value="Đà Nẵng">Đà Nẵng</option>
                                        <option value="Hải Phòng">Hải Phòng</option>
                                        <option value="Cần Thơ">Cần Thơ</option>
                                        <option value="Khác">Khác</option>
                                    </select>
                                </div>

                                <div className="form-group full-width">
                                    <label>Ghi chú (tùy chọn)</label>
                                    <textarea
                                        name="notes"
                                        value={shippingInfo.notes}
                                        onChange={handleInputChange}
                                        placeholder="Ghi chú thêm về đơn hàng (tùy chọn)"
                                        rows="3"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Payment Method */}
                        <div className="checkout-section">
                            <h2 className="section-title">
                                <span className="section-icon">💰</span>
                                Phương thức thanh toán
                            </h2>

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
                                            <strong>Thanh toán khi nhận hàng (COD)</strong>
                                            <p>Thanh toán bằng tiền mặt khi nhận hàng</p>
                                        </div>
                                    </div>
                                </label>

                                <label className={`payment-option ${paymentMethod === 'bank' ? 'selected' : ''}`}>
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="bank"
                                        checked={paymentMethod === 'bank'}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                    />
                                    <div className="payment-content">
                                        <span className="payment-icon">🏦</span>
                                        <div>
                                            <strong>Chuyển khoản ngân hàng</strong>
                                            <p>Chuyển khoản qua Internet Banking</p>
                                        </div>
                                    </div>
                                </label>

                                <label className={`payment-option ${paymentMethod === 'momo' ? 'selected' : ''}`}>
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="momo"
                                        checked={paymentMethod === 'momo'}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                    />
                                    <div className="payment-content">
                                        <span className="payment-icon">📱</span>
                                        <div>
                                            <strong>Ví MoMo</strong>
                                            <p>Thanh toán qua ví điện tử MoMo</p>
                                        </div>
                                    </div>
                                </label>

                                <label className={`payment-option ${paymentMethod === 'zalopay' ? 'selected' : ''}`}>
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="zalopay"
                                        checked={paymentMethod === 'zalopay'}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                    />
                                    <div className="payment-content">
                                        <span className="payment-icon">💙</span>
                                        <div>
                                            <strong>ZaloPay</strong>
                                            <p>Thanh toán qua ví điện tử ZaloPay</p>
                                        </div>
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Order Summary Sidebar */}
                    <div className="checkout-sidebar">
                        <div className="order-summary">
                            <h2 className="summary-title">
                                <span>📦</span>
                                Đơn hàng của bạn
                            </h2>

                            <div className="summary-items">
                                {cartItems.map((item, index) => (
                                    <div key={index} className="summary-item">
                                        <img 
                                            src={item.product?.imageUrl || PLACEHOLDER_IMAGES.avatar} 
                                            alt={item.product?.name}
                                        />
                                        <div className="item-info">
                                            <p className="item-name">{item.product?.name}</p>
                                            <p className="item-quantity">x{item.quantity}</p>
                                        </div>
                                        <p className="item-price">
                                            {(item.price * item.quantity).toLocaleString()} ₫
                                        </p>
                                    </div>
                                ))}
                            </div>

                            <div className="summary-calculations">
                                <div className="calc-row">
                                    <span>Tạm tính:</span>
                                    <span>{calculateSubtotal().toLocaleString()} ₫</span>
                                </div>
                                <div className="calc-row">
                                    <span>Phí vận chuyển:</span>
                                    <span>{calculateShipping() === 0 ? 'Miễn phí' : `${calculateShipping().toLocaleString()} ₫`}</span>
                                </div>
                                {calculateShipping() === 0 && (
                                    <div className="free-shipping-note">
                                        🎉 Miễn phí vận chuyển cho đơn hàng từ 10.000.000 ₫
                                    </div>
                                )}
                                <div className="calc-row total">
                                    <span>Tổng cộng:</span>
                                    <span className="total-amount">{calculateTotal().toLocaleString()} ₫</span>
                                </div>
                            </div>

                            <button 
                                type="submit" 
                                className="btn-submit-order"
                                disabled={submitting}
                            >
                                {submitting ? (
                                    <>
                                        <span className="spinner-small"></span>
                                        Đang xử lý...
                                    </>
                                ) : (
                                    <>
                                        <span>Đặt hàng</span>
                                        <span>→</span>
                                    </>
                                )}
                            </button>

                            <div className="checkout-note">
                                <p>🔒 Thông tin của bạn được bảo mật</p>
                                <p>📞 Hotline: 1900 xxxx</p>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CheckoutPage;
