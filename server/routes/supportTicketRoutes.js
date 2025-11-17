const express = require('express');
const router = express.Router();
const supportTicketController = require('../controllers/supportTicketController');
const { protect, admin } = require('../middleware/authMiddleware');

// All routes require authentication
router.use(protect);

// ==================== USER ROUTES ====================
router.get('/my-tickets', supportTicketController.getMyTickets);
router.get('/:ticketId', supportTicketController.getTicketById);
router.post('/create', supportTicketController.createTicket);
router.post('/:ticketId/message', supportTicketController.addMessage);
router.post('/:ticketId/close', supportTicketController.closeTicket);
router.post('/:ticketId/reopen', supportTicketController.reopenTicket);
router.post('/:ticketId/feedback', supportTicketController.submitFeedback);

// ==================== ADMIN/AGENT ROUTES ====================
router.get('/admin/all', admin, supportTicketController.getAllTickets);
router.post('/:ticketId/assign', admin, supportTicketController.assignTicket);
router.post('/:ticketId/reply', admin, supportTicketController.replyToTicket);
router.post('/:ticketId/resolve', admin, supportTicketController.resolveTicket);
router.put('/:ticketId/priority', admin, supportTicketController.updateTicketPriority);
router.post('/:ticketId/internal-note', admin, supportTicketController.addInternalNote);

module.exports = router;
