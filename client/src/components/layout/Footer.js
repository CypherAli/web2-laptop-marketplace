import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="main-footer">
            <div className="footer-content">
                {/* Company Info */}
                <div className="footer-section">
                    <h3 className="footer-title">
                        <span className="footer-logo">💻</span>
                        Laptop Store
                    </h3>
                    <p className="footer-description">
                        Hệ thống bán lẻ laptop uy tín hàng đầu Việt Nam. 
                        Chuyên cung cấp laptop chính hãng, giá tốt nhất thị trường.
                    </p>
                    <div className="footer-contact">
                        <p><strong>📍 Địa chỉ:</strong> Hà Nội, Việt Nam</p>
                        <p><strong>📞 Hotline:</strong> <a href="tel:0846865650">084.686.5650</a></p>
                        <p><strong>📧 Email:</strong> <a href="mailto:trinhviethoangawm@gmail.com">trinhviethoangawm@gmail.com</a></p>
                        <p><strong>🕐 Giờ làm việc:</strong> 8:00 - 21:00 (Tất cả các ngày)</p>
                    </div>
                </div>

                {/* Customer Support */}
                <div className="footer-section">
                    <h4 className="footer-section-title">Hỗ trợ khách hàng</h4>
                    <ul className="footer-links">
                        <li><Link to="/huong-dan-mua-hang">Hướng dẫn mua hàng</Link></li>
                        <li><Link to="/huong-dan-thanh-toan">Hướng dẫn thanh toán</Link></li>
                        <li><Link to="/chinh-sach-bao-hanh">Chính sách bảo hành</Link></li>
                        <li><Link to="/chinh-sach-doi-tra">Chính sách đổi trả</Link></li>
                        <li><Link to="/chinh-sach-van-chuyen">Chính sách vận chuyển</Link></li>
                        <li><Link to="/tra-gop">Hướng dẫn trả góp 0%</Link></li>
                    </ul>
                </div>

                {/* Quick Links */}
                <div className="footer-section">
                    <h4 className="footer-section-title">Về chúng tôi</h4>
                    <ul className="footer-links">
                        <li><Link to="/gioi-thieu">Giới thiệu công ty</Link></li>
                        <li><Link to="/lien-he">Liên hệ</Link></li>
                        <li><Link to="/tuyen-dung">Tuyển dụng</Link></li>
                        <li><Link to="/tin-tuc">Tin tức & Sự kiện</Link></li>
                        <li><Link to="/he-thong-cua-hang">Hệ thống cửa hàng</Link></li>
                        <li><Link to="/dieu-khoan">Điều khoản sử dụng</Link></li>
                    </ul>
                </div>

                {/* Payment & Social */}
                <div className="footer-section">
                    <h4 className="footer-section-title">Phương thức thanh toán</h4>
                    <div className="payment-methods">
                        <div className="payment-icon">💳 Visa</div>
                        <div className="payment-icon">💳 MasterCard</div>
                        <div className="payment-icon">🏦 ATM</div>
                        <div className="payment-icon">💰 MoMo</div>
                        <div className="payment-icon">💙 ZaloPay</div>
                        <div className="payment-icon">💵 COD</div>
                    </div>

                    <h4 className="footer-section-title" style={{marginTop: '25px'}}>Đăng ký nhận tin</h4>
                    <form className="newsletter-form">
                        <input 
                            type="email" 
                            placeholder="Email của bạn" 
                            className="newsletter-input"
                        />
                        <button type="submit" className="newsletter-btn">
                            Đăng ký
                        </button>
                    </form>
                </div>
            </div>

            {/* Footer Bottom */}
            <div className="footer-bottom">
                <div className="footer-bottom-content">
                    <p className="copyright">
                        © 2025 Laptop Store. All rights reserved. | Designed with ❤️
                    </p>
                    <div className="footer-certifications">
                        <span className="cert-badge">🏅 Đăng ký Bộ Công Thương</span>
                        <span className="cert-badge">✓ DMCA Protected</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
