const SupportTicket = require('../models/SupportTicket');
const Notification = require('../models/Notification');

/**
 * SUPPORT TICKET CONTROLLER
 * Hệ thống hỗ trợ khách hàng
 */

// ==================== USER TICKET MANAGEMENT ====================

// Get user's tickets
exports.getMyTickets = async (req, res) => {
    try {
        const { status, category, page = 1, limit = 20 } = req.query;
        
        const filter = { user: req.user.id };
        if (status) filter.status = status;
        if (category) filter.category = category;
        
        const skip = (parseInt(page) - 1) * parseInt(limit);
        
        const tickets = await SupportTicket.find(filter)
            .populate('relatedOrder', 'orderNumber totalAmount')
            .populate('relatedProduct', 'name brand imageUrl')
            .populate('assignedTo', 'username')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));
        
        const total = await SupportTicket.countDocuments(filter);
        
        res.json({
            tickets,
            currentPage: parseInt(page),
            totalPages: Math.ceil(total / parseInt(limit)),
            total
        });
    } catch (error) {
        console.error('Get my tickets error:', error);
        res.status(500).json({ error: error.message });
    }
};

// Get ticket by ID
exports.getTicketById = async (req, res) => {
    try {
        const { ticketId } = req.params;
        
        const ticket = await SupportTicket.findOne({
            _id: ticketId,
            user: req.user.id
        })
            .populate('relatedOrder')
            .populate('relatedProduct')
            .populate('relatedWarranty')
            .populate('assignedTo', 'username email')
            .populate('messages.sender', 'username role')
            .populate('resolution.resolvedBy', 'username');
        
        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }
        
        // Mark messages as read
        ticket.messages.forEach(msg => {
            if (msg.senderRole !== 'customer' && !msg.readAt) {
                msg.readAt = new Date();
            }
        });
        
        await ticket.save();
        
        res.json(ticket);
    } catch (error) {
        console.error('Get ticket error:', error);
        res.status(500).json({ error: error.message });
    }
};

// Create new ticket
exports.createTicket = async (req, res) => {
    try {
        const {
            subject,
            category,
            priority,
            message,
            attachments,
            relatedOrder,
            relatedProduct,
            relatedWarranty
        } = req.body;
        
        if (!subject || !category || !message) {
            return res.status(400).json({ 
                message: 'Subject, category, and message are required' 
            });
        }
        
        const ticket = new SupportTicket({
            user: req.user.id,
            subject,
            category,
            priority: priority || 'medium',
            relatedOrder,
            relatedProduct,
            relatedWarranty,
            messages: [{
                sender: req.user.id,
                senderRole: 'customer',
                message,
                attachments: attachments || [],
                sentAt: new Date()
            }]
        });
        
        await ticket.save();
        
        // Notify support team (you can implement this based on your system)
        // For now, just log it
        console.log(`New support ticket created: ${ticket.ticketNumber}`);
        
        res.status(201).json({
            message: 'Support ticket created successfully',
            ticket
        });
    } catch (error) {
        console.error('Create ticket error:', error);
        res.status(500).json({ error: error.message });
    }
};

// Add message to ticket
exports.addMessage = async (req, res) => {
    try {
        const { ticketId } = req.params;
        const { message, attachments } = req.body;
        
        if (!message) {
            return res.status(400).json({ message: 'Message is required' });
        }
        
        const ticket = await SupportTicket.findOne({
            _id: ticketId,
            user: req.user.id
        });
        
        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }
        
        if (ticket.status === 'closed' || ticket.status === 'cancelled') {
            return res.status(400).json({ 
                message: 'Cannot add message to closed or cancelled ticket' 
            });
        }
        
        await ticket.addMessage(
            req.user.id,
            'customer',
            message,
            attachments || []
        );
        
        // If ticket was waiting_customer, change to in_progress
        if (ticket.status === 'waiting_customer') {
            ticket.status = 'in_progress';
            await ticket.save();
        }
        
        // Notify assigned agent
        if (ticket.assignedTo) {
            await Notification.createNotification({
                user: ticket.assignedTo,
                type: 'ticket_replied',
                title: 'Khách hàng đã trả lời',
                message: `Ticket #${ticket.ticketNumber}: ${ticket.subject}`,
                relatedTicket: ticket._id,
                actionUrl: `/admin/tickets/${ticket._id}`,
                actionText: 'Xem ticket',
                priority: 'high'
            });
        }
        
        res.json({
            message: 'Message added successfully',
            ticket: await ticket.populate('messages.sender', 'username')
        });
    } catch (error) {
        console.error('Add message error:', error);
        res.status(500).json({ error: error.message });
    }
};

