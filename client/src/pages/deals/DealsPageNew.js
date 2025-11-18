import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../api/axiosConfig';
import CartContext from '../../context/CartContext';
import WishlistContext from '../../context/WishlistContext';
import { useToast } from '../../components/common/Toast';

const DealsPageNew = () => {
    const navigate = useNavigate();
    const toast = useToast();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, highDiscount, lowPrice
    const { addToCart } = useContext(CartContext);
    const { toggleWishlist, isInWishlist } = useContext(WishlistContext);

    useEffect(() => {
        fetchDeals();
    }, []);

    const fetchDeals = async () => {
        try {
            setLoading(true);
            const res = await axios.get('/products', {
                params: {
                    limit: 50,
                    inStock: true
                }
            });
            
            const productsData = res.data.products || res.data;
            const dealsProducts = productsData
                .filter(p => p.originalPrice && p.originalPrice > p.price)
                .map(p => ({
                    ...p,
                    discountPercent: Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100),
                    savings: p.originalPrice - p.price
                }))
                .sort((a, b) => b.discountPercent - a.discountPercent);
            
            setProducts(dealsProducts);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching deals:', err);
            setLoading(false);
        }
    };

    const getFilteredProducts = () => {
        let filtered = [...products];
        if (filter === 'highDiscount') {
            filtered.sort((a, b) => b.discountPercent - a.discountPercent);
        } else if (filter === 'lowPrice') {
            filtered.sort((a, b) => a.price - b.price);
        }
        return filtered;
    };

    const handleAddToCart = (product) => {
        addToCart(product);
        toast.success(`✅ Đã thêm ${product.name} vào giỏ hàng!`);
    };

    if (loading) {
        return (
            <div style={{
                minHeight: '100vh',
                paddingTop: '150px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            }}>
                <div style={{textAlign: 'center', color: 'white'}}>
                    <div style={{
                        width: '60px',
                        height: '60px',
                        border: '4px solid rgba(255,255,255,0.3)',
                        borderTop: '4px solid white',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                        margin: '0 auto 20px'
                    }}></div>
                    <h2>Loading hot deals...</h2>
                    <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); }}`}</style>
                </div>
            </div>
        );
    }

    const filteredProducts = getFilteredProducts();
    const maxDiscount = products.length > 0 ? Math.max(...products.map(p => p.discountPercent)) : 0;
    const totalSavings = products.reduce((sum, p) => sum + p.savings, 0);

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            paddingBottom: '60px'
        }}>
            {/* Hero Banner */}
            <div style={{
                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                padding: '140px 30px 60px',
                textAlign: 'center',
                color: 'white',
                position: 'relative',
                overflow: 'hidden'
            }}>
                {/* Animated Background */}
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    opacity: 0.1,
                    background: 'repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.5) 35px, rgba(255,255,255,.5) 70px)'
                }}></div>

                <div style={{position: 'relative', zIndex: 1, maxWidth: '1200px', margin: '0 auto'}}>
                    <div style={{fontSize: '4rem', marginBottom: '10px', animation: 'pulse 2s infinite'}}>🔥</div>
                    <h1 style={{
                        fontSize: '3.5rem',
                        fontWeight: '900',
                        marginBottom: '20px',
                        textShadow: '3px 3px 6px rgba(0,0,0,0.3)',
                        letterSpacing: '2px'
                    }}>
                        SUPER HOT DEALS
                    </h1>
                    <p style={{
                        fontSize: '1.4rem',
                        marginBottom: '40px',
                        fontWeight: '500',
                        textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
                    }}>
                        Grab deals now - Discounts up to {maxDiscount}%
                    </p>

                    {/* Stats Cards */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: '30px',
                        maxWidth: '900px',
                        margin: '0 auto'
                    }}>
                        <div style={{
                            background: 'rgba(255,255,255,0.2)',
                            backdropFilter: 'blur(10px)',
                            padding: '30px',
                            borderRadius: '20px',
                            border: '2px solid rgba(255,255,255,0.3)'
                        }}>
                            <div style={{fontSize: '3rem', fontWeight: '900', marginBottom: '10px'}}>
                                {products.length}
                            </div>
                            <div style={{fontSize: '1rem', opacity: 0.9}}>Products on sale</div>
                        </div>
                        <div style={{
                            background: 'rgba(255,255,255,0.2)',
                            backdropFilter: 'blur(10px)',
                            padding: '30px',
                            borderRadius: '20px',
                            border: '2px solid rgba(255,255,255,0.3)'
                        }}>
                            <div style={{fontSize: '3rem', fontWeight: '900', marginBottom: '10px'}}>
                                -{maxDiscount}%
                            </div>
                            <div style={{fontSize: '1rem', opacity: 0.9}}>Maximum discount</div>
                        </div>
                        <div style={{
                            background: 'rgba(255,255,255,0.2)',
                            backdropFilter: 'blur(10px)',
                            padding: '30px',
                            borderRadius: '20px',
                            border: '2px solid rgba(255,255,255,0.3)'
                        }}>
                            <div style={{fontSize: '2rem', fontWeight: '900', marginBottom: '10px'}}>
                                {(totalSavings / 1000000).toFixed(1)}M
                            </div>
                            <div style={{fontSize: '1rem', opacity: 0.9}}>Total savings</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filter Bar */}
            <div style={{
                background: 'white',
                padding: '25px 30px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                position: 'sticky',
                top: '140px',
                zIndex: 100
            }}>
                <div style={{
                    maxWidth: '1400px',
                    margin: '0 auto',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <div style={{fontSize: '1.1rem', fontWeight: 'bold', color: '#333'}}>
                        🎯 Found {filteredProducts.length} hot products
                    </div>
                    <div style={{display: 'flex', gap: '15px'}}>
                        <button
                            onClick={() => setFilter('all')}
                            style={{
                                padding: '12px 25px',
                                border: filter === 'all' ? '2px solid #f5576c' : '2px solid #ddd',
                                background: filter === 'all' ? '#f5576c' : 'white',
                                color: filter === 'all' ? 'white' : '#333',
                                borderRadius: '25px',
                                cursor: 'pointer',
                                fontWeight: 'bold',
                                fontSize: '0.95rem',
                                transition: 'all 0.3s',
                                boxShadow: filter === 'all' ? '0 4px 15px rgba(245,87,108,0.3)' : 'none'
                            }}
                        >
                            🔥 Tất cả
                        </button>
                        <button
                            onClick={() => setFilter('highDiscount')}
                            style={{
                                padding: '12px 25px',
                                border: filter === 'highDiscount' ? '2px solid #f5576c' : '2px solid #ddd',
                                background: filter === 'highDiscount' ? '#f5576c' : 'white',
                                color: filter === 'highDiscount' ? 'white' : '#333',
                                borderRadius: '25px',
                                cursor: 'pointer',
                                fontWeight: 'bold',
                                fontSize: '0.95rem',
                                transition: 'all 0.3s',
                                boxShadow: filter === 'highDiscount' ? '0 4px 15px rgba(245,87,108,0.3)' : 'none'
                            }}
                        >
                            💥 Giảm nhiều nhất
                        </button>
                        <button
                            onClick={() => setFilter('lowPrice')}
                            style={{
                                padding: '12px 25px',
                                border: filter === 'lowPrice' ? '2px solid #f5576c' : '2px solid #ddd',
                                background: filter === 'lowPrice' ? '#f5576c' : 'white',
                                color: filter === 'lowPrice' ? 'white' : '#333',
                                borderRadius: '25px',
                                cursor: 'pointer',
                                fontWeight: 'bold',
                                fontSize: '0.95rem',
                                transition: 'all 0.3s',
                                boxShadow: filter === 'lowPrice' ? '0 4px 15px rgba(245,87,108,0.3)' : 'none'
                            }}
                        >
                            💰 Giá rẻ nhất
                        </button>
                    </div>
                </div>
            </div>

            {/* Products Grid */}
            <div style={{
                maxWidth: '1400px',
                margin: '40px auto',
                padding: '0 30px'
            }}>
                {filteredProducts.length === 0 ? (
                    <div style={{
                        textAlign: 'center',
                        padding: '100px 20px',
                        background: 'white',
                        borderRadius: '20px',
                        boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
                    }}>
                        <div style={{fontSize: '5rem', marginBottom: '20px'}}>😔</div>
                        <h2 style={{fontSize: '2rem', color: '#333', marginBottom: '15px'}}>
                            No ongoing promotions
                        </h2>
                        <p style={{fontSize: '1.1rem', color: '#666', marginBottom: '30px'}}>
                            Vui lòng quay lại sau hoặc xem các sản phẩm khác
                        </p>
                        <button
                            onClick={() => navigate('/')}
                            style={{
                                padding: '15px 40px',
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '30px',
                                fontSize: '1.1rem',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                boxShadow: '0 4px 20px rgba(102,126,234,0.4)'
                            }}
                        >
                            🏠 Về trang chủ
                        </button>
                    </div>
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                        gap: '25px'
                    }}>
                        {filteredProducts.map(product => (
                            <div
                                key={product._id}
                                style={{
                                    background: 'white',
                                    borderRadius: '20px',
                                    overflow: 'hidden',
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                                    transition: 'all 0.3s',
                                    position: 'relative',
                                    cursor: 'pointer'
                                }}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-8px)';
                                    e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.2)';
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';
                                }}
                            >
                                {/* Discount Badge */}
                                <div style={{
                                    position: 'absolute',
                                    top: '15px',
                                    left: '15px',
                                    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                                    color: 'white',
                                    padding: '10px 20px',
                                    borderRadius: '30px',
                                    fontWeight: '900',
                                    fontSize: '1.2rem',
                                    zIndex: 2,
                                    boxShadow: '0 4px 15px rgba(245,87,108,0.4)',
                                    animation: 'pulse 2s infinite'
                                }}>
                                    -{product.discountPercent}%
                                </div>

                                {/* Wishlist Button */}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleWishlist(product);
                                    }}
                                    style={{
                                        position: 'absolute',
                                        top: '15px',
                                        right: '15px',
                                        background: isInWishlist(product._id) ? '#ff4757' : 'rgba(255,255,255,0.9)',
                                        color: isInWishlist(product._id) ? 'white' : '#333',
                                        border: 'none',
                                        borderRadius: '50%',
                                        width: '45px',
                                        height: '45px',
                                        fontSize: '1.5rem',
                                        cursor: 'pointer',
                                        zIndex: 2,
                                        boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        transition: 'all 0.3s'
                                    }}
                                >
                                    {isInWishlist(product._id) ? '❤️' : '🤍'}
                                </button>

                                {/* Product Image */}
                                <div
                                    onClick={() => navigate(`/product/${product._id}`)}
                                    style={{
                                        height: '280px',
                                        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        padding: '20px',
                                        position: 'relative'
                                    }}
                                >
                                    <img
                                        src={product.imageUrl}
                                        alt={product.name}
                                        style={{
                                            maxWidth: '100%',
                                            maxHeight: '100%',
                                            objectFit: 'contain'
                                        }}
                                    />
                                </div>

                                {/* Product Info */}
                                <div style={{padding: '25px'}}>
                                    {/* Brand */}
                                    <div style={{
                                        display: 'inline-block',
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        color: 'white',
                                        padding: '5px 15px',
                                        borderRadius: '15px',
                                        fontSize: '0.85rem',
                                        fontWeight: 'bold',
                                        marginBottom: '12px'
                                    }}>
                                        {product.brand}
                                    </div>

                                    {/* Name */}
                                    <h3
                                        onClick={() => navigate(`/product/${product._id}`)}
                                        style={{
                                            fontSize: '1.1rem',
                                            fontWeight: 'bold',
                                            color: '#2c3e50',
                                            marginBottom: '12px',
                                            minHeight: '50px',
                                            display: '-webkit-box',
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: 'vertical',
                                            overflow: 'hidden',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        {product.name}
                                    </h3>

                                    {/* Specs */}
                                    {product.specifications && (
                                        <div style={{
                                            display: 'flex',
                                            gap: '10px',
                                            marginBottom: '15px',
                                            fontSize: '0.85rem',
                                            color: '#666'
                                        }}>
                                            {product.specifications.processor && (
                                                <div style={{
                                                    background: '#f8f9fa',
                                                    padding: '5px 10px',
                                                    borderRadius: '8px',
                                                    fontSize: '0.8rem'
                                                }}>
                                                    💻 {product.specifications.processor.substring(0, 15)}...
                                                </div>
                                            )}
                                            {product.specifications.ram && (
                                                <div style={{
                                                    background: '#f8f9fa',
                                                    padding: '5px 10px',
                                                    borderRadius: '8px',
                                                    fontSize: '0.8rem'
                                                }}>
                                                    🎮 {product.specifications.ram}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Price */}
                                    <div style={{marginBottom: '15px'}}>
                                        <div style={{
                                            fontSize: '0.95rem',
                                            color: '#999',
                                            textDecoration: 'line-through',
                                            marginBottom: '5px'
                                        }}>
                                            {product.originalPrice.toLocaleString('vi-VN')} đ
                                        </div>
                                        <div style={{
                                            fontSize: '1.8rem',
                                            fontWeight: '900',
                                            color: '#f5576c',
                                            marginBottom: '8px'
                                        }}>
                                            {product.price.toLocaleString('vi-VN')} đ
                                        </div>
                                        <div style={{
                                            background: '#fff3cd',
                                            color: '#856404',
                                            padding: '8px 12px',
                                            borderRadius: '10px',
                                            fontSize: '0.9rem',
                                            fontWeight: 'bold',
                                            textAlign: 'center'
                                        }}>
                                            💰 Save {product.savings.toLocaleString('vi-VN')} đ
                                        </div>
                                    </div>

                                    {/* Stock Warning */}
                                    {product.stock < 10 && (
                                        <div style={{
                                            background: '#fff3cd',
                                            border: '1px solid #ffc107',
                                            color: '#856404',
                                            padding: '8px',
                                            borderRadius: '8px',
                                            fontSize: '0.85rem',
                                            marginBottom: '15px',
                                            textAlign: 'center',
                                            fontWeight: 'bold'
                                        }}>
                                            ⚠️ Chỉ còn {product.stock} sản phẩm
                                        </div>
                                    )}

                                    {/* Add to Cart Button */}
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleAddToCart(product);
                                        }}
                                        style={{
                                            width: '100%',
                                            padding: '15px',
                                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '12px',
                                            fontSize: '1.05rem',
                                            fontWeight: 'bold',
                                            cursor: 'pointer',
                                            transition: 'all 0.3s',
                                            boxShadow: '0 4px 15px rgba(102,126,234,0.3)'
                                        }}
                                        onMouseOver={(e) => {
                                            e.target.style.transform = 'translateY(-2px)';
                                            e.target.style.boxShadow = '0 6px 20px rgba(102,126,234,0.4)';
                                        }}
                                        onMouseOut={(e) => {
                                            e.target.style.transform = 'translateY(0)';
                                            e.target.style.boxShadow = '0 4px 15px rgba(102,126,234,0.3)';
                                        }}
                                    >
                                        🛒 Add to cart
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Trust Signals */}
            <div style={{
                background: 'white',
                padding: '60px 30px',
                marginTop: '60px'
            }}>
                <div style={{
                    maxWidth: '1400px',
                    margin: '0 auto',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: '30px'
                }}>
                    {[
                        { icon: '🚚', title: 'Free shipping', desc: 'Orders over 10 million' },
                        { icon: '🔄', title: 'Đổi trả 15 ngày', desc: 'Nếu có lỗi từ NSX' },
                        { icon: '💳', title: 'Trả góp 0%', desc: 'Duyệt nhanh 30 phút' },
                        { icon: '🛡️', title: 'Bảo hành chính hãng', desc: '12-24 tháng' }
                    ].map((item, index) => (
                        <div key={index} style={{
                            textAlign: 'center',
                            padding: '30px',
                            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                            borderRadius: '20px',
                            transition: 'all 0.3s'
                        }}>
                            <div style={{fontSize: '3rem', marginBottom: '15px'}}>{item.icon}</div>
                            <h4 style={{
                                fontSize: '1.1rem',
                                fontWeight: 'bold',
                                color: '#2c3e50',
                                marginBottom: '8px'
                            }}>
                                {item.title}
                            </h4>
                            <p style={{fontSize: '0.95rem', color: '#666'}}>{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            <style>{`
                @keyframes pulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.05); }
                }
            `}</style>
        </div>
    );
};

export default DealsPageNew;
