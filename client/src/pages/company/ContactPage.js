import React, { useState } from 'react';
import './ContactPage.css';

const ContactPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        alert('Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất có thể.');
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    };

    return (
        <div className="contact-page">
            {/* Hero */}
            <div className="contact-hero">
                <div className="contact-hero-content">
                    <h1 className="contact-title">📧 Liên Hệ Với Chúng Tôi</h1>
                    <p className="contact-subtitle">
                        Chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7
                    </p>
                </div>
            </div>

            {/* Contact Info Cards */}
            <div className="contact-info-section">
                <div className="contact-info-container">
                    <div className="info-card">
                        <div className="info-icon">📞</div>
                        <h3>Hotline</h3>
                        <p><a href="tel:0846865650">084.686.5650</a></p>
                        <span className="info-note">Hỗ trợ 24/7</span>
                    </div>
                    <div className="info-card">
                        <div className="info-icon">📧</div>
                        <h3>Email</h3>
                        <p><a href="mailto:trinhviethoangawm@gmail.com">trinhviethoangawm@gmail.com</a></p>
                        <span className="info-note">Phản hồi trong 24h</span>
                    </div>
                    <div className="info-card">
                        <div className="info-icon">📍</div>
                        <h3>Địa chỉ</h3>
                        <p>Hà Nội, Việt Nam</p>
                        <span className="info-note">8:00 - 21:00 hàng ngày</span>
                    </div>
                    <div className="info-card">
                        <div className="info-icon">💬</div>
                        <h3>Live Chat</h3>
                        <p>Chat trực tiếp với nhân viên</p>
                        <span className="info-note">Phản hồi ngay lập tức</span>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="contact-main">
                <div className="contact-container">
                    {/* Contact Form */}
                    <div className="contact-form-section">
                        <h2>📝 Gửi Tin Nhắn</h2>
                        <p className="form-description">
                            Điền thông tin bên dưới và chúng tôi sẽ liên hệ lại sớm nhất có thể
                        </p>
                        <form className="contact-form" onSubmit={handleSubmit}>
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="name">Họ và tên *</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        placeholder="Nguyễn Văn A"
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="phone">Số điện thoại *</label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        required
                                        placeholder="0901234567"
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="email">Email *</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    placeholder="example@email.com"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="subject">Chủ đề *</label>
                                <select
                                    id="subject"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">-- Chọn chủ đề --</option>
                                    <option value="tu-van">Tư vấn sản phẩm</option>
                                    <option value="bao-hanh">Bảo hành - Đổi trả</option>
                                    <option value="don-hang">Theo dõi đơn hàng</option>
                                    <option value="khieu-nai">Khiếu nại</option>
                                    <option value="khac">Khác</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="message">Nội dung *</label>
                                <textarea
                                    id="message"
                                    name="message"
                                    rows="6"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    placeholder="Nhập nội dung cần hỗ trợ..."
                                ></textarea>
                            </div>

                            <button type="submit" className="submit-btn">
                                Gửi tin nhắn
                            </button>
                        </form>
                    </div>

                    {/* Map & Additional Info */}
                    <div className="contact-side">
                        <div className="map-section">
                            <h3>🗺️ Bản đồ</h3>
                            <div className="map-placeholder">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.4967076167615!2d106.69254731533431!3d10.77625899231597!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f4b3330bcc9%3A0x5b3e5e93cc2e3af5!2sBen%20Thanh%20Market!5e0!3m2!1sen!2s!4v1635000000000!5m2!1sen!2s"
                                    width="100%"
                                    height="300"
                                    style={{ border: 0, borderRadius: '15px' }}
                                    allowFullScreen=""
                                    loading="lazy"
                                    title="Store Location"
                                ></iframe>
                            </div>
                        </div>

                        <div className="faq-section">
                            <h3>❓ Câu hỏi thường gặp</h3>
                            <div className="faq-list">
                                <div className="faq-item">
                                    <h4>Thời gian giao hàng?</h4>
                                    <p>2-4 giờ nội thành, 1-3 ngày toàn quốc</p>
                                </div>
                                <div className="faq-item">
                                    <h4>Chính sách đổi trả?</h4>
                                    <p>Đổi trả trong 15 ngày nếu có lỗi NSX</p>
                                </div>
                                <div className="faq-item">
                                    <h4>Bảo hành như thế nào?</h4>
                                    <p>Bảo hành chính hãng 12-24 tháng</p>
                                </div>
                                <div className="faq-item">
                                    <h4>Có trả góp 0% không?</h4>
                                    <p>Có, duyệt nhanh trong 30 phút</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Store Locations */}
            <div className="stores-section">
                <div className="stores-container">
                    <h2>🏪 Hệ Thống Cửa Hàng</h2>
                    <div className="stores-grid">
                        <div className="store-card">
                            <h4>Chi nhánh Quận 1</h4>
                            <p>📍 123 Nguyễn Huệ, Q.1, TP.HCM</p>
                            <p>📞 028 3822 xxxx</p>
                            <p>🕐 8:00 - 21:00</p>
                        </div>
                        <div className="store-card">
                            <h4>Chi nhánh Quận 3</h4>
                            <p>📍 456 Lê Văn Sỹ, Q.3, TP.HCM</p>
                            <p>📞 028 3930 xxxx</p>
                            <p>🕐 8:00 - 21:00</p>
                        </div>
                        <div className="store-card">
                            <h4>Chi nhánh Hà Nội</h4>
                            <p>📍 789 Láng Hạ, Đống Đa, Hà Nội</p>
                            <p>📞 024 3537 xxxx</p>
                            <p>🕐 8:00 - 21:00</p>
                        </div>
                        <div className="store-card">
                            <h4>Chi nhánh Đà Nẵng</h4>
                            <p>📍 321 Hùng Vương, Hải Châu, Đà Nẵng</p>
                            <p>📞 0236 3836 xxxx</p>
                            <p>🕐 8:00 - 21:00</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;
