import React, { useState, useContext } from 'react';
import AuthContext from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './FloatingChatButton.css';

const FloatingChatButton = () => {
    const { user } = useContext(AuthContext);
    const [isOpen, setIsOpen] = useState(false);
    const [showTooltip, setShowTooltip] = useState(true);
    const navigate = useNavigate();

    const handleClick = () => {
        if (!user) {
            // Redirect to login if not authenticated
            navigate('/login');
            return;
        }

        // For now, just open the chat modal or navigate to a chat page
        // You can expand this to show a chat modal or navigate to dashboard with chat
        if (user.role === 'partner' || user.role === 'admin') {
            navigate('/dashboard/partner'); // Partner dashboard has chat
        } else {
            // For clients, we'll show a simple modal to select a partner to chat with
            setIsOpen(!isOpen);
        }
    };

    // Hide tooltip after 5 seconds
    React.useEffect(() => {
        const timer = setTimeout(() => {
            setShowTooltip(false);
        }, 5000);
        return () => clearTimeout(timer);
    }, []);

    // Partners list (in production, fetch from API)
    const partners = [
        { id: '1', name: 'Tech Solutions Store', online: true },
        { id: '2', name: 'Gaming Hub', online: true },
        { id: '3', name: 'Laptop Pro Shop', online: false }
    ];

    const handlePartnerClick = (partnerId) => {
        navigate('/dashboard/partner'); // Navigate to chat interface
        setIsOpen(false);
    };

    return (
        <>
            <div className="floating-chat-container">
                {/* Tooltip */}
                {showTooltip && !isOpen && (
                    <div className="chat-tooltip">
                        💬 Cần hỗ trợ? Chat với chúng tôi!
                    </div>
                )}

                {/* Chat Partners List Modal */}
                {isOpen && user && user.role === 'client' && (
                    <div className="chat-partners-modal">
                        <div className="modal-header">
                            <h3>💬 Chọn cửa hàng để chat</h3>
                            <button 
                                className="close-btn" 
                                onClick={() => setIsOpen(false)}
                            >
                                ✕
                            </button>
                        </div>
                        <div className="partners-list">
                            {partners.map(partner => (
                                <button
                                    key={partner.id}
                                    className="partner-item"
                                    onClick={() => handlePartnerClick(partner.id)}
                                >
                                    <div className="partner-avatar">
                                        {partner.name.charAt(0)}
                                    </div>
                                    <div className="partner-info">
                                        <span className="partner-name">{partner.name}</span>
                                        <span className={`partner-status ${partner.online ? 'online' : 'offline'}`}>
                                            {partner.online ? '🟢 Online' : '⚪ Offline'}
                                        </span>
                                    </div>
                                </button>
                            ))}
                        </div>
                        <div className="modal-footer">
                            <p>💡 Chúng tôi thường phản hồi trong vài phút</p>
                        </div>
                    </div>
                )}

                {/* Floating Chat Button */}
                <button 
                    className={`floating-chat-button ${isOpen ? 'active' : ''}`}
                    onClick={handleClick}
                    aria-label="Chat with support"
                >
                    {isOpen ? (
                        <span className="close-icon">✕</span>
                    ) : (
                        <>
                            <span className="chat-icon">💬</span>
                            <span className="notification-badge">!</span>
                        </>
                    )}
                </button>
            </div>
        </>
    );
};

export default FloatingChatButton;
