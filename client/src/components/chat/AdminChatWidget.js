import React, { useState, useEffect, useRef, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiSend, FiMinus, FiUsers } from 'react-icons/fi';
import AuthContext from '../../context/AuthContext';
import io from 'socket.io-client';
import './PartnerChatWidget.css'; // Reuse the same styles

/**
 * Admin Chat Widget
 * Admin có thể chat với Partners và Users
 */
const AdminChatWidget = () => {
    const { user } = useContext(AuthContext);
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [showUserList, setShowUserList] = useState(true);
    const [selectedUser, setSelectedUser] = useState(null);
    const [messageInput, setMessageInput] = useState('');
    const [messages, setMessages] = useState([]);
    const [partners, setPartners] = useState([]);
    const [clients, setClients] = useState([]);
    const [activeTab, setActiveTab] = useState('partners'); // 'partners' or 'clients'
    const [loading, setLoading] = useState(false);
    const [socket, setSocket] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const messagesEndRef = useRef(null);

    const adminId = user?._id || user?.id;

    // Socket.IO setup
    useEffect(() => {
        if (!user || !isOpen || !adminId) return;

        const newSocket = io(process.env.REACT_APP_SERVER_URL || 'http://localhost:5000', {
            transports: ['polling', 'websocket'],
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionAttempts: 5,
        });
        
        setSocket(newSocket);

        newSocket.on('connect', () => {
            console.log('✅ Admin connected to chat');
            setIsConnected(true);
            newSocket.emit('user:join', adminId); // Admin joins as user
        });

        newSocket.on('disconnect', () => {
            console.log('❌ Admin disconnected');
            setIsConnected(false);
        });

        newSocket.on('chat:message', (message) => {
            console.log('📩 Admin received message:', message);
            
            // Only add if it's for current conversation
            if (selectedUser && 
                ((message.senderId === adminId && message.receiverId === selectedUser._id) ||
                 (message.senderId === selectedUser._id && message.receiverId === adminId))) {
                
                setMessages(prev => {
                    const exists = prev.some(m => 
                        m._id === message._id || 
                        (m.message === message.message && 
                         m.senderId === message.senderId && 
                         Math.abs(new Date(m.createdAt) - new Date(message.createdAt)) < 2000)
                    );
                    
                    if (exists) {
                        return prev.map(m => 
                            m.isTemp && m.message === message.message && m.senderId === message.senderId
                                ? { ...message, isTemp: false }
                                : m
                        );
                    }
                    
                    return [...prev, message];
                });
            }
        });

        return () => {
            newSocket.disconnect();
        };
    }, [user, selectedUser, isOpen, adminId]);

    useEffect(() => {
        if (isOpen) {
            if (activeTab === 'partners') {
                fetchPartners();
            } else {
                fetchClients();
            }
        }
        // eslint-disable-next-line
    }, [isOpen, activeTab]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const fetchPartners = async () => {
        try {
            setLoading(true);
            const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
            const response = await fetch(`${apiUrl}/partner/list-active`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            
            if (data.success) {
                setPartners(data.partners || []);
            }
        } catch (error) {
            console.error('Error fetching partners:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchClients = async () => {
        try {
            setLoading(true);
            const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
            const response = await fetch(`${apiUrl}/admin/users?role=client`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            
            if (data.success) {
                setClients(data.users || []);
            }
        } catch (error) {
            console.error('Error fetching clients:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchMessages = async (targetUserId) => {
        try {
            if (!adminId) return;
            
            const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
            const response = await fetch(`${apiUrl}/chat/history/${adminId}/${targetUserId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            
            if (data.success) {
                setMessages(data.messages || []);
            }
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    const handleOpenChat = () => {
        setIsOpen(true);
        setIsMinimized(false);
    };

    const handleClose = () => {
        setIsOpen(false);
        setIsMinimized(false);
        setShowUserList(true);
        setSelectedUser(null);
    };

    const handleMinimize = () => {
        setIsMinimized(!isMinimized);
    };

    const handleSelectUser = (targetUser) => {
        setSelectedUser(targetUser);
        setShowUserList(false);
        fetchMessages(targetUser._id);
        
        // Join chat room via socket
        if (socket?.connected) {
            socket.emit('chat:join', { userId: adminId, partnerId: targetUser._id });
        }
    };

    const handleBackToList = () => {
        if (socket?.connected && selectedUser) {
            socket.emit('chat:leave', { userId: adminId, partnerId: selectedUser._id });
        }
        
        setShowUserList(true);
        setSelectedUser(null);
        setMessages([]);
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        
        if (!messageInput.trim() || !selectedUser || !adminId) return;

        const tempId = `temp_${Date.now()}`;
        const messageData = {
            _id: tempId,
            message: messageInput.trim(),
            senderId: adminId,
            senderName: user.name || user.username || 'Admin',
            receiverId: selectedUser._id,
            receiverName: selectedUser.name || selectedUser.shopName || selectedUser.username || 'User',
            createdAt: new Date(),
            isTemp: true
        };

        setMessages(prev => [...prev, messageData]);
        setMessageInput('');

        try {
            if (socket?.connected) {
                console.log('📤 Admin sending via socket:', messageData.message);
                socket.emit('chat:send', messageData);
                
                setTimeout(() => {
                    setMessages(prev => 
                        prev.map(msg => 
                            msg._id === tempId ? { ...msg, isTemp: false } : msg
                        )
                    );
                }, 500);
            } else {
                // Fallback to API
                const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
                
                const payload = {
                    senderId: adminId,
                    senderName: user.name || user.username || 'Admin',
                    receiverId: selectedUser._id,
                    receiverName: selectedUser.name || selectedUser.shopName || selectedUser.username || 'User',
                    message: messageData.message
                };
                
                const response = await fetch(`${apiUrl}/chat/send`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify(payload)
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
            console.error('Error sending message:', error);
            setMessages(prev => prev.filter(msg => msg._id !== tempId));
        }
    };

    const formatTime = (date) => {
        const d = new Date(date);
        return d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    };

    if (!user || user.role !== 'admin') return null;

    const currentList = activeTab === 'partners' ? partners : clients;

    return (
        <>
            {/* Chat Button */}
            <AnimatePresence>
                {!isOpen && (
                    <motion.button
                        className="partner-chat-button"
                        onClick={handleOpenChat}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        title="Admin Chat"
                        style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
                    >
                        <FiUsers size={24} />
                        <span className="button-label">Admin Chat</span>
                    </motion.button>
                )}
            </AnimatePresence>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className={`partner-chat-container ${isMinimized ? 'minimized' : ''}`}
                        initial={{ opacity: 0, y: 50, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.8 }}
                        transition={{ duration: 0.2 }}
                    >
                        {/* Header */}
                        <div className="partner-chat-header" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                            <div className="header-left">
                                {!showUserList && selectedUser && (
                                    <button className="back-button" onClick={handleBackToList}>
                                        ←
                                    </button>
                                )}
                                <FiUsers />
                                <span>
                                    {showUserList 
                                        ? 'Admin Chat' 
                                        : (selectedUser?.shopName || selectedUser?.name || selectedUser?.username || 'User')
                                    }
                                </span>
                                {isConnected && <span className="status-dot"></span>}
                            </div>
                            <div className="header-actions">
                                <button onClick={handleMinimize}>
                                    <FiMinus />
                                </button>
                                <button onClick={handleClose}>
                                    <FiX />
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="partner-chat-content">
                            {showUserList ? (
                                <>
                                    {/* Tab Selector */}
                                    <div className="chat-tabs">
                                        <button 
                                            className={activeTab === 'partners' ? 'active' : ''}
                                            onClick={() => setActiveTab('partners')}
                                        >
                                            Partners ({partners.length})
                                        </button>
                                        <button 
                                            className={activeTab === 'clients' ? 'active' : ''}
                                            onClick={() => setActiveTab('clients')}
                                        >
                                            Clients ({clients.length})
                                        </button>
                                    </div>

                                    {/* User List */}
                                    <div className="partner-list">
                                        {loading ? (
                                            <div className="loading-state">Đang tải...</div>
                                        ) : currentList.length === 0 ? (
                                            <div className="empty-state">
                                                Không có {activeTab === 'partners' ? 'partner' : 'client'} nào
                                            </div>
                                        ) : (
                                            currentList.map(item => (
                                                <div 
                                                    key={item._id} 
                                                    className="partner-item"
                                                    onClick={() => handleSelectUser(item)}
                                                >
                                                    <div className="partner-avatar">
                                                        {(item.shopName || item.name || item.username || 'U')[0].toUpperCase()}
                                                    </div>
                                                    <div className="partner-info">
                                                        <div className="partner-name">
                                                            {item.shopName || item.name || item.username || 'User'}
                                                        </div>
                                                        <div className="partner-email">{item.email}</div>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </>
                            ) : (
                                <>
                                    {/* Messages */}
                                    <div className="messages-container">
                                        {messages.map((msg, index) => (
                                            <div 
                                                key={msg._id || index}
                                                className={`message ${msg.senderId === adminId ? 'sent' : 'received'} ${msg.isTemp ? 'temp' : ''}`}
                                            >
                                                <div className="message-content">
                                                    <div className="message-text">{msg.message}</div>
                                                    <div className="message-time">
                                                        {formatTime(msg.createdAt || msg.timestamp)}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        <div ref={messagesEndRef} />
                                    </div>

                                    {/* Input */}
                                    <form className="message-input-container" onSubmit={handleSendMessage}>
                                        <input
                                            type="text"
                                            value={messageInput}
                                            onChange={(e) => setMessageInput(e.target.value)}
                                            placeholder="Nhập tin nhắn..."
                                            className="message-input"
                                        />
                                        <button 
                                            type="submit" 
                                            className="send-button"
                                            disabled={!messageInput.trim()}
                                        >
                                            <FiSend />
                                        </button>
                                    </form>
                                </>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default AdminChatWidget;
