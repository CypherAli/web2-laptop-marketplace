const io = require('socket.io-client');
const mongoose = require('mongoose');
require('dotenv').config({ path: './server/.env' });

const CLIENT_ID = '690da4cc4e71466dd1734ec4'; // client@laptop.com
const PARTNER_ID = '6915b19c35c0c9aa46d94fc2'; // support@techstore.vn

console.log('🧪 Testing Chat System...\n');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI).then(async () => {
    console.log('✅ Connected to MongoDB');
    
    const Chat = require('./server/models/Chat');
    const User = require('./server/models/User');
    
    // Verify users
    const client = await User.findById(CLIENT_ID);
    const partner = await User.findById(PARTNER_ID);
    
    console.log('\n📋 User Info:');
    console.log('Client:', client.email, '- ID:', CLIENT_ID);
    console.log('Partner:', partner.email, '- ID:', PARTNER_ID, '- Shop:', partner.shopName);
    
    // Test Socket.IO connections
    console.log('\n🔌 Testing Socket.IO...');
    
    const clientSocket = io('http://localhost:5000');
    const partnerSocket = io('http://localhost:5000');
    
    clientSocket.on('connect', () => {
        console.log('✅ Client socket connected');
        clientSocket.emit('user:join', CLIENT_ID);
    });
    
    partnerSocket.on('connect', () => {
        console.log('✅ Partner socket connected');
        partnerSocket.emit('partner:join', PARTNER_ID);
        
        // Wait a bit then send test message
        setTimeout(() => {
            console.log('\n📤 Sending test message from client to partner...');
            
            const testMessage = {
                _id: `test_${Date.now()}`,
                senderId: CLIENT_ID,
                senderName: client.name || client.username,
                receiverId: PARTNER_ID,
                receiverName: partner.shopName,
                message: 'Test message from debug script',
                timestamp: new Date()
            };
            
            clientSocket.emit('chat:send', testMessage);
        }, 2000);
    });
    
    partnerSocket.on('chat:message', (message) => {
        console.log('\n✅ Partner received message!');
        console.log('   From:', message.senderName);
        console.log('   Message:', message.message);
        console.log('   Saved ID:', message._id);
        
        setTimeout(() => {
            console.log('\n✅ Test completed successfully!');
            process.exit(0);
        }, 1000);
    });
    
    clientSocket.on('chat:message', (message) => {
        console.log('📩 Client received message echo');
    });
    
    setTimeout(() => {
        console.log('\n❌ Test timeout - partner did not receive message');
        console.log('Check server logs for errors');
        process.exit(1);
    }, 10000);
    
}).catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
});
