// Seed products for laptop marketplace
require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');
const User = require('./models/User');

const seedProducts = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        await Product.deleteMany({});
        console.log('Cleared existing products');

        const partner1 = await User.findOne({ email: 'partner1@laptop.com' });
        const partner2 = await User.findOne({ email: 'partner2@laptop.com' });

        if (!partner1 || !partner2) {
            console.log('Please run createUsers.js first');
            process.exit(1);
        }

        const products = [
            { name: "Dell XPS 13", description: "13.4 FHD+, i7-1260P, 16GB, 512GB SSD", price: 42990000, stock: 8, brand: "Dell", imageUrl: "https://via.placeholder.com/300x200/007DB8/FFFFFF?text=Dell", createdBy: partner1._id },
            { name: "HP Pavilion 15", description: "15.6 FHD, i5-1235U, 8GB, 512GB SSD", price: 16990000, stock: 18, brand: "HP", imageUrl: "https://via.placeholder.com/300x200/0096D6/FFFFFF?text=HP", createdBy: partner1._id },
            { name: "Lenovo ThinkPad T14", description: "14 FHD, i5-1235U, 16GB, 512GB SSD", price: 26990000, stock: 15, brand: "Lenovo", imageUrl: "https://via.placeholder.com/300x200/E2231A/FFFFFF?text=Lenovo", createdBy: partner2._id },
            { name: "ASUS ROG Strix G15", description: "15.6 FHD 144Hz, Ryzen 7, RTX 3060", price: 32990000, stock: 12, brand: "ASUS", imageUrl: "https://via.placeholder.com/300x200/FF6B00/FFFFFF?text=ASUS", createdBy: partner2._id },
            { name: "MacBook Air M2", description: "13.6 Liquid Retina, M2, 8GB, 256GB", price: 28990000, stock: 15, brand: "Apple", imageUrl: "https://via.placeholder.com/300x200/000000/FFFFFF?text=Apple", createdBy: partner1._id }
        ];

        await Product.insertMany(products);
        console.log(`Added ${products.length} products`);
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

seedProducts();
