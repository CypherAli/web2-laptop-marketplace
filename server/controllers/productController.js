const Product = require('../models/Product');

// (Public) Lấy tất cả sản phẩm VỚI BỘ LỌC
exports.getAllProducts = async (req, res) => {
    try {
        const { page = 1, limit = 10, minPrice, maxPrice, brand, inStock, sortBy, search, ram, processor } = req.query;

        // 1. Xây dựng đối tượng Filter
        const filter = {}; // Show all products (remove isActive filter for now)
        const andConditions = []; // Array to hold $and conditions
        
        // Search filter (by name or description)
        if (search) {
            andConditions.push({
                $or: [
                    { name: { $regex: search, $options: 'i' } },
                    { description: { $regex: search, $options: 'i' } }
                ]
            });
        }
        
        // Price range filter
        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = Number(minPrice);
            if (maxPrice) filter.price.$lte = Number(maxPrice);
        }
        
        // Brand filter - Multiple brands with OR logic
        if (brand) {
            const brands = brand.split(',').map(b => b.trim()).filter(b => b);
            if (brands.length > 0) {
                filter.brand = { $in: brands };
            }
        }

        // RAM filter - Multiple RAMs with OR logic (exact match for RAM size)
        if (ram) {
            const rams = ram.split(',').map(r => r.trim()).filter(r => r);
            if (rams.length > 0) {
                andConditions.push({
                    $or: rams.map(r => {
                        // Use word boundary \b to match exact RAM size
                        // "4GB" will match "4GB DDR4" or "4GB DDR5" but NOT "64GB DDR4"
                        // "8GB" will match "8GB DDR5" but NOT "128GB" or "16GB"
                        // \b ensures we match word boundaries
                        const regexPattern = `\\b${r}\\b`;
                        return {
                            'specifications.ram': { $regex: regexPattern, $options: 'i' }
                        };
                    })
                });
            }
        }

        // Processor filter - Multiple processors with OR logic
        if (processor) {
            const processors = processor.split(',').map(p => p.trim()).filter(p => p);
            if (processors.length > 0) {
                andConditions.push({
                    $or: processors.map(p => {
                        // For processor, use partial match since names can be long
                        // "Intel Core i5" should match "Intel Core i5-1245U"
                        // But we can make it more precise by checking the exact series
                        return {
                            'specifications.processor': { $regex: p, $options: 'i' }
                        };
                    })
                });
            }
        }
        
        // Stock filter
        if (inStock === 'true') {
            filter.stock = { $gt: 0 };
        } else if (inStock === 'false') {
            filter.stock = 0;
        }

        // Combine all $and conditions if any exist
        if (andConditions.length > 0) {
            filter.$and = andConditions;
        }

        // 2. Xây dựng đối tượng Sort
        const sort = {};
        if (sortBy === 'price_asc') {
            sort.price = 1;
        } else if (sortBy === 'price_desc') {
            sort.price = -1;
        } else if (sortBy === 'popular') {
            sort.soldCount = -1;
        } else {
            sort.createdAt = -1;
        }

        // 3. Tính toán Phân trang
        const pageNum = Number(page);
        const limitNum = Number(limit);
        const skip = (pageNum - 1) * limitNum;

        // 4. Lấy sản phẩm và tổng số lượng
        const products = await Product.find(filter)
            .populate('createdBy', 'username shopName')
            .sort(sort)
            .skip(skip)
            .limit(limitNum);
            
        const totalProducts = await Product.countDocuments(filter);
        const totalPages = Math.ceil(totalProducts / limitNum);

        res.json({
            products,
            currentPage: pageNum,
            totalPages,
            totalProducts
        });
        
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// (Public) Lấy 1 sản phẩm
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
            .populate('createdBy', 'username shopName shopDescription');
        if (!product) return res.status(404).json({ message: "Product not found" });
        res.json(product);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// (Partner/Admin) Tạo sản phẩm - MUST assign createdBy
exports.createProduct = async (req, res) => {
    try {
        const productData = {
            ...req.body,
            createdBy: req.user.id // Assign the authenticated user as creator
        };
        
        const product = new Product(productData);
        await product.save();
        
        res.status(201).json(product);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// (Partner/Admin) Cập nhật sản phẩm - Ownership checked by isOwner middleware
exports.updateProduct = async (req, res) => {
    try {
        // Remove fields that shouldn't be updated
        delete req.body.createdBy;
        delete req.body.soldCount;
        
        const product = await Product.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true, runValidators: true }
        ).populate('createdBy', 'username shopName');
        
        if (!product) return res.status(404).json({ message: "Product not found" });
        res.json(product);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// (Partner/Admin) Xóa sản phẩm - Ownership checked by isOwner middleware
exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) return res.status(404).json({ message: "Product not found" });
        res.json({ message: "Product deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// (Public) Lấy danh sách tất cả brands
exports.getAllBrands = async (req, res) => {
    try {
        const brands = await Product.distinct('brand');
        res.json(brands.sort()); // Return sorted array of unique brands
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};