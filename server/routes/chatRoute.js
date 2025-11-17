const express = require('express');
const router = express.Router();
const {
    getConversations,
    createConversation,
    getMessages,
    sendMessage,
    markAsRead,
    getUnreadCount,
    archiveConversation,
    assignConversation
} = require('../controllers/chatController');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');

// All routes require authentication
router.use(auth);

// Conversation routes
router.get('/conversations', getConversations);
router.post('/conversations', createConversation);
router.get('/unread-count', getUnreadCount);

// Message routes
router.get('/conversations/:conversationId/messages', getMessages);
router.post('/conversations/:conversationId/messages', sendMessage);
router.put('/conversations/:conversationId/read', markAsRead);

// Admin-only routes
router.put('/conversations/:conversationId/archive', authorize('admin'), archiveConversation);
router.put('/conversations/:conversationId/assign', authorize('admin'), assignConversation);

module.exports = router;
