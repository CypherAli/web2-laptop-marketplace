const express = require('express');
const http = require('http');
const cors = require('cors');
const path = require('path');
const socketIO = require('socket.io');
require('dotenv').config();
const connectDB = require('./config/db');

// Kết nối Database
connectDB();

const app = express();
const server = http.createServer(app);

// Socket.IO setup
const io = socketIO(server, {
    cors: {
        origin: process.env.CLIENT_URL || 'http://localhost:3001',
        methods: ['GET', 'POST'],
        credentials: true
    }
});

// Middlewares
app.use(cors());
app.use(express.json()); // Cho phép đọc JSON

// Serve static files for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/authRoute'));
app.use('/api/products', require('./routes/productRoute'));
app.use('/api/orders', require('./routes/orderRoute'));
app.use('/api/cart', require('./routes/cartRoute')); // Cart routes
app.use('/api/partner', require('./routes/partnerRoute'));
app.use('/api/admin', require('./routes/adminRoute'));
app.use('/api/reviews', require('./routes/reviewRoute'));
app.use('/api/comparisons', require('./routes/comparisonRoute'));
app.use('/api/analytics', require('./routes/analyticsRoute'));
// app.use('/api/chat', require('./routes/chatRoute')); // Old chat system
app.use('/api', require('./routes/chat')); // New live chat system
app.use('/api/user', require('./routes/userRoute'));

