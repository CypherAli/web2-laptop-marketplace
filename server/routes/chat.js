const express = require('express');
const Chat = require('../models/Chat');
const User = require('../models/User');
const router = express.Router();

// Search partners by email
router.get('/partners/search', async (req, res) => {
    try {
        const { email } = req.query;
        
        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email parameter is required'
            });
        }
        
        // Search for partners (users with role='partner') with matching email (case-insensitive)
        const partners = await User.find({
            email: { $regex: email, $options: 'i' },
            role: 'partner',
            isActive: true,
            isApproved: true
        }).select('shopName email phone addresses createdAt');
        
        // Format response to match expected structure
        const formattedPartners = partners.map(partner => ({
            _id: partner._id,
            businessName: partner.shopName,
            email: partner.email,
            phone: partner.phone,
            address: partner.addresses[0] ? 
                `${partner.addresses[0].address.street}, ${partner.addresses[0].address.district}, ${partner.addresses[0].address.city}` :
                'Chưa cập nhật địa chỉ',
            createdAt: partner.createdAt
        }));
        
        res.json({
            success: true,
            partners: formattedPartners,
            count: formattedPartners.length
        });
    } catch (error) {
        console.error('Error searching partners:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

// Get chat history between two users
router.get('/chat/history/:userId/:partnerId', async (req, res) => {
    try {
        const { userId, partnerId } = req.params;
        const { page = 1, limit = 50 } = req.query;
        
        if (!userId || !partnerId) {
            return res.status(400).json({
                success: false,
                message: 'User ID and Partner ID are required'
            });
        }
        
        // Get chat history using static method
        let messages = await Chat.getChatHistory(
            userId, 
            partnerId, 
            parseInt(limit), 
            parseInt(page)
        );
        
        // Remove duplicates based on _id and content
        const uniqueMessages = [];
        const seenIds = new Set();
        const seenContents = new Set();
        
        messages.forEach(msg => {
            const msgId = msg._id.toString();
            const msgContent = `${msg.senderId}_${msg.message}_${new Date(msg.createdAt).getTime()}`;
            
            if (!seenIds.has(msgId) && !seenContents.has(msgContent)) {
                seenIds.add(msgId);
                seenContents.add(msgContent);
                uniqueMessages.push(msg);
            }
        });
        
        // Reverse to get chronological order (oldest first)
        const sortedMessages = uniqueMessages.reverse();
        
        console.log(`📥 Loaded ${sortedMessages.length} unique messages (removed ${messages.length - sortedMessages.length} duplicates)`);
        
        // Mark messages as read for the requesting user
        await Chat.markAsRead(
            sortedMessages[0]?.chatRoomId || `${[userId, partnerId].sort().join('_')}`, 
            userId
        );
        
        res.json({
            success: true,
            messages: sortedMessages,
            page: parseInt(page),
            limit: parseInt(limit)
        });
    } catch (error) {
        console.error('Error getting chat history:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

// Send a new message
router.post('/chat/send', async (req, res) => {
    try {
        const {
            senderId,
            senderName,
            receiverId,
            receiverName,
            message,
            messageType = 'text',
            replyTo = null
        } = req.body;
        
        console.log('💬 Received chat message:', { senderId, senderName, receiverId, receiverName, message: message?.substring(0, 50) });
        
        // Validation
        if (!senderId || !senderName || !receiverId || !receiverName || !message) {
            console.log('❌ Missing fields:', { senderId, senderName, receiverId, receiverName, hasMessage: !!message });
            return res.status(400).json({
                success: false,
                message: 'Missing required fields',
                details: {
                    senderId: !!senderId,
                    senderName: !!senderName,
                    receiverId: !!receiverId,
                    receiverName: !!receiverName,
                    message: !!message
                }
            });
        }
        
        if (message.length > 2000) {
            return res.status(400).json({
                success: false,
                message: 'Message too long (max 2000 characters)'
            });
        }
        
        // Create new chat message
        const newChat = new Chat({
            senderId,
            senderName,
            receiverId,
            receiverName,
            message: message.trim(),
            messageType,
            replyTo
        });
        
        const savedChat = await newChat.save();
        
        // Populate reply reference if exists
        if (savedChat.replyTo) {
            await savedChat.populate('replyTo', 'message senderName');
        }
        
        // TODO: Emit socket event for real-time updates
        // io.to(savedChat.chatRoomId).emit('newMessage', savedChat);
        
        res.json({
            success: true,
            message: 'Message sent successfully',
            chat: savedChat
        });
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

// Get recent chats for a user
router.get('/chat/recent/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const { limit = 20 } = req.query;
        
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: 'User ID is required'
            });
        }
        
        const recentChats = await Chat.getRecentChats(userId, parseInt(limit));
        
        // Get partner information for each chat
        const chatsWithPartnerInfo = await Promise.all(
            recentChats.map(async (chat) => {
                const lastMessage = chat.lastMessage;
                const otherUserId = lastMessage.senderId === userId 
                    ? lastMessage.receiverId 
                    : lastMessage.senderId;
                
                let partnerInfo = null;
                
                // Try to get partner info if the other user is a partner
                if (!otherUserId.startsWith('user_')) {
                    partnerInfo = await User.findById(otherUserId)
                        .select('shopName email');
                }
                
                return {
                    chatRoomId: chat._id,
                    lastMessage: {
                        message: lastMessage.message,
                        senderName: lastMessage.senderName,
                        timestamp: lastMessage.createdAt,
                        isFromMe: lastMessage.senderId === userId
                    },
                    otherUser: {
                        id: otherUserId,
                        name: partnerInfo ? partnerInfo.shopName : lastMessage.senderName,
                        email: partnerInfo ? partnerInfo.email : null,
                        type: otherUserId.startsWith('user_') ? 'user' : 'partner'
                    },
                    unreadCount: chat.unreadCount
                };
            })
        );
        
        res.json({
            success: true,
            chats: chatsWithPartnerInfo
        });
    } catch (error) {
        console.error('Error getting recent chats:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

// Mark messages as read
router.put('/chat/read/:chatRoomId/:userId', async (req, res) => {
    try {
        const { chatRoomId, userId } = req.params;
        
        if (!chatRoomId || !userId) {
            return res.status(400).json({
                success: false,
                message: 'Chat room ID and User ID are required'
            });
        }
        
        const result = await Chat.markAsRead(chatRoomId, userId);
        
        res.json({
            success: true,
            message: 'Messages marked as read',
            modifiedCount: result.modifiedCount
        });
    } catch (error) {
        console.error('Error marking messages as read:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

// Get unread message count
router.get('/chat/unread/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: 'User ID is required'
            });
        }
        
        const unreadCount = await Chat.getUnreadCount(userId);
        
        res.json({
            success: true,
            unreadCount
        });
    } catch (error) {
        console.error('Error getting unread count:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

// Delete a message (soft delete)
router.delete('/chat/:messageId', async (req, res) => {
    try {
        const { messageId } = req.params;
        const { userId } = req.body;
        
        if (!messageId || !userId) {
            return res.status(400).json({
                success: false,
                message: 'Message ID and User ID are required'
            });
        }
        
        const message = await Chat.findById(messageId);
        
        if (!message) {
            return res.status(404).json({
                success: false,
                message: 'Message not found'
            });
        }
        
        // Only the sender can delete their message
        if (message.senderId !== userId) {
            return res.status(403).json({
                success: false,
                message: 'You can only delete your own messages'
            });
        }
        
        await message.markAsDeleted();
        
        res.json({
            success: true,
            message: 'Message deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting message:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

// Add reaction to a message
router.post('/chat/:messageId/reaction', async (req, res) => {
    try {
        const { messageId } = req.params;
        const { userId, reactionType } = req.body;
        
        if (!messageId || !userId || !reactionType) {
            return res.status(400).json({
                success: false,
                message: 'Message ID, User ID, and reaction type are required'
            });
        }
        
        const validReactions = ['like', 'love', 'laugh', 'angry', 'sad'];
        if (!validReactions.includes(reactionType)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid reaction type'
            });
        }
        
        const message = await Chat.findById(messageId);
        
        if (!message) {
            return res.status(404).json({
                success: false,
                message: 'Message not found'
            });
        }
        
        await message.addReaction(userId, reactionType);
        
        res.json({
            success: true,
            message: 'Reaction added successfully',
            reactions: message.reactions
        });
    } catch (error) {
        console.error('Error adding reaction:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

// Remove reaction from a message
router.delete('/chat/:messageId/reaction', async (req, res) => {
    try {
        const { messageId } = req.params;
        const { userId } = req.body;
        
        if (!messageId || !userId) {
            return res.status(400).json({
                success: false,
                message: 'Message ID and User ID are required'
            });
        }
        
        const message = await Chat.findById(messageId);
        
        if (!message) {
            return res.status(404).json({
                success: false,
                message: 'Message not found'
            });
        }
        
        await message.removeReaction(userId);
        
        res.json({
            success: true,
            message: 'Reaction removed successfully',
            reactions: message.reactions
        });
    } catch (error) {
        console.error('Error removing reaction:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

module.exports = router;