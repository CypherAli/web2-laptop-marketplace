import React, { useState, useEffect } from 'react';
import './Testimonials.css';

const Testimonials = () => {
    const [activeIndex, setActiveIndex] = useState(0);

    const testimonials = [
        {
            id: 1,
            name: 'Nguyễn Văn An',
            role: 'Kỹ sư Phần mềm',
            avatar: '👨‍💻',
            rating: 5,
            comment: 'Mình đã mua laptop Dell XPS 15 từ cửa hàng. Sản phẩm chất lượng, giá cả hợp lý. Nhân viên tư vấn nhiệt tình và chuyên nghiệp. Giao hàng nhanh chóng. Rất hài lòng!',
            product: 'Dell XPS 15',
            date: '2 tuần trước'
        },
        {
            id: 2,
            name: 'Trần Thị Bích',
            role: 'Graphic Designer',
            avatar: '👩‍🎨',
            rating: 5,
            comment: 'MacBook Pro M2 mua từ đây quá đỉnh! Màn hình đẹp, hiệu năng mượt mà, phục vụ công việc design rất tốt. Team support nhiệt tình, giải đáp mọi thắc mắc. Sẽ giới thiệu bạn bè!',
            product: 'MacBook Pro M2',
            date: '3 tuần trước'
        },
        {
            id: 3,
            name: 'Lê Minh Tuấn',
            role: 'Sinh viên IT',
            avatar: '👨‍🎓',
            rating: 5,
            comment: 'Laptop gaming MSI mua cho học tập và giải trí. Cấu hình mạnh, chơi game mượt, giá sinh viên có thể chấp nhận được. Bảo hành tốt, có vấn đề gì hỗ trợ ngay. Recommend!',
            product: 'MSI Gaming GF63',
            date: '1 tháng trước'
        },
        {
            id: 4,
            name: 'Phạm Thu Hà',
            role: 'Content Creator',
            avatar: '👩‍💼',
            rating: 5,
            comment: 'HP Pavilion mua để làm content, edit video rất ngon. Pin trâu, thiết kế đẹp, giá lại còn có khuyến mãi. Nhân viên tư vấn chi tiết từng thông số. Trải nghiệm mua sắm tuyệt vời!',
            product: 'HP Pavilion 15',
            date: '1 tháng trước'
        },
        {
            id: 5,
            name: 'Hoàng Minh Khoa',
            role: 'Doanh nhân',
            avatar: '👨‍💼',
            rating: 5,
            comment: 'Lenovo ThinkPad dùng cho công việc kinh doanh rất bền bỉ. Bàn phím gõ đã tay, pin dùng cả ngày. Cửa hàng uy tín, sản phẩm chính hãng 100%. Hỗ trợ sau bán hàng tốt!',
            product: 'Lenovo ThinkPad X1',
            date: '5 tuần trước'
        },
        {
            id: 6,
            name: 'Vũ Thị Lan',
            role: 'Marketing Manager',
            avatar: '👩‍💻',
            rating: 5,
            comment: 'Asus ZenBook mỏng nhẹ, thiết kế sang trọng, mang đi làm rất tiện. Hiệu năng ổn định cho công việc văn phòng và họp online. Giá tốt nhất thị trường. Giao hàng nhanh, đóng gói cẩn thận!',
            product: 'Asus ZenBook 14',
            date: '6 tuần trước'
        }
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % testimonials.length);
        }, 6000);
        return () => clearInterval(timer);
    }, [testimonials.length]);

    const handleDotClick = (index) => {
        setActiveIndex(index);
    };

    const handlePrev = () => {
        setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    };

    const handleNext = () => {
        setActiveIndex((prev) => (prev + 1) % testimonials.length);
    };

    return (
        <section className="testimonials-section">
            <div className="testimonials-container">
                <div className="testimonials-header">
                    <h2 className="testimonials-title">
                        <span className="title-icon">💬</span>
                        Khách Hàng Nói Gì Về Chúng Tôi
                        <span className="title-icon">💬</span>
                    </h2>
                    <p className="testimonials-subtitle">
                        Hơn 10,000+ khách hàng đã tin tưởng và lựa chọn
                    </p>
                    <div className="overall-rating">
                        <div className="rating-stars">⭐⭐⭐⭐⭐</div>
                        <div className="rating-score">4.8/5</div>
                        <div className="rating-count">(2,547 đánh giá)</div>
                    </div>
                </div>

                <div className="testimonials-carousel">
                    <button className="carousel-btn prev-btn" onClick={handlePrev}>
                        ‹
                    </button>

                    <div className="testimonials-wrapper">
                        {testimonials.map((testimonial, index) => (
                            <div 
                                key={testimonial.id}
                                className={`testimonial-card ${index === activeIndex ? 'active' : ''} ${
                                    index === (activeIndex - 1 + testimonials.length) % testimonials.length ? 'prev' : ''
                                } ${
                                    index === (activeIndex + 1) % testimonials.length ? 'next' : ''
                                }`}
                            >
                                <div className="testimonial-header">
                                    <div className="testimonial-avatar">{testimonial.avatar}</div>
                                    <div className="testimonial-author">
                                        <h4>{testimonial.name}</h4>
                                        <p>{testimonial.role}</p>
                                    </div>
                                    <div className="testimonial-rating">
                                        {'⭐'.repeat(testimonial.rating)}
                                    </div>
                                </div>
                                <div className="testimonial-body">
                                    <p className="testimonial-comment">"{testimonial.comment}"</p>
                                    <div className="testimonial-meta">
                                        <span className="product-bought">📦 {testimonial.product}</span>
                                        <span className="review-date">🕒 {testimonial.date}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button className="carousel-btn next-btn" onClick={handleNext}>
                        ›
                    </button>
                </div>

                <div className="carousel-dots">
                    {testimonials.map((_, index) => (
                        <button
                            key={index}
                            className={`dot ${index === activeIndex ? 'active' : ''}`}
                            onClick={() => handleDotClick(index)}
                        />
                    ))}
                </div>

                <div className="trust-badges">
                    <div className="trust-badge">
                        <span className="badge-icon">🏆</span>
                        <span className="badge-text">Top #1 Laptop Marketplace</span>
                    </div>
                    <div className="trust-badge">
                        <span className="badge-icon">✅</span>
                        <span className="badge-text">100% Sản phẩm chính hãng</span>
                    </div>
                    <div className="trust-badge">
                        <span className="badge-icon">🚚</span>
                        <span className="badge-text">Miễn phí vận chuyển</span>
                    </div>
                    <div className="trust-badge">
                        <span className="badge-icon">🛡️</span>
                        <span className="badge-text">Bảo hành 12-36 tháng</span>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