// New User System Routes
app.use('/api/user', require('./routes/userProfileRoutes'));
app.use('/api/warranty', require('./routes/warrantyRoutes'));
app.use('/api/price-alerts', require('./routes/priceAlertRoutes'));
app.use('/api/vouchers', require('./routes/voucherRoutes'));
app.use('/api/support', require('./routes/supportTicketRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/payment', require('./routes/paymentRoutes'));

// Route test
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Socket.IO connection handling
const Conversation = require('./models/Conversation');
const Message = require('./models/Message');
const Chat = require('./models/Chat');

// Store active users
const activeUsers = new Map();

io.on('connection', (socket) => {
    console.log('🔌 New socket connection:', socket.id);
    
    // User joins with authentication
    socket.on('user:join', (userId) => {
        activeUsers.set(userId, socket.id);
        socket.userId = userId;
        socket.join(`user:${userId}`);
        console.log(`✅ User ${userId} joined`);
        
        // Broadcast online status
        io.emit('user:online', userId);
    });
    
    // Join chat room
    socket.on('chat:join', ({ userId, partnerId }) => {
        const ids = [userId, partnerId].sort();
        const chatRoomId = `${ids[0]}_${ids[1]}`;
        
        // Leave all previous rooms except default ones
        const rooms = Array.from(socket.rooms);
        rooms.forEach(room => {
            if (room !== socket.id && !room.startsWith('user:')) {
                socket.leave(room);
                console.log(`🚪 Left room: ${room}`);
            }
        });
        
        // Join new room
        socket.join(chatRoomId);
        socket.currentChatRoom = chatRoomId; // Store current room
        console.log(`📨 User joined chat room: ${chatRoomId}`);
    });
    
    // Leave chat room
    socket.on('chat:leave', ({ userId, partnerId }) => {
        const ids = [userId, partnerId].sort();
        const chatRoomId = `${ids[0]}_${ids[1]}`;
        socket.leave(chatRoomId);
        socket.currentChatRoom = null;
        console.log(`🚪 User left chat room: ${chatRoomId}`);
    });
    
    // Live Chat System
    socket.on('chat:send', async (data) => {
        try {
            const {
                senderId,
                senderName,
                receiverId,
                receiverName,
                message,
                _id: tempId
            } = data;
            
            // Check if message already exists (prevent duplicate saves)
            if (tempId && tempId.startsWith('temp_')) {
                const recentMessage = await Chat.findOne({
                    senderId,
                    receiverId,
                    message: message.trim(),
                    createdAt: { $gte: new Date(Date.now() - 5000) } // Within last 5 seconds
                });
                
                if (recentMessage) {
                    console.log('⚠️ Duplicate message detected, skipping save');
                    return;
                }
            }
            
            // Create new chat message
            const newChat = new Chat({
                senderId,
                senderName,
                receiverId,
                receiverName,
                message: message.trim()
            });
            
            const savedChat = await newChat.save();
            
            // Emit to chat room ONLY ONCE
            const ids = [senderId, receiverId].sort();
            const chatRoomId = `${ids[0]}_${ids[1]}`;
            
            io.to(chatRoomId).emit('chat:message', savedChat);
            
            console.log(`💬 Message sent in room ${chatRoomId} - ID: ${savedChat._id}`);
        } catch (error) {
            console.error('Socket chat:send error:', error);
            socket.emit('error', { message: 'Lỗi khi gửi tin nhắn' });
        }
    });
    
    // Typing indicator for chat
    socket.on('chat:typing', ({ chatRoomId, userName, isTyping }) => {
        socket.to(chatRoomId).emit('chat:typing', { userName, isTyping });
    });
    
    // Join conversation room (existing system)
    socket.on('conversation:join', (conversationId) => {
        socket.join(`conversation:${conversationId}`);
        console.log(`📨 User joined conversation: ${conversationId}`);
    });
    
    // Send message (existing system)
    socket.on('message:send', async (data) => {
        try {
            const { conversationId, message, senderId, senderRole, attachments } = data;
            
            // Create message in database
            const newMessage = await Message.create({
                conversation: conversationId,
                sender: senderId,
                senderRole,
                message,
                attachments: attachments || []
            });
            
            await newMessage.populate('sender', 'username email role avatar');
            
            // Update conversation
            const conversation = await Conversation.findById(conversationId);
            if (conversation) {
                conversation.lastMessage = {
                    text: message,
                    sender: senderId,
                    timestamp: new Date()
                };
                
                // Increment unread for other participants
                conversation.participants.forEach(p => {
                    if (p.user.toString() !== senderId.toString()) {
                        const userId = p.user.toString();
                        const current = conversation.unreadCount.get(userId) || 0;
                        conversation.unreadCount.set(userId, current + 1);
                    }
                });
                
                await conversation.save();
            }
            
            // Broadcast to conversation room
            io.to(`conversation:${conversationId}`).emit('message:received', newMessage);
            
            // Notify other participants
            conversation.participants.forEach(p => {
                if (p.user.toString() !== senderId.toString()) {
                    io.to(`user:${p.user}`).emit('notification:new_message', {
                        conversationId,
                        message: newMessage
                    });
                }
            });
        } catch (error) {
            console.error('Socket message:send error:', error);
            socket.emit('error', { message: 'Lỗi khi gửi tin nhắn' });
        }
    });
    
    // Typing indicator (existing system)
    socket.on('typing:start', (data) => {
        const { conversationId, userId, username } = data;
        socket.to(`conversation:${conversationId}`).emit('typing:active', { userId, username });
    });
    
    socket.on('typing:stop', (data) => {
        const { conversationId, userId } = data;
        socket.to(`conversation:${conversationId}`).emit('typing:inactive', { userId });
    });
    
    // Mark as read (existing system)
    socket.on('message:read', async (data) => {
        try {
            const { conversationId, userId } = data;
            
            const conversation = await Conversation.findById(conversationId);
            if (conversation) {
                await conversation.markAsRead(userId);
                
                // Notify sender
                io.to(`conversation:${conversationId}`).emit('messages:read', { 
                    conversationId, 
                    userId 
                });
            }
        } catch (error) {
            console.error('Socket message:read error:', error);
        }
    });
    
    // Disconnect
    socket.on('disconnect', () => {
        if (socket.userId) {
            activeUsers.delete(socket.userId);
            io.emit('user:offline', socket.userId);
            console.log(`❌ User ${socket.userId} disconnected`);
        }
    });
});

// Make io accessible in routes
app.set('io', io);

// Initialize cron jobs
const cronJobs = require('./services/cronJobs');
cronJobs.init();

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🔌 Socket.IO ready for connections`);
    console.log(`⏰ Cron jobs are running`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully...');
    cronJobs.stopAll();
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});