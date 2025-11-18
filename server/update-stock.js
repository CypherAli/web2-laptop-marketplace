const mongoose = require('mongoose');
const Product = require('./models/Product');

const updateStock = async () => {
    try {
        require('dotenv').config();
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/laptop-db');
        
        console.log('🔍 Checking products with low stock...');
        
        // Tìm tất cả sản phẩm có stock <= 5
        const lowStockProducts = await Product.find({ 
            $or: [
                { stock: { $lte: 5 } },
                { stock: null },
                { stock: undefined }
            ]
        });
        
        console.log(`Found ${lowStockProducts.length} products with low/no stock`);
        
        if (lowStockProducts.length > 0) {
            console.log('\n📦 Updating stock to reasonable levels...');
            
            for (const product of lowStockProducts) {
                // Random stock từ 10-50
                const newStock = Math.floor(Math.random() * 41) + 10;
                await Product.findByIdAndUpdate(product._id, { stock: newStock });
                console.log(`✅ ${product.name}: ${product.stock || 0} → ${newStock}`);
            }
        }
        
        // Kiểm tra kết quả
        const allProducts = await Product.find().select('name stock');
        console.log('\n=== FINAL STOCK STATUS ===');
        console.log(`Total products: ${allProducts.length}`);
        console.log(`Products with stock > 0: ${allProducts.filter(p => p.stock > 0).length}`);
        console.log(`Products with stock = 0: ${allProducts.filter(p => p.stock === 0).length}`);
        
        const minStock = Math.min(...allProducts.map(p => p.stock || 0));
        const maxStock = Math.max(...allProducts.map(p => p.stock || 0));
        console.log(`Stock range: ${minStock} - ${maxStock}`);
        
        console.log('\n✨ Stock update completed!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

updateStock();
