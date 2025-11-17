const Warranty = require('../models/Warranty');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Notification = require('../models/Notification');

/**
 * WARRANTY CONTROLLER
 * Quản lý bảo hành laptop
 */

// Get all warranties for user
exports.getUserWarranties = async (req, res) => {
    try {
        const { status, page = 1, limit = 10 } = req.query;
        
        const filter = { user: req.user.id };
        if (status) filter.status = status;
        
        const skip = (parseInt(page) - 1) * parseInt(limit);
        
        const warranties = await Warranty.find(filter)
            .populate('product', 'name brand imageUrl')
            .populate('order', 'orderNumber createdAt')
            .sort({ 'warrantyPeriod.endDate': -1 })
            .skip(skip)
            .limit(parseInt(limit));
        
        const total = await Warranty.countDocuments(filter);
        
        res.json({
            warranties,
            currentPage: parseInt(page),
            totalPages: Math.ceil(total / parseInt(limit)),
            total
        });
    } catch (error) {
        console.error('Get warranties error:', error);
        res.status(500).json({ error: error.message });
    }
};

// Get warranty by ID
exports.getWarrantyById = async (req, res) => {
    try {
        const { warrantyId } = req.params;
        
        const warranty = await Warranty.findOne({
            _id: warrantyId,
            user: req.user.id
        })
            .populate('product', 'name brand imageUrl price')
            .populate('order', 'orderNumber createdAt totalAmount')
            .populate('repairHistory.repairCenter');
        
        if (!warranty) {
            return res.status(404).json({ message: 'Warranty not found' });
        }
        
        // Include computed values
        const warrantyData = warranty.toObject({ virtuals: true });
        
        res.json(warrantyData);
    } catch (error) {
        console.error('Get warranty error:', error);
        res.status(500).json({ error: error.message });
    }
};

// Register warranty (after purchase)
exports.registerWarranty = async (req, res) => {
    try {
        const {
            orderId,
            productId,
            serialNumber,
            imeiNumber,
            warrantyType,
            warrantyMonths,
            contactPerson
        } = req.body;
        
        // Verify order belongs to user
        const order = await Order.findOne({
            _id: orderId,
            user: req.user.id
        });
        
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        
        // Verify product is in order
        const orderItem = order.items.find(
            item => item.product.toString() === productId
        );
        
        if (!orderItem) {
            return res.status(400).json({ message: 'Product not in order' });
        }
        
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        
        // Check if warranty already exists
        const existingWarranty = await Warranty.findOne({
            user: req.user.id,
            order: orderId,
            product: productId
        });
        
        if (existingWarranty) {
            return res.status(400).json({ message: 'Warranty already registered for this product' });
        }
        
        // Calculate warranty period
        const startDate = new Date(order.createdAt);
        const endDate = new Date(startDate);
        endDate.setMonth(endDate.getMonth() + (warrantyMonths || 12));
        
        // Create warranty
        const warranty = new Warranty({
            user: req.user.id,
            order: orderId,
            product: productId,
            productName: product.name,
            serialNumber,
            imeiNumber,
            warrantyType: warrantyType || 'manufacturer',
            warrantyPeriod: {
                months: warrantyMonths || 12,
                startDate,
                endDate
            },
            contactPerson,
            status: 'active'
        });
        
        await warranty.save();
        
        res.status(201).json({
            message: 'Warranty registered successfully',
            warranty
        });
    } catch (error) {
        console.error('Register warranty error:', error);
        res.status(500).json({ error: error.message });
    }
};

// Update warranty information
exports.updateWarranty = async (req, res) => {
    try {
        const { warrantyId } = req.params;
        const { serialNumber, imeiNumber, contactPerson, notes } = req.body;
        
        const warranty = await Warranty.findOne({
            _id: warrantyId,
            user: req.user.id
        });
        
        if (!warranty) {
            return res.status(404).json({ message: 'Warranty not found' });
        }
        
        if (serialNumber) warranty.serialNumber = serialNumber;
        if (imeiNumber) warranty.imeiNumber = imeiNumber;
        if (contactPerson) warranty.contactPerson = contactPerson;
        if (notes) warranty.notes = notes;
        
        await warranty.save();
        
        res.json({
            message: 'Warranty updated successfully',
            warranty
        });
    } catch (error) {
        console.error('Update warranty error:', error);
        res.status(500).json({ error: error.message });
    }
};

// Submit repair request
exports.submitRepairRequest = async (req, res) => {
    try {
        const { warrantyId } = req.params;
        const {
            issueDescription,
            repairCenter,
            estimatedCompletionDate
        } = req.body;
        
        const warranty = await Warranty.findOne({
            _id: warrantyId,
            user: req.user.id
        });
        
        if (!warranty) {
            return res.status(404).json({ message: 'Warranty not found' });
        }
        
        if (warranty.status !== 'active') {
            return res.status(400).json({ message: 'Warranty is not active' });
        }
        
        // Add repair record
        warranty.repairHistory.push({
            issueDescription,
            reportedDate: new Date(),
            repairCenter,
            status: 'pending',
            estimatedCompletionDate
        });
        
        warranty.status = 'claimed';
        await warranty.save();
        
        // Send notification
        await Notification.createNotification({
            user: req.user.id,
            type: 'repair_status_updated',
            title: 'Yêu cầu sửa chữa đã được tiếp nhận',
            message: `Yêu cầu sửa chữa cho ${warranty.productName} đã được ghi nhận`,
            relatedWarranty: warranty._id,
            actionUrl: `/profile/warranty/${warranty._id}`,
            actionText: 'Xem chi tiết',
            priority: 'medium'
        });
        
        res.json({
            message: 'Repair request submitted successfully',
            warranty
        });
    } catch (error) {
        console.error('Submit repair request error:', error);
        res.status(500).json({ error: error.message });
    }
};

