const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const User = require('../models/User');

// @desc    Get all conversations for a user
// @route   GET /api/chat/conversations
// @access  Private
exports.getConversations = async (req, res) => {
    try {
        const userId = req.user.id;
        
        const conversations = await Conversation.find({
            'participants.user': userId,
            status: { $ne: 'closed' }
        })
        .populate('participants.user', 'username email role avatar shopName')
        .populate('lastMessage.sender', 'username')
        .populate('assignedTo', 'username')
        .sort({ 'lastMessage.timestamp': -1 });
        
        res.json({
            success: true,
            count: conversations.length,
            conversations
        });
    } catch (error) {
        console.error('Get conversations error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error loading conversations' 
        });
    }
};

// @desc    Get or create conversation between user and admin
// @route   POST /api/chat/conversations
// @access  Private/Public (Anonymous allowed for partner chat)
exports.createConversation = async (req, res) => {
    try {
        const { targetUserId, subject, type } = req.body;
        
        // Get target user info to determine conversation type
        const targetUser = await User.findById(targetUserId);
        if (!targetUser) {
            return res.status(404).json({ 
                success: false, 
                message: 'User not found' 
            });
        }
        
        // Determine conversation type based on user roles
        let conversationType;
        let participants;
        
        // Handle anonymous users
        if (!req.isAuthenticated) {
            // Anonymous user can only chat with partners
            if (targetUser.role !== 'partner') {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Please login to chat with admin' 
                });
            }
            
            conversationType = 'anonymous_partner';
            participants = [
                { 
                    role: 'anonymous', 
                    anonymousId: req.anonymousId,
                    anonymousName: req.anonymousName 
                },
                { user: targetUserId, role: 'partner' }
            ];
            
            // Check if conversation already exists for this anonymous user
            let conversation = await Conversation.findOne({
                type: conversationType,
                'participants.anonymousId': req.anonymousId,
                'participants.user': targetUserId,
                status: { $ne: 'closed' }
            }).populate('participants.user', 'username email role avatar shopName');
            
            if (conversation) {
                return res.json({
                    success: true,
                    conversation,
                    isNew: false
                });
            }
            
            // Create new conversation for anonymous user
            conversation = await Conversation.create({
                participants,
                type: conversationType,
                subject: subject || 'Product Consultation',
                unreadCount: new Map()
            });
            
            await conversation.populate('participants.user', 'username email role avatar shopName');
            
            return res.status(201).json({
                success: true,
                conversation,
                isNew: true,
                anonymousId: req.anonymousId
            });
        }
        
        // Authenticated users
        const userId = req.user.id;
        
        if (req.user.role === 'client' && targetUser.role === 'partner') {
            // User chat with partner
            conversationType = 'user_partner';
            participants = [
                { user: userId, role: 'client' },
                { user: targetUserId, role: 'partner' }
            ];
        } else if (req.user.role === 'partner' && targetUser.role === 'admin') {
            // Partner chat with admin
            conversationType = 'partner_admin';
            participants = [
                { user: userId, role: 'partner' },
                { user: targetUserId, role: 'admin' }
            ];
        } else if (req.user.role === 'client' && targetUser.role === 'admin') {
            // User chat with admin
            conversationType = 'user_admin';
            participants = [
                { user: userId, role: 'client' },
                { user: targetUserId, role: 'admin' }
            ];
        } else if (req.user.role === 'admin') {
            // Admin can chat with anyone
            if (targetUser.role === 'partner') {
                conversationType = 'partner_admin';
            } else {
                conversationType = 'user_admin';
            }
            participants = [
                { user: userId, role: 'admin' },
                { user: targetUserId, role: targetUser.role }
            ];
        } else {
            return res.status(400).json({ 
                success: false, 
                message: 'Cannot create conversation with this user' 
            });
        }
        
        // Check if conversation already exists
        let conversation = await Conversation.findOne({
            type: conversationType,
            'participants.user': { $all: [userId, targetUserId] },
            status: { $ne: 'closed' }
        });
        
        if (conversation) {
            await conversation.populate('participants.user', 'username email role avatar shopName');
            return res.json({
                success: true,
                conversation,
                isNew: false
            });
        }
        
        // Create new conversation
        conversation = await Conversation.create({
            participants,
            type: conversationType,
            subject: subject || 'Hỗ trợ khách hàng',
            unreadCount: new Map()
        });
        
        await conversation.populate('participants.user', 'username email role avatar shopName');
        
        res.status(201).json({
            success: true,
            conversation,
            isNew: true
        });
    } catch (error) {
        console.error('Create conversation error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error creating conversation' 
        });
    }
};

