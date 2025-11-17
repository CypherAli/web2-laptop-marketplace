const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { protect } = require('../middleware/authMiddleware');

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        console.log('🛒 GET /api/cart - User:', req.user._id);
        let cart = await Cart.findOne({ user: req.user._id })
            .populate('items.product', 'name price imageUrl brand model specifications stock');
        
        if (!cart) {
            cart = await Cart.create({ user: req.user._id, items: [] });
        }

        res.json(cart);
    } catch (error) {
        console.error('Get cart error:', error);
        res.status(500).json({ message: 'Lỗi khi lấy giỏ hàng', error: error.message });
    }
});

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
router.post('/', protect, async (req, res) => {
    try {
        const { productId, quantity = 1 } = req.body;
        console.log('🛒 POST /api/cart - User:', req.user._id, 'Product:', productId, 'Qty:', quantity);

        if (!productId) {
            return res.status(400).json({ message: 'Product ID is required' });
        }

        // Check if product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
        }

        // Check stock
        if (product.stock < quantity) {
            return res.status(400).json({ message: 'Sản phẩm không đủ số lượng trong kho' });
        }

        let cart = await Cart.findOne({ user: req.user._id });

        if (!cart) {
            // Create new cart
            cart = new Cart({
                user: req.user._id,
                items: [{
                    product: productId,
                    quantity,
                    price: product.price
                }]
            });
        } else {
            // Check if item already exists in cart
            const itemIndex = cart.items.findIndex(
                item => item.product.toString() === productId
            );

            if (itemIndex > -1) {
                // Update quantity
                const newQuantity = cart.items[itemIndex].quantity + quantity;
                
                if (product.stock < newQuantity) {
                    return res.status(400).json({ message: 'Sản phẩm không đủ số lượng trong kho' });
                }
                
                cart.items[itemIndex].quantity = newQuantity;
                cart.items[itemIndex].price = product.price; // Update price
            } else {
                // Add new item
                cart.items.push({
                    product: productId,
                    quantity,
                    price: product.price
                });
            }
        }

        cart.updatedAt = Date.now();
        await cart.save();
        
        // Populate and return
        cart = await Cart.findById(cart._id)
            .populate('items.product', 'name price imageUrl brand model specifications stock');

        res.json(cart);
    } catch (error) {
        console.error('Add to cart error:', error);
        res.status(500).json({ message: 'Lỗi khi thêm vào giỏ hàng', error: error.message });
    }
});

// @desc    Update cart item quantity
// @route   PUT /api/cart/:itemId
// @access  Private
router.put('/:itemId', protect, async (req, res) => {
    try {
        const { quantity } = req.body;
        const { itemId } = req.params;

        if (!quantity || quantity < 1) {
            return res.status(400).json({ message: 'Số lượng không hợp lệ' });
        }

        const cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            return res.status(404).json({ message: 'Không tìm thấy giỏ hàng' });
        }

        const item = cart.items.id(itemId);
        if (!item) {
            return res.status(404).json({ message: 'Không tìm thấy sản phẩm trong giỏ hàng' });
        }

        // Check stock
        const product = await Product.findById(item.product);
        if (!product) {
            return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
        }

        if (product.stock < quantity) {
            return res.status(400).json({ message: 'Sản phẩm không đủ số lượng trong kho' });
        }

        item.quantity = quantity;
        item.price = product.price; // Update price
        cart.updatedAt = Date.now();
        
        await cart.save();
        
        // Populate and return
        const updatedCart = await Cart.findById(cart._id)
            .populate('items.product', 'name price imageUrl brand model specifications stock');

        res.json(updatedCart);
    } catch (error) {
        console.error('Update cart error:', error);
        res.status(500).json({ message: 'Lỗi khi cập nhật giỏ hàng', error: error.message });
    }
});

// @desc    Remove item from cart
// @route   DELETE /api/cart/:itemId
// @access  Private
router.delete('/:itemId', protect, async (req, res) => {
    try {
        const { itemId } = req.params;

        const cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            return res.status(404).json({ message: 'Không tìm thấy giỏ hàng' });
        }

        // Remove item
        cart.items = cart.items.filter(item => item._id.toString() !== itemId);
        cart.updatedAt = Date.now();
        
        await cart.save();
        
        // Populate and return
        const updatedCart = await Cart.findById(cart._id)
            .populate('items.product', 'name price imageUrl brand model specifications stock');

        res.json(updatedCart);
    } catch (error) {
        console.error('Remove from cart error:', error);
        res.status(500).json({ message: 'Lỗi khi xóa khỏi giỏ hàng', error: error.message });
    }
});

// @desc    Clear cart
// @route   DELETE /api/cart/clear
// @access  Private
router.delete('/clear/all', protect, async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            return res.status(404).json({ message: 'Không tìm thấy giỏ hàng' });
        }

        cart.items = [];
        cart.updatedAt = Date.now();
        await cart.save();

        res.json({ message: 'Đã xóa giỏ hàng', cart });
    } catch (error) {
        console.error('Clear cart error:', error);
        res.status(500).json({ message: 'Lỗi khi xóa giỏ hàng', error: error.message });
    }
});

module.exports = router;
