import React from 'react';
import { Link } from 'react-router-dom';
import './AboutPage.css';

const AboutPage = () => {
    return (
        <div className="about-page">
            {/* Hero Section */}
            <div className="about-hero">
                <div className="about-hero-content">
                    <h1 className="about-title">🌐 Về Chúng Tôi</h1>
                    <p className="about-subtitle">
                        Hệ thống bán lẻ laptop uy tín hàng đầu Việt Nam
                    </p>
                </div>
            </div>

            {/* Company Story */}
            <div className="company-story">
                <div className="story-container">
                    <div className="story-content">
                        <h2>📖 Câu Chuyện Của Chúng Tôi</h2>
                        <p>
                            <strong>Laptop Store</strong> được thành lập vào năm 2015 với sứ mệnh mang đến cho khách hàng 
                            Việt Nam những sản phẩm laptop chính hãng, chất lượng cao với giá cả hợp lý nhất.
                        </p>
                        <p>
                            Qua 10 năm phát triển, chúng tôi đã trở thành một trong những đơn vị hàng đầu 
                            trong lĩnh vực phân phối laptop tại Việt Nam với hơn <strong>50 cửa hàng</strong> trên 
                            toàn quốc và hơn <strong>500,000 khách hàng</strong> tin dùng.
                        </p>
                    </div>
                    <div className="story-image">
                        <img src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=600" alt="Our Team" />
                    </div>
                </div>
            </div>

            {/* Mission & Vision */}
            <div className="mission-vision">
                <div className="mv-container">
                    <div className="mv-item mission">
                        <div className="mv-icon">🎯</div>
                        <h3>Sứ Mệnh</h3>
                        <p>
                            Cung cấp các sản phẩm công nghệ chất lượng cao, dịch vụ tận tâm, 
                            giúp khách hàng nâng cao năng suất làm việc và chất lượng cuộc sống.
                        </p>
                    </div>
                    <div className="mv-item vision">
                        <div className="mv-icon">🚀</div>
                        <h3>Tầm Nhìn</h3>
                        <p>
                            Trở thành hệ thống bán lẻ laptop số 1 Việt Nam, được khách hàng 
                            tin tưởng và lựa chọn hàng đầu khi mua sắm công nghệ.
                        </p>
                    </div>
                    <div className="mv-item values">
                        <div className="mv-icon">💎</div>
                        <h3>Giá Trị Cốt Lõi</h3>
                        <p>
                            Chân thành - Chuyên nghiệp - Chất lượng - Cam kết. 
                            Luôn đặt lợi ích khách hàng lên hàng đầu.
                        </p>
                    </div>
                </div>
            </div>

            {/* Core Values */}
            <div className="core-values">
                <div className="values-container">
                    <h2>⭐ Giá Trị Cốt Lõi</h2>
                    <div className="values-grid">
                        <div className="value-item">
                            <span className="value-icon">✓</span>
                            <h4>Chính hãng 100%</h4>
                            <p>Cam kết mọi sản phẩm đều chính hãng, có VAT đầy đủ</p>
                        </div>
                        <div className="value-item">
                            <span className="value-icon">🛡️</span>
                            <h4>Bảo hành uy tín</h4>
                            <p>Bảo hành chính hãng tại các trung tâm ủy quyền</p>
                        </div>
                        <div className="value-item">
                            <span className="value-icon">💰</span>
                            <h4>Giá tốt nhất</h4>
                            <p>Cam kết giá cạnh tranh, hoàn tiền nếu có nơi rẻ hơn</p>
                        </div>
                        <div className="value-item">
                            <span className="value-icon">🚚</span>
                            <h4>Giao hàng nhanh</h4>
                            <p>Giao hàng trong 2-4 giờ nội thành, 1-3 ngày toàn quốc</p>
                        </div>
                        <div className="value-item">
                            <span className="value-icon">👨‍💼</span>
                            <h4>Tư vấn chuyên nghiệp</h4>
                            <p>Đội ngũ am hiểu sâu về sản phẩm, tư vấn nhiệt tình</p>
                        </div>
                        <div className="value-item">
                            <span className="value-icon">🔄</span>
                            <h4>Đổi trả linh hoạt</h4>
                            <p>Đổi trả trong 15 ngày nếu có lỗi từ nhà sản xuất</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="stats-section">
                <div className="stats-container">
                    <div className="stat-box">
                        <div className="stat-number">10+</div>
                        <div className="stat-label">Năm kinh nghiệm</div>
                    </div>
                    <div className="stat-box">
                        <div className="stat-number">50+</div>
                        <div className="stat-label">Cửa hàng toàn quốc</div>
                    </div>
                    <div className="stat-box">
                        <div className="stat-number">500K+</div>
                        <div className="stat-label">Khách hàng tin dùng</div>
                    </div>
                    <div className="stat-box">
                        <div className="stat-number">4.8★</div>
                        <div className="stat-label">Đánh giá trung bình</div>
                    </div>
                </div>
            </div>

            {/* Team */}
            <div className="team-section">
                <div className="team-container">
                    <h2>👥 Đội Ngũ Lãnh Đạo</h2>
                    <div className="team-grid">
                        <div className="team-member">
                            <div className="member-avatar">
                                <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300" alt="CEO" />
                            </div>
                            <h4>Nguyễn Văn A</h4>
                            <p className="member-title">CEO & Founder</p>
                            <p className="member-desc">15 năm kinh nghiệm trong ngành công nghệ</p>
                        </div>
                        <div className="team-member">
                            <div className="member-avatar">
                                <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300" alt="CTO" />
                            </div>
                            <h4>Trần Thị B</h4>
                            <p className="member-title">CTO</p>
                            <p className="member-desc">Chuyên gia công nghệ với 12 năm kinh nghiệm</p>
                        </div>
                        <div className="team-member">
                            <div className="member-avatar">
                                <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300" alt="COO" />
                            </div>
                            <h4>Lê Văn C</h4>
                            <p className="member-title">COO</p>
                            <p className="member-desc">Chuyên gia vận hành và logistics</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Partners */}
            <div className="partners-section">
                <div className="partners-container">
                    <h2>🤝 Đối Tác Chiến Lược</h2>
                    <p className="partners-subtitle">Chúng tôi tự hào là đối tác chính thức của các thương hiệu hàng đầu</p>
                    <div className="partners-grid">
                        <div className="partner-logo">Dell</div>
                        <div className="partner-logo">HP</div>
                        <div className="partner-logo">Lenovo</div>
                        <div className="partner-logo">Asus</div>
                        <div className="partner-logo">Acer</div>
                        <div className="partner-logo">MSI</div>
                        <div className="partner-logo">Apple</div>
                        <div className="partner-logo">Microsoft</div>
                    </div>
                </div>
            </div>

            {/* CTA */}
            <div className="about-cta">
                <div className="cta-content">
                    <h2>Sẵn sàng mua sắm cùng chúng tôi?</h2>
                    <p>Khám phá hàng trăm mẫu laptop chính hãng với giá tốt nhất</p>
                    <div className="cta-actions">
                        <Link to="/" className="cta-btn primary">
                            🛍️ Xem sản phẩm
                        </Link>
                        <Link to="/contact" className="cta-btn secondary">
                            📧 Liên hệ ngay
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutPage;