// @desc    Get messages for a conversation
// @route   GET /api/chat/conversations/:conversationId/messages
// @access  Private/Public (Anonymous allowed)
exports.getMessages = async (req, res) => {
    try {
        const { conversationId } = req.params;
        const { page = 1, limit = 50 } = req.query;
        
        // Verify user is participant
        const conversation = await Conversation.findById(conversationId);
        if (!conversation) {
            return res.status(404).json({ 
                success: false, 
                message: 'Conversation not found' 
            });
        }
        
        // Check if user is participant (handle both authenticated and anonymous)
        let isParticipant = false;
        
        if (req.isAuthenticated) {
            isParticipant = conversation.participants.some(p => 
                p.user && p.user.equals(req.user.id)
            );
        } else {
            // Anonymous user
            isParticipant = conversation.participants.some(p => 
                p.anonymousId === req.anonymousId
            );
        }
        
        if (!isParticipant) {
            return res.status(403).json({ 
                success: false, 
                message: 'You do not have permission to access this conversation' 
            });
        }
        
        const messages = await Message.find({ 
            conversation: conversationId,
            isDeleted: false
        })
        .populate('sender', 'username email role avatar')
        .populate('replyTo')
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);
        
        const count = await Message.countDocuments({ 
            conversation: conversationId,
            isDeleted: false
        });
        
        // Mark messages as read (only for authenticated users)
        if (req.isAuthenticated) {
            await conversation.markAsRead(req.user.id);
        }
        
        res.json({
            success: true,
            messages: messages.reverse(), // Oldest first
            currentPage: page,
            totalPages: Math.ceil(count / limit),
            totalMessages: count
        });
    } catch (error) {
        console.error('Get messages error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error loading messages' 
        });
    }
};

// @desc    Send a message
// @route   POST /api/chat/conversations/:conversationId/messages
// @access  Private/Public (Anonymous allowed)
exports.sendMessage = async (req, res) => {
    try {
        const { conversationId } = req.params;
        const { message, attachments, replyTo } = req.body;
        
        // Verify conversation exists and user is participant
        const conversation = await Conversation.findById(conversationId);
        if (!conversation) {
            return res.status(404).json({ 
                success: false, 
                message: 'Conversation not found' 
            });
        }
        
        // Check if user is participant
        let isParticipant = false;
        
        if (req.isAuthenticated) {
            isParticipant = conversation.participants.some(p => 
                p.user && p.user.equals(req.user.id)
            );
        } else {
            // Anonymous user
            isParticipant = conversation.participants.some(p => 
                p.anonymousId === req.anonymousId
            );
        }
        
        if (!isParticipant) {
            return res.status(403).json({ 
                success: false, 
                message: 'You do not have permission to send messages in this conversation' 
            });
        }
        
        // Create message
        let messageData = {
            conversation: conversationId,
            message,
            attachments: attachments || [],
            replyTo: replyTo || null
        };
        
        if (req.isAuthenticated) {
            messageData.sender = req.user.id;
            messageData.senderRole = req.user.role;
        } else {
            messageData.senderRole = 'anonymous';
            messageData.anonymousId = req.anonymousId;
            messageData.anonymousName = req.anonymousName;
        }
        
        const newMessage = await Message.create(messageData);
        
        if (req.isAuthenticated) {
            await newMessage.populate('sender', 'username email role avatar');
        }
        
        // Update conversation
        conversation.lastMessage = {
            text: message,
            sender: req.isAuthenticated ? req.user.id : null,
            timestamp: new Date()
        };
        
        // Increment unread count for other participants (only for authenticated users)
        if (req.isAuthenticated) {
            conversation.participants.forEach(p => {
                if (p.user && !p.user.equals(req.user.id)) {
                    conversation.incrementUnread(p.user);
                }
            });
        } else {
            // For anonymous, increment unread for partner
            conversation.participants.forEach(p => {
                if (p.user && p.role === 'partner') {
                    conversation.incrementUnread(p.user);
                }
            });
        }
        
        await conversation.save();
        
        res.status(201).json({
            success: true,
            message: newMessage
        });
    } catch (error) {
        console.error('Send message error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error sending message' 
        });
    }
};

