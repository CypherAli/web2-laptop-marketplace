require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/Product');
const User = require('../models/User');

const fixProductsCreatedBy = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // Find products without createdBy
        const productsWithoutCreator = await Product.find({
            $or: [
                { createdBy: null },
                { createdBy: { $exists: false } }
            ]
        });

        console.log(`Found ${productsWithoutCreator.length} products without createdBy field`);

        if (productsWithoutCreator.length === 0) {
            console.log('✅ All products have createdBy field');
            process.exit(0);
        }

        // Find first partner or admin user to assign
        let defaultUser = await User.findOne({ role: 'partner' });
        
        if (!defaultUser) {
            defaultUser = await User.findOne({ role: 'admin' });
        }

        if (!defaultUser) {
            console.error('❌ No partner or admin user found to assign products to');
            console.log('Creating a default partner user...');
            
            const bcrypt = require('bcryptjs');
            const defaultPassword = await bcrypt.hash('DefaultPartner123!', 10);
            
            defaultUser = await User.create({
                username: 'default-partner',
                email: 'default-partner@marketplace.com',
                password: defaultPassword,
                role: 'partner',
                shopName: 'Default Shop',
                isActive: true
            });
            
            console.log('✅ Created default partner user');
        }

        console.log(`Assigning products to user: ${defaultUser.username} (${defaultUser.shopName || defaultUser.role})`);

        // Update all products without createdBy
        const result = await Product.updateMany(
            {
                $or: [
                    { createdBy: null },
                    { createdBy: { $exists: false } }
                ]
            },
            {
                $set: { createdBy: defaultUser._id }
            }
        );

        console.log(`✅ Updated ${result.modifiedCount} products with createdBy field`);

        // Verify
        const remainingProducts = await Product.countDocuments({
            $or: [
                { createdBy: null },
                { createdBy: { $exists: false } }
            ]
        });

        if (remainingProducts === 0) {
            console.log('✅ All products now have createdBy field');
        } else {
            console.log(`⚠️ Warning: ${remainingProducts} products still missing createdBy`);
        }

        process.exit(0);
    } catch (error) {
        console.error('❌ Error fixing products:', error);
        process.exit(1);
    }
};

fixProductsCreatedBy();
