/**
 * Create Admin User Script
 * Tạo tài khoản Admin mặc định cho hệ thống
 * 
 * Run: node server/createAdminUser.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const ADMIN_CREDENTIALS = {
    username: 'admin',
    email: 'admin@laptop.com',
    password: '123456',
    role: 'admin',
    isApproved: true,
    isActive: true
};

const createAdminUser = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/laptop-marketplace');
        console.log('✅ Connected to MongoDB');

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: ADMIN_CREDENTIALS.email });
        
        if (existingAdmin) {
            console.log('⚠️  Admin user already exists!');
            console.log('Email:', existingAdmin.email);
            console.log('Username:', existingAdmin.username);
            console.log('Role:', existingAdmin.role);
            
            // Ask if want to reset password
            const readline = require('readline').createInterface({
                input: process.stdin,
                output: process.stdout
            });
            
            readline.question('Do you want to reset password to "123456"? (y/n): ', async (answer) => {
                if (answer.toLowerCase() === 'y') {
                    existingAdmin.password = '123456';
                    await existingAdmin.save();
                    console.log('✅ Password reset successfully!');
                }
                readline.close();
                mongoose.connection.close();
            });
            return;
        }

        // Create new admin user
        const admin = new User(ADMIN_CREDENTIALS);
        await admin.save();

        console.log('✅ Admin user created successfully!');
        console.log('-----------------------------------');
        console.log('Email:', ADMIN_CREDENTIALS.email);
        console.log('Password:', ADMIN_CREDENTIALS.password);
        console.log('Role:', ADMIN_CREDENTIALS.role);
        console.log('-----------------------------------');
        console.log('⚠️  Please change the password after first login!');

        mongoose.connection.close();
    } catch (error) {
        console.error('❌ Error creating admin user:', error.message);
        mongoose.connection.close();
        process.exit(1);
    }
};

// Run the script
createAdminUser();
