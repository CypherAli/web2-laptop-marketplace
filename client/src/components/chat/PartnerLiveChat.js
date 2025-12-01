import React, { useState, useEffect, useRef, useContext, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    FiMessageCircle, FiX, FiSend, FiMinimize2, FiUser, FiClock 
} from 'react-icons/fi';
import AuthContext from '../../context/AuthContext';
import io from 'socket.io-client';
import './PartnerLiveChat.css';

/**
 * Partner LiveChat Widget
 * Partner nhận tin nhắn từ customers
 * Hiển thị danh sách customers đang chat
 */
const PartnerLiveChat = () => {
    const { user } = useContext(AuthContext);
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [customers, setCustomers] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [socket, setSocket] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [unreadCounts, setUnreadCounts] = useState({});
    const messagesEndRef = useRef(null);

    // Get partner ID safely
    const partnerId = user?._id || user?.id;

    // Define loadCustomers as useCallback to stabilize reference
    const loadCustomers = useCallback(async () => {
        // Check if partnerId is valid
        if (!partnerId) {
            console.log('⚠️ Cannot load customers: partnerId is undefined');
            console.log('   User object:', user);
            return;
        }

        console.log('📋 Loading customers for partner:', partnerId);

        try {
            const response = await fetch(
                `http://localhost:5000/api/chat/partner/${partnerId}/customers`
            );
            const data = await response.json();
            
            console.log('📥 Customers response:', data);
            
            if (data.success && data.customers) {
                setCustomers(data.customers);
                console.log('✅ Loaded', data.customers.length, 'customers');
            }
        } catch (error) {
            console.error('❌ Error loading customers:', error);
        }
    }, [partnerId, user]);

    useEffect(() => {
        // Check if partner is logged in and has valid ID
        if (!user || !partnerId) {
            console.log('⚠️ PartnerLiveChat: Partner not logged in or ID not available');
            console.log('   User:', user);
            console.log('   Partner ID:', partnerId);
            return;
        }

        console.log('🔌 PartnerLiveChat: Initializing socket for partner:', partnerId);

        // Initialize Socket.IO
        const newSocket = io(process.env.REACT_APP_SERVER_URL || 'http://localhost:5000', {
            transports: ['polling', 'websocket'],
            reconnection: true,
        });
        
        setSocket(newSocket);

        newSocket.on('connect', () => {
            console.log('✅ Partner connected to chat');
            console.log('   Partner ID:', partnerId);
            console.log('   Emitting partner:join...');
            setIsConnected(true);
            // Join as partner - this registers the partner to receive messages
            newSocket.emit('partner:join', partnerId);
        });

        newSocket.on('disconnect', () => {
            console.log('❌ Partner disconnected');
            setIsConnected(false);
        });

        // Receive new message from customer
        newSocket.on('chat:message', (message) => {
            console.log('📩 Partner received message:', message);
            
            // If message is for this partner
            if (message.receiverId === partnerId) {
                // Update customer list
                loadCustomers();
                
                // If currently chatting with this customer, add message
                if (selectedCustomer && message.senderId === selectedCustomer._id) {
                    setMessages(prev => {
                        // Check for duplicates more thoroughly
                        const exists = prev.some(m => 
                            m._id === message._id || 
                            (m.message === message.message && 
                             m.senderId === message.senderId && 
                             Math.abs(new Date(m.createdAt) - new Date(message.createdAt)) < 2000)
                        );
                        
                        if (exists) {
                            console.log('⚠️ Duplicate message detected, skipping');
                            return prev;
                        }
                        
                        console.log('✅ Adding new message from customer');
                        return [...prev, message];
                    });
                } else {
                    // Increase unread count for other customers
                    setUnreadCounts(prev => ({
                        ...prev,
                        [message.senderId]: (prev[message.senderId] || 0) + 1
                    }));
                }
            }
        });

        return () => {
            newSocket.disconnect();
        };
    }, [partnerId, selectedCustomer, user, loadCustomers]); // Add loadCustomers dependency

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        if (isOpen) {
            loadCustomers();
        }
    }, [isOpen, loadCustomers]);

    const loadChatHistory = async (customerId) => {
        try {
            const response = await fetch(
                `http://localhost:5000/api/chat/history/${customerId}/${partnerId}`
            );
            const data = await response.json();
            
            if (data.success && data.messages) {
                setMessages(data.messages);
                // Reset unread count for this customer
                setUnreadCounts(prev => {
                    const newCounts = { ...prev };
                    delete newCounts[customerId];
                    return newCounts;
                });
            }
        } catch (error) {
            console.error('Error loading chat:', error);
        }
    };

    const handleSelectCustomer = (customer) => {
        setSelectedCustomer(customer);
        loadChatHistory(customer._id);
    };

    const handleBackToList = () => {
        setSelectedCustomer(null);
        setMessages([]);
    };

    const sendMessage = async () => {
        if (!newMessage.trim() || !selectedCustomer) return;

        const tempId = `temp_${Date.now()}`;
        const messageData = {
            _id: tempId,
            senderId: partnerId,
            senderName: user?.shopName || user?.name || 'Partner',
            receiverId: selectedCustomer._id,
            receiverName: selectedCustomer.name,
            message: newMessage.trim(),
            timestamp: new Date(),
            senderType: 'partner',
            isTemp: true
        };

        setMessages(prev => [...prev, messageData]);
        setNewMessage('');

        try {
            // Send via Socket.IO only (server will save and emit)
            if (socket?.connected) {
                console.log('📤 Partner sending via socket:', messageData.message);
                socket.emit('chat:send', messageData);
                
                // Mark as sent
                setTimeout(() => {
                    setMessages(prev => 
                        prev.map(msg => 
                            msg._id === tempId ? { ...msg, isTemp: false } : msg
                        )
                    );
                }, 500);
            } else {
                // Fallback to API if socket not connected
                const response = await fetch('http://localhost:5000/api/chat/send', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(messageData)
                });
                
                const data = await response.json();
                if (data.success) {
                    setMessages(prev => 
                        prev.map(msg => 
                            msg._id === tempId ? { ...data.chat, isTemp: false } : msg
                        )
                    );
                }
            }
        } catch (error) {
            console.error('Error sending:', error);
            setMessages(prev => prev.filter(m => m._id !== tempId));
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const formatTime = (timestamp) => {
        return new Date(timestamp).toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getTotalUnread = () => {
        return Object.values(unreadCounts).reduce((sum, count) => sum + count, 0);
    };

    return (
        <>
            {/* Chat Button */}
            <motion.button
                className="partner-chat-toggle-btn"
                onClick={() => setIsOpen(!isOpen)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
            >
                <FiMessageCircle size={24} />
                {getTotalUnread() > 0 && (
                    <span className="unread-badge">{getTotalUnread()}</span>
                )}
                {!isOpen && <span className="chat-label">Chat Customers</span>}
            </motion.button>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        className={`partner-chat-window ${isMinimized ? 'minimized' : ''}`}
                        initial={{ opacity: 0, y: 50, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.8 }}
                    >
                        {/* Header */}
                        <div className="partner-chat-header">
                            <div className="header-info">
                                {selectedCustomer && (
                                    <button 
                                        className="back-btn"
                                        onClick={handleBackToList}
                                    >
                                        ←
                                    </button>
                                )}
                                <FiMessageCircle className="header-icon" />
                                <div>
                                    <h4>
                                        {selectedCustomer 
                                            ? selectedCustomer.name 
                                            : `Customers (${customers.length})`}
                                    </h4>
                                    <span className="header-status">
                                        {isConnected ? '● Online' : '○ Offline'}
                                    </span>
                                </div>
                            </div>
                            <div className="header-actions">
                                <button onClick={() => setIsMinimized(!isMinimized)}>
                                    <FiMinimize2 />
                                </button>
                                <button onClick={() => setIsOpen(false)}>
                                    <FiX />
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        {!isMinimized && (
                            <>
                                {!selectedCustomer ? (
                                    /* Customer List */
                                    <div className="customer-list">
                                        {customers.length === 0 ? (
                                            <div className="no-customers">
                                                <FiUser size={48} />
                                                <p>Chưa có khách hàng nào chat</p>
                                            </div>
                                        ) : (
                                            customers.map(customer => (
                                                <motion.div
                                                    key={customer._id}
                                                    className="customer-item"
                                                    onClick={() => handleSelectCustomer(customer)}
                                                    whileHover={{ scale: 1.02 }}
                                                >
                                                    <div className="customer-avatar">
                                                        {customer.name?.charAt(0) || 'C'}
                                                    </div>
                                                    <div className="customer-info">
                                                        <h5>{customer.name || 'Khách hàng'}</h5>
                                                        <p>{customer.lastMessage || 'Bắt đầu chat...'}</p>
                                                    </div>
                                                    {unreadCounts[customer._id] > 0 && (
                                                        <span className="customer-unread">
                                                            {unreadCounts[customer._id]}
                                                        </span>
                                                    )}
                                                </motion.div>
                                            ))
                                        )}
                                    </div>
                                ) : (
                                    /* Chat Messages */
                                    <>
                                        <div className="chat-messages">
                                            {messages.length === 0 ? (
                                                <div className="no-messages">
                                                    <FiMessageCircle size={48} />
                                                    <p>Chưa có tin nhắn</p>
                                                </div>
                                            ) : (
                                                messages.map(msg => (
                                                    <motion.div
                                                        key={msg._id}
                                                        className={`message ${msg.senderId === partnerId ? 'partner' : 'customer'}`}
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                    >
                                                        <div className="message-content">
                                                            <p>{msg.message}</p>
                                                            <span className="message-time">
                                                                <FiClock size={12} /> {formatTime(msg.timestamp)}
                                                            </span>
                                                        </div>
                                                    </motion.div>
                                                ))
                                            )}
                                            <div ref={messagesEndRef} />
                                        </div>

                                        {/* Input */}
                                        <div className="chat-input">
                                            <input
                                                type="text"
                                                placeholder="Nhập tin nhắn..."
                                                value={newMessage}
                                                onChange={(e) => setNewMessage(e.target.value)}
                                                onKeyPress={handleKeyPress}
                                            />
                                            <button
                                                className="send-btn"
                                                onClick={sendMessage}
                                                disabled={!newMessage.trim()}
                                            >
                                                <FiSend />
                                            </button>
                                        </div>
                                    </>
                                )}
                            </>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default PartnerLiveChat;