// @desc    Mark conversation as read
// @route   PUT /api/chat/conversations/:conversationId/read
// @access  Private
exports.markAsRead = async (req, res) => {
    try {
        const { conversationId } = req.params;
        
        const conversation = await Conversation.findById(conversationId);
        if (!conversation) {
            return res.status(404).json({ 
                success: false, 
                message: 'Không tìm thấy cuộc hội thoại' 
            });
        }
        
        await conversation.markAsRead(req.user.id);
        
        res.json({
            success: true,
            message: 'Marked as read'
        });
    } catch (error) {
        console.error('Mark as read error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error marking as read' 
        });
    }
};

// @desc    Get unread messages count
// @route   GET /api/chat/unread-count
// @access  Private
exports.getUnreadCount = async (req, res) => {
    try {
        const userId = req.user.id;
        
        const conversations = await Conversation.find({
            'participants.user': userId,
            status: { $ne: 'closed' }
        });
        
        let totalUnread = 0;
        conversations.forEach(conv => {
            const count = conv.unreadCount.get(userId.toString()) || 0;
            totalUnread += count;
        });
        
        res.json({
            success: true,
            unreadCount: totalUnread
        });
    } catch (error) {
        console.error('Get unread count error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error loading unread message count' 
        });
    }
};

// @desc    Archive conversation (Admin only)
// @route   PUT /api/chat/conversations/:conversationId/archive
// @access  Private (Admin)
exports.archiveConversation = async (req, res) => {
    try {
        const { conversationId } = req.params;
        
        const conversation = await Conversation.findByIdAndUpdate(
            conversationId,
            { status: 'archived' },
            { new: true }
        );
        
        if (!conversation) {
            return res.status(404).json({ 
                success: false, 
                message: 'Conversation not found' 
            });
        }
        
        res.json({
            success: true,
            message: 'Conversation archived',
            conversation
        });
    } catch (error) {
        console.error('Archive conversation error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error archiving conversation' 
        });
    }
};

// @desc    Assign conversation to admin
// @route   PUT /api/chat/conversations/:conversationId/assign
// @access  Private (Admin)
exports.assignConversation = async (req, res) => {
    try {
        const { conversationId } = req.params;
        const { adminId } = req.body;
        
        // Verify admin exists
        const admin = await User.findById(adminId);
        if (!admin || admin.role !== 'admin') {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid admin' 
            });
        }
        
        const conversation = await Conversation.findByIdAndUpdate(
            conversationId,
            { assignedTo: adminId },
            { new: true }
        ).populate('assignedTo', 'username email');
        
        if (!conversation) {
            return res.status(404).json({ 
                success: false, 
                message: 'Conversation not found' 
            });
        }
        
        res.json({
            success: true,
            message: 'Conversation assigned',
            conversation
        });
    } catch (error) {
        console.error('Assign conversation error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error assigning conversation' 
        });
    }
};