// Close ticket
exports.closeTicket = async (req, res) => {
    try {
        const { ticketId } = req.params;
        
        const ticket = await SupportTicket.findOne({
            _id: ticketId,
            user: req.user.id
        });
        
        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }
        
        if (ticket.status === 'closed') {
            return res.status(400).json({ message: 'Ticket is already closed' });
        }
        
        ticket.status = 'closed';
        await ticket.save();
        
        res.json({
            message: 'Ticket closed successfully',
            ticket
        });
    } catch (error) {
        console.error('Close ticket error:', error);
        res.status(500).json({ error: error.message });
    }
};

// Reopen ticket
exports.reopenTicket = async (req, res) => {
    try {
        const { ticketId } = req.params;
        const { message } = req.body;
        
        const ticket = await SupportTicket.findOne({
            _id: ticketId,
            user: req.user.id
        });
        
        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }
        
        if (ticket.status !== 'closed' && ticket.status !== 'resolved') {
            return res.status(400).json({ message: 'Only closed or resolved tickets can be reopened' });
        }
        
        await ticket.reopen();
        
        if (message) {
            await ticket.addMessage(req.user.id, 'customer', message);
        }
        
        res.json({
            message: 'Ticket reopened successfully',
            ticket
        });
    } catch (error) {
        console.error('Reopen ticket error:', error);
        res.status(500).json({ error: error.message });
    }
};

// Submit feedback
exports.submitFeedback = async (req, res) => {
    try {
        const { ticketId } = req.params;
        const { rating, comment } = req.body;
        
        if (!rating) {
            return res.status(400).json({ message: 'Rating is required' });
        }
        
        const ticket = await SupportTicket.findOne({
            _id: ticketId,
            user: req.user.id
        });
        
        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }
        
        if (ticket.status !== 'resolved' && ticket.status !== 'closed') {
            return res.status(400).json({ 
                message: 'Can only rate resolved or closed tickets' 
            });
        }
        
        ticket.feedback = {
            rating,
            comment: comment || '',
            submittedAt: new Date()
        };
        
        await ticket.save();
        
        res.json({
            message: 'Feedback submitted successfully',
            ticket
        });
    } catch (error) {
        console.error('Submit feedback error:', error);
        res.status(500).json({ error: error.message });
    }
};

// ==================== ADMIN/AGENT TICKET MANAGEMENT ====================

// Get all tickets (Admin/Agent)
exports.getAllTickets = async (req, res) => {
    try {
        const { status, category, priority, assignedTo, page = 1, limit = 20 } = req.query;
        
        const filter = {};
        if (status) filter.status = status;
        if (category) filter.category = category;
        if (priority) filter.priority = priority;
        if (assignedTo) filter.assignedTo = assignedTo;
        
        const skip = (parseInt(page) - 1) * parseInt(limit);
        
        const tickets = await SupportTicket.find(filter)
            .populate('user', 'username email')
            .populate('assignedTo', 'username')
            .sort({ priority: -1, createdAt: 1 })
            .skip(skip)
            .limit(parseInt(limit));
        
        const total = await SupportTicket.countDocuments(filter);
        
        // Get stats
        const stats = {
            open: await SupportTicket.countDocuments({ status: 'open' }),
            inProgress: await SupportTicket.countDocuments({ status: 'in_progress' }),
            waitingCustomer: await SupportTicket.countDocuments({ status: 'waiting_customer' }),
            resolved: await SupportTicket.countDocuments({ status: 'resolved' }),
            unassigned: await SupportTicket.countDocuments({ status: 'open', assignedTo: null })
        };
        
        res.json({
            tickets,
            stats,
            currentPage: parseInt(page),
            totalPages: Math.ceil(total / parseInt(limit)),
            total
        });
    } catch (error) {
        console.error('Get all tickets error:', error);
        res.status(500).json({ error: error.message });
    }
};

