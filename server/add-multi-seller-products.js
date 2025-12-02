require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

const verifyLogin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB\n');

        const Order = require('./models/Order');
        
        // Check for pending orders
        console.log('🔍 Checking orders status...\n');
        
        const pendingOrders = await Order.find({ status: 'pending' });
        
        if (pendingOrders.length > 0) {
            console.log('📦 Found', pendingOrders.length, 'pending orders. Auto-confirming...\n');
            
            for (const order of pendingOrders) {
                order.status = 'confirmed';
                
                // Update all items to confirmed
                order.items.forEach(item => {
                    if (item.status === 'pending') {
                        item.status = 'confirmed';
                    }
                });
                
                await order.save();
                console.log('✅ Confirmed order:', order.orderNumber);
            }
            
            console.log('\n✅ Auto-confirmed', pendingOrders.length, 'orders');
        } else {
            console.log('✅ No pending orders found. All orders are auto-confirmed on creation.\n');
        }
        
        // Show order statistics
        const statuses = await Order.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);
        
        console.log('📊 Order Status Summary:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        statuses.forEach(s => {
            console.log(`${s._id}: ${s.count} orders`);
        });
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        
        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

verifyLogin();
