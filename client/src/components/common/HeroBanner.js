import React, { useState, useEffect } from 'react';
import './HeroBanner.css';

const HeroBanner = ({ onBrandClick }) => {
    const [currentSlide, setCurrentSlide] = useState(0);

    const slides = [
        {
            title: 'Laptop Gaming',
            subtitle: 'Chiến Mọi Game Đỉnh Cao',
            description: 'Giảm đến 30% - RTX 40 Series',
            cta: 'Mua Ngay',
            image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&h=500&fit=crop',
            color: '#e74c3c'
        },
        {
            title: 'Laptop Doanh Nghiệp',
            subtitle: 'Làm Việc Hiệu Quả',
            description: 'Mỏng nhẹ - Pin trâu - Bảo mật cao',
            cta: 'Khám Phá',
            image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&h=500&fit=crop',
            color: '#3498db'
        },
        {
            title: 'Ưu Đãi Hot',
            subtitle: 'Trả Góp 0% Lãi Suất',
            description: 'Miễn phí vận chuyển toàn quốc',
            cta: 'Xem Ngay',
            image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&h=500&fit=crop',
            color: '#f39c12'
        }
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [slides.length]);

    const scrollToProducts = () => {
        const productsSection = document.querySelector('.homepage-container');
        if (productsSection) {
            productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <>
            {/* Hero Slider */}
            <section className="hero-banner">
                <div className="hero-slider">
                    {slides.map((slide, index) => (
                        <div 
                            key={index}
                            className={`hero-slide ${index === currentSlide ? 'active' : ''}`}
                            style={{ '--accent-color': slide.color }}
                        >
                            <div className="hero-content">
                                <span className="hero-tag">🔥 HOT DEAL</span>
                                <h1 className="hero-title">
                                    {slide.title}
                                </h1>
                                <h2 className="hero-subtitle">{slide.subtitle}</h2>
                                <p className="hero-description">{slide.description}</p>
                                <button className="hero-cta" onClick={scrollToProducts}>
                                    {slide.cta} →
                                </button>
                                
                                {/* Trust Badges */}
                                <div className="hero-badges">
                                    <div className="badge-item">
                                        <span className="badge-icon">⭐</span>
                                        <div className="badge-text">
                                            <strong>4.8/5</strong>
                                            <small>15K+ đánh giá</small>
                                        </div>
                                    </div>
                                    <div className="badge-item">
                                        <span className="badge-icon">🏆</span>
                                        <div className="badge-text">
                                            <strong>Top #1</strong>
                                            <small>Laptop Store</small>
                                        </div>
                                    </div>
                                    <div className="badge-item">
                                        <span className="badge-icon">✓</span>
                                        <div className="badge-text">
                                            <strong>100%</strong>
                                            <small>Chính hãng</small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="hero-image">
                                <img src={slide.image} alt={slide.title} />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Slider Navigation */}
                <div className="slider-dots">
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            className={`dot ${index === currentSlide ? 'active' : ''}`}
                            onClick={() => setCurrentSlide(index)}
                        />
                    ))}
                </div>
            </section>

            {/* Brand Showcase - Official Partners */}
            <section className="brand-showcase">
                <div className="brand-container">
                    <h3 className="brand-title">🏢 Đối Tác Chính Hãng</h3>
                    <div className="brand-logos">
                        <div 
                            className="brand-logo" 
                            onClick={() => onBrandClick && onBrandClick('Dell')}
                            title="Dell - Official Partner"
                        >
                            <img 
                                src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Dell_Logo.svg/300px-Dell_Logo.svg.png" 
                                alt="Dell Logo"
                            />
                        </div>
                        <div 
                            className="brand-logo" 
                            onClick={() => onBrandClick && onBrandClick('HP')}
                            title="HP - Official Partner"
                        >
                            <img 
                                src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/HP_logo_2012.svg/300px-HP_logo_2012.svg.png" 
                                alt="HP Logo"
                            />
                        </div>
                        <div 
                            className="brand-logo" 
                            onClick={() => onBrandClick && onBrandClick('Lenovo')}
                            title="Lenovo - Official Partner"
                        >
                            <img 
                                src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Lenovo_logo_2015.svg/300px-Lenovo_logo_2015.svg.png" 
                                alt="Lenovo Logo"
                            />
                        </div>
                        <div 
                            className="brand-logo" 
                            onClick={() => onBrandClick && onBrandClick('ASUS')}
                            title="ASUS - Official Partner"
                        >
                            <img 
                                src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/ASUS_Logo.svg/300px-ASUS_Logo.svg.png" 
                                alt="ASUS Logo"
                            />
                        </div>
                        <div 
                            className="brand-logo" 
                            onClick={() => onBrandClick && onBrandClick('Acer')}
                            title="Acer - Official Partner"
                        >
                            <img 
                                src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Acer_2011.svg/300px-Acer_2011.svg.png" 
                                alt="Acer Logo"
                            />
                        </div>
                        <div 
                            className="brand-logo" 
                            onClick={() => onBrandClick && onBrandClick('MSI')}
                            title="MSI - Official Partner"
                        >
                            <img 
                                src="https://storage-asset.msi.com/frontend/imgs/logo.png" 
                                alt="MSI Logo"
                            />
                        </div>
                        <div 
                            className="brand-logo" 
                            onClick={() => onBrandClick && onBrandClick('Apple')}
                            title="Apple - Official Partner"
                        >
                            <img 
                                src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Apple_logo_black.svg/200px-Apple_logo_black.svg.png" 
                                alt="Apple Logo"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Service Highlights */}
            <section className="service-highlights">
                <div className="service-container">
                    <div className="service-item">
                        <span className="service-icon">🚚</span>
                        <div className="service-text">
                            <strong>Miễn phí vận chuyển</strong>
                            <small>Toàn quốc từ 10 triệu</small>
                        </div>
                    </div>
                    <div className="service-item">
                        <span className="service-icon">🔄</span>
                        <div className="service-text">
                            <strong>Đổi trả 15 ngày</strong>
                            <small>Nếu có lỗi từ NSX</small>
                        </div>
                    </div>
                    <div className="service-item">
                        <span className="service-icon">🛡️</span>
                        <div className="service-text">
                            <strong>Bảo hành chính hãng</strong>
                            <small>12-24 tháng</small>
                        </div>
                    </div>
                    <div className="service-item">
                        <span className="service-icon">💳</span>
                        <div className="service-text">
                            <strong>Trả góp 0%</strong>
                            <small>Duyệt nhanh 30 phút</small>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default HeroBanner;