// Assign ticket to agent (Admin)
exports.assignTicket = async (req, res) => {
    try {
        const { ticketId } = req.params;
        const { agentId } = req.body;
        
        const ticket = await SupportTicket.findById(ticketId);
        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }
        
        await ticket.assignToAgent(agentId || req.user.id);
        
        // Notify agent
        await Notification.createNotification({
            user: ticket.assignedTo,
            type: 'ticket_replied',
            title: 'Ticket mới được giao',
            message: `Ticket #${ticket.ticketNumber}: ${ticket.subject}`,
            relatedTicket: ticket._id,
            actionUrl: `/admin/tickets/${ticket._id}`,
            actionText: 'Xem ticket',
            priority: 'high'
        });
        
        res.json({
            message: 'Ticket assigned successfully',
            ticket
        });
    } catch (error) {
        console.error('Assign ticket error:', error);
        res.status(500).json({ error: error.message });
    }
};

// Reply to ticket (Agent)
exports.replyToTicket = async (req, res) => {
    try {
        const { ticketId } = req.params;
        const { message, attachments, isInternal } = req.body;
        
        if (!message) {
            return res.status(400).json({ message: 'Message is required' });
        }
        
        const ticket = await SupportTicket.findById(ticketId);
        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }
        
        ticket.messages.push({
            sender: req.user.id,
            senderRole: 'support_agent',
            message,
            attachments: attachments || [],
            isInternal: isInternal || false,
            sentAt: new Date()
        });
        
        // Set first response time if not set
        if (!ticket.firstResponseTime) {
            ticket.firstResponseTime = new Date();
        }
        
        // Update status
        if (ticket.status === 'open') {
            ticket.status = 'in_progress';
        }
        
        await ticket.save();
        
        // Notify customer (if not internal)
        if (!isInternal) {
            await Notification.createNotification({
                user: ticket.user,
                type: 'ticket_replied',
                title: 'Hỗ trợ đã trả lời',
                message: `Ticket #${ticket.ticketNumber} có câu trả lời mới`,
                relatedTicket: ticket._id,
                actionUrl: `/profile/support/${ticket._id}`,
                actionText: 'Xem ticket',
                priority: 'high'
            });
        }
        
        res.json({
            message: 'Reply added successfully',
            ticket
        });
    } catch (error) {
        console.error('Reply to ticket error:', error);
        res.status(500).json({ error: error.message });
    }
};

// Resolve ticket (Agent)
exports.resolveTicket = async (req, res) => {
    try {
        const { ticketId } = req.params;
        const { resolutionNotes, resolutionType } = req.body;
        
        const ticket = await SupportTicket.findById(ticketId);
        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }
        
        await ticket.resolve(
            req.user.id,
            resolutionNotes || '',
            resolutionType || 'solved'
        );
        
        // Notify customer
        await Notification.createNotification({
            user: ticket.user,
            type: 'ticket_resolved',
            title: 'Yêu cầu hỗ trợ đã được giải quyết',
            message: `Ticket #${ticket.ticketNumber} đã được giải quyết`,
            relatedTicket: ticket._id,
            actionUrl: `/profile/support/${ticket._id}`,
            actionText: 'Xem & đánh giá',
            priority: 'medium'
        });
        
        res.json({
            message: 'Ticket resolved successfully',
            ticket
        });
    } catch (error) {
        console.error('Resolve ticket error:', error);
        res.status(500).json({ error: error.message });
    }
};

// Update ticket priority (Admin)
exports.updateTicketPriority = async (req, res) => {
    try {
        const { ticketId } = req.params;
        const { priority } = req.body;
        
        const ticket = await SupportTicket.findByIdAndUpdate(
            ticketId,
            { priority },
            { new: true }
        );
        
        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }
        
        res.json({
            message: 'Priority updated successfully',
            ticket
        });
    } catch (error) {
        console.error('Update priority error:', error);
        res.status(500).json({ error: error.message });
    }
};

// Add internal note (Agent)
exports.addInternalNote = async (req, res) => {
    try {
        const { ticketId } = req.params;
        const { note } = req.body;
        
        const ticket = await SupportTicket.findById(ticketId);
        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }
        
        ticket.internalNotes.push({
            note,
            addedBy: req.user.id,
            addedAt: new Date()
        });
        
        await ticket.save();
        
        res.json({
            message: 'Internal note added successfully',
            ticket
        });
    } catch (error) {
        console.error('Add internal note error:', error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = exports;
