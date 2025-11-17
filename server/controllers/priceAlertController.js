const PriceAlert = require('../models/PriceAlert');
const Product = require('../models/Product');
const Notification = require('../models/Notification');

/**
 * PRICE ALERT CONTROLLER
 * Quản lý cảnh báo giá sản phẩm
 */

// Get all price alerts for user
exports.getUserPriceAlerts = async (req, res) => {
    try {
        const { status, page = 1, limit = 20 } = req.query;
        
        const filter = { user: req.user.id };
        if (status) filter.status = status;
        
        const skip = (parseInt(page) - 1) * parseInt(limit);
        
        const alerts = await PriceAlert.find(filter)
            .populate('product', 'name brand imageUrl price stock')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));
        
        const total = await PriceAlert.countDocuments(filter);
        
        res.json({
            alerts,
            currentPage: parseInt(page),
            totalPages: Math.ceil(total / parseInt(limit)),
            total
        });
    } catch (error) {
        console.error('Get price alerts error:', error);
        res.status(500).json({ error: error.message });
    }
};

// Get alert by ID
exports.getPriceAlertById = async (req, res) => {
    try {
        const { alertId } = req.params;
        
        const alert = await PriceAlert.findOne({
            _id: alertId,
            user: req.user.id
        }).populate('product', 'name brand imageUrl price stock');
        
        if (!alert) {
            return res.status(404).json({ message: 'Price alert not found' });
        }
        
        res.json(alert);
    } catch (error) {
        console.error('Get price alert error:', error);
        res.status(500).json({ error: error.message });
    }
};

// Create price alert
exports.createPriceAlert = async (req, res) => {
    try {
        const { productId, targetPrice, alertType, notifyVia } = req.body;
        
        // Verify product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        
        // Check if user already has an active alert for this product
        const existingAlert = await PriceAlert.findOne({
            user: req.user.id,
            product: productId,
            status: 'active'
        });
        
        if (existingAlert) {
            return res.status(400).json({ 
                message: 'You already have an active alert for this product',
                alert: existingAlert
            });
        }
        
        // Validate target price
        if (alertType === 'specific_price' && targetPrice >= product.price) {
            return res.status(400).json({ 
                message: 'Target price must be lower than current price' 
            });
        }
        
        // Create alert
        const alert = new PriceAlert({
            user: req.user.id,
            product: productId,
            targetPrice: targetPrice || product.price * 0.9, // Default: 10% discount
            currentPrice: product.price,
            alertType: alertType || 'specific_price',
            notifyVia: notifyVia || { email: true, push: false, sms: false },
            status: 'active'
        });
        
        await alert.save();
        
        res.status(201).json({
            message: 'Price alert created successfully',
            alert
        });
    } catch (error) {
        console.error('Create price alert error:', error);
        res.status(500).json({ error: error.message });
    }
};

// Update price alert
exports.updatePriceAlert = async (req, res) => {
    try {
        const { alertId } = req.params;
        const { targetPrice, notifyVia } = req.body;
        
        const alert = await PriceAlert.findOne({
            _id: alertId,
            user: req.user.id
        });
        
        if (!alert) {
            return res.status(404).json({ message: 'Price alert not found' });
        }
        
        if (alert.status !== 'active') {
            return res.status(400).json({ message: 'Can only update active alerts' });
        }
        
        if (targetPrice) alert.targetPrice = targetPrice;
        if (notifyVia) alert.notifyVia = { ...alert.notifyVia, ...notifyVia };
        
        await alert.save();
        
        res.json({
            message: 'Price alert updated successfully',
            alert
        });
    } catch (error) {
        console.error('Update price alert error:', error);
        res.status(500).json({ error: error.message });
    }
};

// Delete/Cancel price alert
exports.deletePriceAlert = async (req, res) => {
    try {
        const { alertId } = req.params;
        
        const alert = await PriceAlert.findOne({
            _id: alertId,
            user: req.user.id
        });
        
        if (!alert) {
            return res.status(404).json({ message: 'Price alert not found' });
        }
        
        // Mark as cancelled instead of deleting
        alert.status = 'cancelled';
        await alert.save();
        
        res.json({ message: 'Price alert cancelled successfully' });
    } catch (error) {
        console.error('Delete price alert error:', error);
        res.status(500).json({ error: error.message });
    }
};

// Get triggered alerts
exports.getTriggeredAlerts = async (req, res) => {
    try {
        const alerts = await PriceAlert.find({
            user: req.user.id,
            status: 'triggered'
        })
            .populate('product', 'name brand imageUrl price stock')
            .sort({ 'triggered.triggeredAt': -1 })
            .limit(50);
        
        res.json(alerts);
    } catch (error) {
        console.error('Get triggered alerts error:', error);
        res.status(500).json({ error: error.message });
    }
};

// Check and trigger price alerts (Cron job or on product price update)
exports.checkPriceAlerts = async (productId) => {
    try {
        const product = await Product.findById(productId);
        if (!product) return;
        
        // Find all active alerts for this product
        const alerts = await PriceAlert.findActiveAlertsForProduct(productId);
        
        for (const alert of alerts) {
            // Check if alert should be triggered
            const triggered = await alert.checkAndTrigger(product.price);
            
            if (triggered) {
                // Send notification
                await Notification.notifyPriceDrop(
                    alert.user._id,
                    product,
                    alert.currentPrice,
                    product.price
                );
                
                // Mark notification as sent
                alert.triggered.notificationSent = true;
                alert.triggered.notificationSentAt = new Date();
                await alert.save();
                
                console.log(`Price alert triggered for user ${alert.user._id}, product ${productId}`);
            }
        }
    } catch (error) {
        console.error('Check price alerts error:', error);
    }
};

// Batch check all active alerts (Cron job - runs daily)
exports.checkAllPriceAlerts = async () => {
    try {
        // Get all unique products with active alerts
        const alerts = await PriceAlert.find({ status: 'active' }).distinct('product');
        
        console.log(`Checking price alerts for ${alerts.length} products`);
        
        for (const productId of alerts) {
            await exports.checkPriceAlerts(productId);
        }
        
        // Clean up expired alerts
        await PriceAlert.updateMany(
            {
                status: 'active',
                expiresAt: { $lt: new Date() }
            },
            {
                status: 'expired'
            }
        );
        
        console.log('Price alert check completed');
    } catch (error) {
        console.error('Batch check price alerts error:', error);
    }
};

module.exports = exports;
