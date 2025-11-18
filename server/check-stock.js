const mongoose = require('mongoose');
const Product = require('./models/Product');

const checkStock = async () => {
    try {
        require('dotenv').config();
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/laptop-db');
        
        const products = await Product.find().select('name stock').sort({ createdAt: -1 });
        
        console.log('=== STOCK STATUS ===');
        console.log(`Total products: ${products.length}\n`);
        
        products.forEach(p => {
            console.log(`${p.name}: stock = ${p.stock}`);
        });
        
        console.log('\n=== SUMMARY ===');
        const outOfStock = products.filter(p => !p.stock || p.stock <= 0);
        console.log(`Products with stock <= 0: ${outOfStock.length}`);
        
        const stocks = products.map(p => p.stock || 0);
        console.log(`Stock range: ${Math.min(...stocks)} - ${Math.max(...stocks)}`);
        
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

checkStock();
