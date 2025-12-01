const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
            socketTimeoutMS: 45000,
        });
        console.log('✅ MongoDB Connected Successfully');
    } catch (err) {
        console.error('❌ MongoDB connection error:', err.message);
        console.error('Retrying in 5 seconds...');
        setTimeout(connectDB, 5000); // Retry after 5s instead of crashing
    }
};

module.exports = connectDB;