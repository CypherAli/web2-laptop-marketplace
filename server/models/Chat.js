const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    // Sender information
    senderId: {
        type: String,
        required: true,
        index: true
    },
    senderName: {
        type: String,
        required: true
    },
    senderType: {
        type: String,
        enum: ['user', 'partner'],
        required: false // Will be set in pre-save
    },
    
    // Receiver information  
    receiverId: {
        type: String,
        required: true,
        index: true
    },
    receiverName: {
        type: String,
        required: true
    },
    receiverType: {
        type: String,
        enum: ['user', 'partner'],
        required: false // Will be set in pre-save
    },
    
    // Message content
    message: {
        type: String,
        required: true,
        trim: true,
        maxlength: 2000
    },
    
    // Message metadata
    messageType: {
        type: String,
        enum: ['text', 'image', 'file'],
        default: 'text'
    },
    
    // Chat room identifier (combination of both user IDs)
    chatRoomId: {
        type: String,
        required: false, // Will be generated in pre-save
        index: true
    },
    
    // Message status
    status: {
        type: String,
        enum: ['sent', 'delivered', 'read'],
        default: 'sent'
    },
    
    // Read timestamp
    readAt: {
        type: Date,
        default: null
    },
    
    // Reply to another message
    replyTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chat',
        default: null
    },
    
    // Message reactions
    reactions: [{
        userId: String,
        type: {
            type: String,
            enum: ['like', 'love', 'laugh', 'angry', 'sad']
        },
        timestamp: {
            type: Date,
            default: Date.now
        }
    }],
    
    // Soft delete
    isDeleted: {
        type: Boolean,
        default: false
    },
    
    deletedAt: {
        type: Date,
        default: null
    }
}, {
    timestamps: true
});

// Indexes for better query performance
chatSchema.index({ chatRoomId: 1, createdAt: -1 });
chatSchema.index({ senderId: 1, receiverId: 1 });
chatSchema.index({ createdAt: -1 });
chatSchema.index({ status: 1 });

// Pre-save middleware to generate chatRoomId
chatSchema.pre('save', function(next) {
    if (!this.chatRoomId) {
        // Create unique chat room ID by sorting user IDs
        const ids = [this.senderId, this.receiverId].sort();
        this.chatRoomId = `${ids[0]}_${ids[1]}`;
    }
    
    // Set senderType and receiverType based on ID patterns
    if (this.senderId.startsWith('user_')) {
        this.senderType = 'user';
    } else {
        this.senderType = 'partner';
    }
    
    if (this.receiverId.startsWith('user_')) {
        this.receiverType = 'user';
    } else {
        this.receiverType = 'partner';
    }
    
    next();
});

// Static methods for common queries
chatSchema.statics.getChatHistory = function(userId1, userId2, limit = 50, page = 1) {
    const ids = [userId1, userId2].sort();
    const chatRoomId = `${ids[0]}_${ids[1]}`;
    
    return this.find({
        chatRoomId,
        isDeleted: false
    })
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip((page - 1) * limit)
    .populate('replyTo', 'message senderName')
    .exec();
};

chatSchema.statics.getUnreadCount = function(userId) {
    return this.countDocuments({
        receiverId: userId,
        status: { $ne: 'read' },
        isDeleted: false
    });
};

chatSchema.statics.markAsRead = function(chatRoomId, userId) {
    return this.updateMany({
        chatRoomId,
        receiverId: userId,
        status: { $ne: 'read' },
        isDeleted: false
    }, {
        $set: {
            status: 'read',
            readAt: new Date()
        }
    });
};

chatSchema.statics.getRecentChats = function(userId, limit = 20) {
    return this.aggregate([
        {
            $match: {
                $or: [
                    { senderId: userId },
                    { receiverId: userId }
                ],
                isDeleted: false
            }
        },
        {
            $sort: { createdAt: -1 }
        },
        {
            $group: {
                _id: '$chatRoomId',
                lastMessage: { $first: '$$ROOT' },
                unreadCount: {
                    $sum: {
                        $cond: [
                            {
                                $and: [
                                    { $eq: ['$receiverId', userId] },
                                    { $ne: ['$status', 'read'] }
                                ]
                            },
                            1,
                            0
                        ]
                    }
                }
            }
        },
        {
            $sort: { 'lastMessage.createdAt': -1 }
        },
        {
            $limit: limit
        }
    ]);
};

// Instance methods
chatSchema.methods.markAsDeleted = function() {
    this.isDeleted = true;
    this.deletedAt = new Date();
    return this.save();
};

chatSchema.methods.addReaction = function(userId, reactionType) {
    // Remove existing reaction from this user
    this.reactions = this.reactions.filter(r => r.userId !== userId);
    
    // Add new reaction
    this.reactions.push({
        userId,
        type: reactionType,
        timestamp: new Date()
    });
    
    return this.save();
};

chatSchema.methods.removeReaction = function(userId) {
    this.reactions = this.reactions.filter(r => r.userId !== userId);
    return this.save();
};

// Virtual for getting other participant in chat
chatSchema.virtual('otherParticipant').get(function() {
    // This would need the current user context to determine which is the "other"
    return null;
});

// JSON transformation
chatSchema.set('toJSON', {
    transform: function(doc, ret) {
        delete ret.__v;
        delete ret.isDeleted;
        delete ret.deletedAt;
        return ret;
    }
});

module.exports = mongoose.model('Chat', chatSchema);