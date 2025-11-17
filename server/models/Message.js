const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    conversation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Conversation',
        required: true
    },
    
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    
    senderRole: {
        type: String,
        enum: ['client', 'partner', 'admin'],
        required: true
    },
    
    // Message content
    message: {
        type: String,
        required: true,
        maxlength: 5000
    },
    
    // Message type
    messageType: {
        type: String,
        enum: ['text', 'image', 'file', 'system'],
        default: 'text'
    },
    
    // Attachments (images/files)
    attachments: [{
        type: {
            type: String,
            enum: ['image', 'file']
        },
        url: String,
        filename: String,
        size: Number
    }],
    
    // Read status
    readBy: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        readAt: {
            type: Date,
            default: Date.now
        }
    }],
    
    // If this is a reply to another message
    replyTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message'
    },
    
    // Edited
    isEdited: {
        type: Boolean,
        default: false
    },
    editedAt: Date,
    
    // Deleted (soft delete)
    isDeleted: {
        type: Boolean,
        default: false
    },
    deletedAt: Date
}, { 
    timestamps: true 
});

// Indexes
MessageSchema.index({ conversation: 1, createdAt: -1 });
MessageSchema.index({ sender: 1 });

// Methods
MessageSchema.methods.markAsRead = function(userId) {
    const alreadyRead = this.readBy.some(r => r.user.equals(userId));
    if (!alreadyRead) {
        this.readBy.push({ user: userId, readAt: new Date() });
        return this.save();
    }
    return Promise.resolve(this);
};

MessageSchema.methods.softDelete = function() {
    this.isDeleted = true;
    this.deletedAt = new Date();
    return this.save();
};

module.exports = mongoose.model('Message', MessageSchema);
