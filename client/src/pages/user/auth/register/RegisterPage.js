import React, { useState, useContext } from 'react';
import AuthContext from '../../../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { useToast } from '../../../../components/common/Toast';
import '../styles/AuthPages.css';

const RegisterPage = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState('client');
    const [shopName, setShopName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();
    const toast = useToast();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            const errorMsg = 'Mật khẩu không khớp!';
            setError(errorMsg);
            toast.error(errorMsg);
            return;
        }

        if (password.length < 6) {
            const errorMsg = 'Mật khẩu phải có ít nhất 6 ký tự.';
            setError(errorMsg);
            toast.error(errorMsg);
            return;
        }

        if (role === 'partner' && !shopName.trim()) {
            const errorMsg = 'Vui lòng nhập tên shop của bạn.';
            setError(errorMsg);
            toast.error(errorMsg);
            return;
        }

        setLoading(true);
        
        try {
            const userData = { username, email, password, role };
            if (role === 'partner') {
                userData.shopName = shopName;
            }
            await register(userData.username, userData.email, userData.password, userData.role, userData.shopName);
            toast.success('Đăng ký thành công! Vui lòng đăng nhập.');
            setTimeout(() => navigate('/login'), 1500);
        } catch (err) {
            const errorMsg = 'Đăng ký thất bại. Email hoặc username có thể đã tồn tại.';
            setError(errorMsg);
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-left">
                    <div className="auth-brand">
                        <div className="brand-icon">💻</div>
                        <h1>Laptop Store</h1>
                        <p>Tham gia ngay hôm nay!</p>
                    </div>
                    <div className="auth-illustration">
                        <div className="floating-laptop">
                            <span className="laptop-emoji">🚀</span>
                        </div>
                        <div className="floating-circle circle-1"></div>
                        <div className="floating-circle circle-2"></div>
                        <div className="floating-circle circle-3"></div>
                    </div>
                </div>

                <div className="auth-right">
                    <div className="auth-form-wrapper">
                        <div className="auth-header">
                            <h2>Đăng Ký</h2>
                            <p>Tạo tài khoản mới để bắt đầu mua sắm hoặc bán hàng.</p>
                        </div>

                        {error && (
                            <div className="error-alert">
                                <span className="error-icon">⚠️</span>
                                <span>{error}</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="auth-form">
                            <div className="form-group">
                                <label>Bạn là:</label>
                                <div className="register-role-select">
                                    <div 
                                        className={`role-option ${role === 'client' ? 'selected' : ''}`}
                                        onClick={() => setRole('client')}
                                    >
                                        <input 
                                            type="radio" 
                                            name="role" 
                                            value="client"
                                            checked={role === 'client'}
                                            onChange={(e) => setRole(e.target.value)}
                                        />
                                        <div className="role-icon">👤</div>
                                        <div className="role-name">Khách hàng</div>
                                    </div>
                                    <div 
                                        className={`role-option ${role === 'partner' ? 'selected' : ''}`}
                                        onClick={() => setRole('partner')}
                                    >
                                        <input 
                                            type="radio" 
                                            name="role" 
                                            value="partner"
                                            checked={role === 'partner'}
                                            onChange={(e) => setRole(e.target.value)}
                                        />
                                        <div className="role-icon">🏪</div>
                                        <div className="role-name">Đối tác bán</div>
                                    </div>
                                </div>
                            </div>

                            <div className="form-group">
                                <label>👤 Tên người dùng</label>
                                <input 
                                    type="text" 
                                    value={username} 
                                    onChange={(e) => setUsername(e.target.value)} 
                                    placeholder="johndoe"
                                    required 
                                    disabled={loading}
                                    className="form-input"
                                />
                            </div>

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

                            {role === 'partner' && (
                                <div className="form-group">
                                    <label>🏪 Tên Shop</label>
                                    <input 
                                        type="text" 
                                        value={shopName} 
                                        onChange={(e) => setShopName(e.target.value)} 
                                        placeholder="Laptop Store Pro"
                                        required 
                                        disabled={loading}
                                        className="form-input"
                                    />
                                </div>
                            )}

                            <div className="form-group">
                                <label>🔒 Mật khẩu</label>
                                <div className="password-input-wrapper">
                                    <input 
                                        type={showPassword ? "text" : "password"}
                                        value={password} 
                                        onChange={(e) => setPassword(e.target.value)} 
                                        placeholder="••••••••"
                                        required 
                                        disabled={loading}
                                        className="form-input"
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
                                        Đang đăng ký...
                                    </>
                                ) : (
                                    <>
                                        <span>Đăng Ký</span>
                                        <span>→</span>
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="auth-divider">
                            <span>Hoặc</span>
                        </div>

                        <div className="auth-footer">
                            <p>
                                Đã có tài khoản? 
                                <Link to="/login" className="auth-link">Đăng nhập ngay</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;