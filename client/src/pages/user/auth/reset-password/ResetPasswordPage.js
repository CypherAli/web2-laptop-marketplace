import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../../../../api/axiosConfig';
import { useToast } from '../../../../components/common/Toast';
import '../styles/AuthPages.css';

const ResetPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [resetCode, setResetCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const toast = useToast();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (newPassword !== confirmPassword) {
            toast.error('Mật khẩu không khớp!');
            return;
        }

        if (newPassword.length < 6) {
            toast.error('Mật khẩu phải có ít nhất 6 ký tự');
            return;
        }

        setLoading(true);
        
        try {
            const response = await axios.post('/auth/reset-password', {
                email,
                resetCode,
                newPassword
            });
            
            toast.success(response.data.message || 'Đặt lại mật khẩu thành công!');
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Không thể đặt lại mật khẩu. Vui lòng thử lại.';
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-card">
                    <div className="auth-card-header">
                        <div className="auth-icon">🔑</div>
                        <h1>Đặt Lại Mật Khẩu</h1>
                        <p className="auth-subtitle">
                            Nhập mã xác nhận và mật khẩu mới
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="form-group">
                            <label>📧 Email</label>
                            <input 
                                type="email" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                                placeholder="you@example.com"
                                required 
                                disabled={loading}
                                className="form-input"
                            />
                        </div>

                        <div className="form-group">
                            <label>🔢 Mã xác nhận</label>
                            <input 
                                type="text" 
                                value={resetCode} 
                                onChange={(e) => setResetCode(e.target.value)} 
                                placeholder="Nhập mã 6 chữ số"
                                required 
                                disabled={loading}
                                className="form-input"
                                maxLength="6"
                            />
                            <small className="form-hint">
                                Mã xác nhận đã được gửi đến email của bạn
                            </small>
                        </div>

                        <div className="form-group">
                            <label>🔒 Mật khẩu mới</label>
                            <div className="password-input-wrapper">
                                <input 
                                    type={showPassword ? "text" : "password"}
                                    value={newPassword} 
                                    onChange={(e) => setNewPassword(e.target.value)} 
                                    placeholder="••••••••"
                                    required 
                                    disabled={loading}
                                    className="form-input"
                                    minLength="6"
                                />
                                <button 
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? '👁️' : '👁️‍🗨️'}
                                </button>
                            </div>
                        </div>

                        <div className="form-group">
                            <label>🔒 Xác nhận mật khẩu</label>
                            <input 
                                type={showPassword ? "text" : "password"}
                                value={confirmPassword} 
                                onChange={(e) => setConfirmPassword(e.target.value)} 
                                placeholder="••••••••"
                                required 
                                disabled={loading}
                                className="form-input"
                            />
                        </div>

                        <button 
                            type="submit" 
                            className="auth-submit-btn"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span className="spinner-small"></span>
                                    Đang xử lý...
                                </>
                            ) : (
                                <>
                                    <span>Đặt lại mật khẩu</span>
                                    <span>→</span>
                                </>
                            )}
                        </button>

                        <div className="auth-footer">
                            <Link to="/forgot-password" className="auth-link">
                                ← Gửi lại mã
                            </Link>
                            <span className="divider">•</span>
                            <Link to="/login" className="auth-link">
                                Quay lại đăng nhập
                            </Link>
                        </div>
                    </form>
                </div>

                <div className="auth-features">
                    <div className="feature-item">
                        <span className="feature-icon">🔒</span>
                        <span>Mã hóa cao cấp</span>
                    </div>
                    <div className="feature-item">
                        <span className="feature-icon">⏱️</span>
                        <span>Mã có hiệu lực 15 phút</span>
                    </div>
                    <div className="feature-item">
                        <span className="feature-icon">✅</span>
                        <span>An toàn tuyệt đối</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResetPasswordPage;
