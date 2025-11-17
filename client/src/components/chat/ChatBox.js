import React, { useState, useRef, useEffect } from 'react';
import { FiMessageCircle, FiX, FiSend, FiUser } from 'react-icons/fi';
import './ChatBox.css';

const ChatBox = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            id: 1,
            text: 'Xin chào! Tôi là trợ lý ảo của Laptop Store. Tôi có thể giúp gì cho bạn?',
            sender: 'bot',
            time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
        }
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const quickReplies = [
        'Tư vấn sản phẩm',
        'Chính sách bảo hành',
        'Hướng dẫn mua hàng',
        'Liên hệ tư vấn viên'
    ];

    const autoReply = (userMessage) => {
        const lowerMessage = userMessage.toLowerCase();
        
        if (lowerMessage.includes('tư vấn') || lowerMessage.includes('sản phẩm')) {
            return 'Chúng tôi có nhiều dòng laptop phù hợp với nhu cầu của bạn. Bạn muốn tìm laptop cho mục đích gì? (Gaming, Văn phòng, Đồ họa...)';
        } else if (lowerMessage.includes('bảo hành')) {
            return 'Tất cả sản phẩm tại store đều được bảo hành chính hãng 12-36 tháng. Bạn cần thông tin cụ thể về sản phẩm nào?';
        } else if (lowerMessage.includes('mua hàng') || lowerMessage.includes('đặt hàng')) {
            return 'Bạn có thể đặt hàng trực tiếp trên website, hoặc liên hệ hotline: 084.686.5650 để được hỗ trợ nhanh nhất!';
        } else if (lowerMessage.includes('giá') || lowerMessage.includes('khuyến mãi')) {
            return 'Chúng tôi đang có nhiều chương trình khuyến mãi hấp dẫn! Vui lòng xem mục "Khuyến mãi Hot" để biết chi tiết.';
        } else if (lowerMessage.includes('liên hệ') || lowerMessage.includes('phone') || lowerMessage.includes('sđt')) {
            return 'Bạn có thể liên hệ với chúng tôi:\n📞 Hotline: 084.686.5650\n📧 Email: trinhviethoangawm@gmail.com\n📍 Địa chỉ: Hà Nội, Việt Nam';
        } else if (lowerMessage.includes('địa chỉ') || lowerMessage.includes('nội')) {
            return 'Cửa hàng chúng tôi tại Hà Nội. Liên hệ hotline 084.686.5650 để biết địa chỉ cụ thể gần bạn nhất!';
        } else {
            return 'Cảm ơn bạn đã liên hệ! Để được tư vấn chi tiết hơn, vui lòng liên hệ:\n📞 Hotline: 084.686.5650\n📧 Email: trinhviethoangawm@gmail.com';
        }
    };

    const handleSendMessage = () => {
        if (inputMessage.trim()) {
            const newMessage = {
                id: messages.length + 1,
                text: inputMessage,
                sender: 'user',
                time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
            };
            setMessages([...messages, newMessage]);
            setInputMessage('');

            // Auto reply after 1 second
            setTimeout(() => {
                const botReply = {
                    id: messages.length + 2,
                    text: autoReply(inputMessage),
                    sender: 'bot',
                    time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
                };
                setMessages(prev => [...prev, botReply]);
            }, 1000);
        }
    };

    const handleQuickReply = (reply) => {
        const newMessage = {
            id: messages.length + 1,
            text: reply,
            sender: 'user',
            time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
        };
        setMessages([...messages, newMessage]);

        setTimeout(() => {
            const botReply = {
                id: messages.length + 2,
                text: autoReply(reply),
                sender: 'bot',
                time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, botReply]);
        }, 1000);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <>
            {/* Chat Button */}
            <button 
                className={`chat-button ${isOpen ? 'hidden' : ''}`}
                onClick={() => setIsOpen(true)}
                aria-label="Open chat"
            >
                <FiMessageCircle />
                <span className="chat-badge">Hỗ trợ</span>
            </button>

            {/* Chat Box */}
            {isOpen && (
                <div className="chat-box">
                    {/* Header */}
                    <div className="chat-header">
                        <div className="chat-header-content">
                            <div className="chat-avatar">
                                <FiUser />
                            </div>
                            <div className="chat-header-text">
                                <h3>Hỗ trợ khách hàng</h3>
                                <p className="chat-status">
                                    <span className="status-dot"></span>
                                    Đang hoạt động
                                </p>
                            </div>
                        </div>
                        <button 
                            className="chat-close-btn"
                            onClick={() => setIsOpen(false)}
                            aria-label="Close chat"
                        >
                            <FiX />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="chat-messages">
                        {messages.map((message) => (
                            <div 
                                key={message.id} 
                                className={`message ${message.sender === 'user' ? 'message-user' : 'message-bot'}`}
                            >
                                <div className="message-content">
                                    <p className="message-text">{message.text}</p>
                                    <span className="message-time">{message.time}</span>
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Quick Replies */}
                    {messages.length <= 3 && (
                        <div className="quick-replies">
                            {quickReplies.map((reply, index) => (
                                <button
                                    key={index}
                                    className="quick-reply-btn"
                                    onClick={() => handleQuickReply(reply)}
                                >
                                    {reply}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Input */}
                    <div className="chat-input-container">
                        <input
                            type="text"
                            className="chat-input"
                            placeholder="Nhập tin nhắn..."
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                        />
                        <button 
                            className="chat-send-btn"
                            onClick={handleSendMessage}
                            disabled={!inputMessage.trim()}
                            aria-label="Send message"
                        >
                            <FiSend />
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default ChatBox;