// Update repair status (Admin/Partner)
exports.updateRepairStatus = async (req, res) => {
    try {
        const { warrantyId, repairId } = req.params;
        const {
            status,
            receivedDate,
            completedDate,
            repairDetails,
            technicianNotes
        } = req.body;
        
        const warranty = await Warranty.findById(warrantyId);
        if (!warranty) {
            return res.status(404).json({ message: 'Warranty not found' });
        }
        
        const repair = warranty.repairHistory.id(repairId);
        if (!repair) {
            return res.status(404).json({ message: 'Repair record not found' });
        }
        
        // Update repair status
        if (status) repair.status = status;
        if (receivedDate) repair.receivedDate = receivedDate;
        if (completedDate) repair.completedDate = completedDate;
        if (repairDetails) repair.repairDetails = repairDetails;
        if (technicianNotes) repair.technicianNotes = technicianNotes;
        
        // If repair completed, restore warranty status
        if (status === 'completed') {
            warranty.status = 'active';
        }
        
        await warranty.save();
        
        // Notify user
        const statusMessages = {
            in_progress: 'Sản phẩm đang được sửa chữa',
            completed: 'Sản phẩm đã được sửa chữa xong',
            rejected: 'Yêu cầu sửa chữa không được chấp nhận'
        };
        
        if (statusMessages[status]) {
            await Notification.createNotification({
                user: warranty.user,
                type: 'repair_status_updated',
                title: 'Cập nhật trạng thái sửa chữa',
                message: `${warranty.productName}: ${statusMessages[status]}`,
                relatedWarranty: warranty._id,
                actionUrl: `/profile/warranty/${warranty._id}`,
                actionText: 'Xem chi tiết',
                priority: 'high'
            });
        }
        
        res.json({
            message: 'Repair status updated successfully',
            warranty
        });
    } catch (error) {
        console.error('Update repair status error:', error);
        res.status(500).json({ error: error.message });
    }
};

// Submit repair feedback
exports.submitRepairFeedback = async (req, res) => {
    try {
        const { warrantyId, repairId } = req.params;
        const { rating, feedback } = req.body;
        
        const warranty = await Warranty.findOne({
            _id: warrantyId,
            user: req.user.id
        });
        
        if (!warranty) {
            return res.status(404).json({ message: 'Warranty not found' });
        }
        
        const repair = warranty.repairHistory.id(repairId);
        if (!repair) {
            return res.status(404).json({ message: 'Repair record not found' });
        }
        
        repair.customerSatisfaction = {
            rating,
            feedback
        };
        
        await warranty.save();
        
        res.json({
            message: 'Feedback submitted successfully',
            warranty
        });
    } catch (error) {
        console.error('Submit repair feedback error:', error);
        res.status(500).json({ error: error.message });
    }
};

// Upload warranty documents
exports.uploadWarrantyDocument = async (req, res) => {
    try {
        const { warrantyId } = req.params;
        const { type, url } = req.body;
        
        const warranty = await Warranty.findOne({
            _id: warrantyId,
            user: req.user.id
        });
        
        if (!warranty) {
            return res.status(404).json({ message: 'Warranty not found' });
        }
        
        warranty.documents.push({
            type,
            url,
            uploadedAt: new Date()
        });
        
        await warranty.save();
        
        res.json({
            message: 'Document uploaded successfully',
            warranty
        });
    } catch (error) {
        console.error('Upload document error:', error);
        res.status(500).json({ error: error.message });
    }
};

// Get expiring warranties
exports.getExpiringWarranties = async (req, res) => {
    try {
        const days = parseInt(req.query.days) || 30;
        
        const warranties = await Warranty.findExpiringSoon(days)
            .where('user').equals(req.user.id)
            .populate('product', 'name brand imageUrl');
        
        res.json(warranties);
    } catch (error) {
        console.error('Get expiring warranties error:', error);
        res.status(500).json({ error: error.message });
    }
};

// Check and send warranty expiry reminders (Cron job)
exports.sendWarrantyReminders = async () => {
    try {
        // Find warranties expiring in 30 days
        const warranties30Days = await Warranty.find({
            status: 'active',
            'warrantyPeriod.endDate': {
                $gte: new Date(),
                $lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
            },
            'reminders.thirtyDaysBefore.sent': false
        }).populate('user', 'email username');
        
        for (const warranty of warranties30Days) {
            await Notification.notifyWarrantyExpiring(
                warranty.user._id,
                warranty,
                30
            );
            warranty.reminders.thirtyDaysBefore.sent = true;
            warranty.reminders.thirtyDaysBefore.sentAt = new Date();
            await warranty.save();
        }
        
        // Find warranties expiring in 7 days
        const warranties7Days = await Warranty.find({
            status: 'active',
            'warrantyPeriod.endDate': {
                $gte: new Date(),
                $lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            },
            'reminders.sevenDaysBefore.sent': false
        }).populate('user', 'email username');
        
        for (const warranty of warranties7Days) {
            await Notification.notifyWarrantyExpiring(
                warranty.user._id,
                warranty,
                7
            );
            warranty.reminders.sevenDaysBefore.sent = true;
            warranty.reminders.sevenDaysBefore.sentAt = new Date();
            await warranty.save();
        }
        
        console.log(`Sent ${warranties30Days.length + warranties7Days.length} warranty reminders`);
    } catch (error) {
        console.error('Send warranty reminders error:', error);
    }
};

module.exports = exports;
