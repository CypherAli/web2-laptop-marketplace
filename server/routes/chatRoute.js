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
const optionalAuth = require('../middleware/optionalAuth');
const authorize = require('../middleware/authorize');

// Public routes (allow anonymous users to chat with partners)
router.post('/conversations', optionalAuth, createConversation);
router.get('/conversations/:conversationId/messages', optionalAuth, getMessages);
router.post('/conversations/:conversationId/messages', optionalAuth, sendMessage);

// Authenticated user routes
router.use(auth);

router.get('/conversations', getConversations);
router.get('/unread-count', getUnreadCount);
router.put('/conversations/:conversationId/read', markAsRead);

// Admin-only routes
router.put('/conversations/:conversationId/archive', authorize('admin'), archiveConversation);
router.put('/conversations/:conversationId/assign', authorize('admin'), assignConversation);

module.exports = router;
