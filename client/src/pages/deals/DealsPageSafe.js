import React, { useState, useEffect } from 'react';
import './DealsPage.css';

const DealsPageSafe = () => {
    const [timeLeft, setTimeLeft] = useState({
        hours: 23,
        minutes: 59,
        seconds: 59
    });

    // Timer countdown effect
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev.seconds > 0) {
                    return { ...prev, seconds: prev.seconds - 1 };
                } else if (prev.minutes > 0) {
                    return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
                } else if (prev.hours > 0) {
                    return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
                } else {
                    return { hours: 23, minutes: 59, seconds: 59 };
                }
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="deals-page">
            {/* Flash Sale Banner với Timer */}
            <div className="flash-sale-banner">
                <div className="flash-sale-content">
                    <div className="flash-sale-left">
                        <h2 className="flash-sale-title">⚡ FLASH SALE ⚡</h2>
                        <p className="flash-sale-subtitle">Deal hot kết thúc trong:</p>
                    </div>
                    <div className="countdown-timer">
                        <div className="timer-box">
                            <span className="timer-value">{String(timeLeft.hours).padStart(2, '0')}</span>
                            <span className="timer-label">Giờ</span>
                        </div>
                        <span className="timer-separator">:</span>
                        <div className="timer-box">
                            <span className="timer-value">{String(timeLeft.minutes).padStart(2, '0')}</span>
                            <span className="timer-label">Phút</span>
                        </div>
                        <span className="timer-separator">:</span>
                        <div className="timer-box">
                            <span className="timer-value">{String(timeLeft.seconds).padStart(2, '0')}</span>
                            <span className="timer-label">Giây</span>
                        </div>
                    </div>
                    <div className="flash-sale-right">
                        <span className="deals-count">🎁 50 Deals</span>
                    </div>
                </div>
            </div>

            {/* Hero Banner */}
            <div className="deals-hero">
                <div className="deals-hero-content">
                    <h1 className="deals-title">🔥 SIÊU SALE KHỦNG</h1>
                    <p className="deals-subtitle">
                        Giảm giá lên đến 50% - Mua ngay kẻo lỡ!
                    </p>
                    <div className="deals-stats">
                        <div className="stat-item">
                            <span className="stat-number">50</span>
                            <span className="stat-label">Sản phẩm</span>
                        </div>
                        <div className="stat-divider"></div>
                        <div className="stat-item">
                            <span className="stat-number">50%</span>
                            <span className="stat-label">Giảm tối đa</span>
                        </div>
                        <div className="stat-divider"></div>
                        <div className="stat-item">
                            <span className="stat-number">2,500</span>
                            <span className="stat-label">Đã bán</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Loading message */}
            <div className="deals-content">
                <div style={{ 
                    background: 'white', 
                    padding: '80px 20px', 
                    textAlign: 'center',
                    borderRadius: '20px',
                    margin: '40px auto',
                    maxWidth: '600px'
                }}>
                    <div className="spinner" style={{
                        width: '60px',
                        height: '60px',
                        border: '5px solid #f3f3f3',
                        borderTop: '5px solid #667eea',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                        margin: '0 auto 20px'
                    }}></div>
                    <h3 style={{ marginBottom: '10px', color: '#333' }}>Đang tải sản phẩm...</h3>
                    <p style={{ color: '#666' }}>Vui lòng đợi trong giây lát</p>
                </div>
            </div>

            {/* Trust Signals */}
            <div className="deals-trust-section">
                <div className="trust-items">
                    <div className="trust-item">
                        <span className="trust-icon">🚚</span>
                        <h4>Miễn phí vận chuyển</h4>
                        <p>Đơn hàng từ 10 triệu</p>
                    </div>
                    <div className="trust-item">
                        <span className="trust-icon">🔄</span>
                        <h4>Đổi trả 15 ngày</h4>
                        <p>Nếu có lỗi từ NSX</p>
                    </div>
                    <div className="trust-item">
                        <span className="trust-icon">💳</span>
                        <h4>Trả góp 0%</h4>
                        <p>Duyệt nhanh 30 phút</p>
                    </div>
                    <div className="trust-item">
                        <span className="trust-icon">🛡️</span>
                        <h4>Bảo hành chính hãng</h4>
                        <p>12-24 tháng</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DealsPageSafe;
