const mongoose = require('mongoose');

const ConversationSchema = new mongoose.Schema({
    participants: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: false  // Not required for anonymous users
        },
        role: {
            type: String,
            enum: ['client', 'partner', 'admin', 'anonymous'],
            required: true
        },
        // For anonymous users
        anonymousId: {
            type: String,
            required: false
        },
        anonymousName: {
            type: String,
            required: false
        }
    }],
    
    // Type of conversation
    type: {
        type: String,
        enum: ['user_admin', 'partner_admin', 'user_partner', 'anonymous_partner'],
        required: true
    },
    
    // Last message details
    lastMessage: {
        text: String,
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        timestamp: Date
    },
    
    // Status
    status: {
        type: String,
        enum: ['active', 'archived', 'closed'],
        default: 'active'
    },
    
    // Unread count per participant
    unreadCount: {
        type: Map,
        of: Number,
        default: {}
    },
    
    // Priority for admin (urgent issues)
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
    },
    
    // Subject/Topic
    subject: {
        type: String,
        maxlength: 200
    },
    
    // Assigned admin (if any)
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, { 
    timestamps: true 
});

// Indexes
ConversationSchema.index({ 'participants.user': 1 });
ConversationSchema.index({ status: 1 });
ConversationSchema.index({ 'lastMessage.timestamp': -1 });

// Methods
ConversationSchema.methods.markAsRead = function(userId) {
    if (this.unreadCount.has(userId.toString())) {
        this.unreadCount.set(userId.toString(), 0);
    }
    return this.save();
};

ConversationSchema.methods.incrementUnread = function(userId) {
    const userIdStr = userId.toString();
    const current = this.unreadCount.get(userIdStr) || 0;
    this.unreadCount.set(userIdStr, current + 1);
    return this.save();
};

module.exports = mongoose.model('Conversation', ConversationSchema);
