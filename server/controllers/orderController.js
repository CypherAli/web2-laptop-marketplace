const Order = require('../models/Order');
const Product = require('../models/Product');
const Notification = require('../models/Notification');
const emailService = require('../services/emailService');
const User = require('../models/User');

// Create new order
exports.createOrder = async (req, res) => {
    try {
        console.log('📦 CREATE ORDER - User:', req.user.id);
        console.log('📦 Body:', JSON.stringify(req.body, null, 2));
        
        const { items, shippingAddress, paymentMethod, notes, customerNotes } = req.body;
        
        if (!items || items.length === 0) {
            return res.status(400).json({ message: 'Đơn hàng phải có ít nhất 1 sản phẩm' });
        }

        if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.phone || !shippingAddress.address) {
            return res.status(400).json({ message: 'Thiếu thông tin giao hàng' });
        }

        // Validate stock and calculate total
        let subtotal = 0;
        const orderItems = [];

        for (const item of items) {
            const product = await Product.findById(item.productId);
            
            if (!product) {
                return res.status(404).json({ message: `Không tìm thấy sản phẩm ${item.productId}` });
            }

            if (product.stock < item.quantity) {
                return res.status(400).json({ 
                    message: `Sản phẩm "${product.name}" không đủ số lượng. Còn lại: ${product.stock}` 
                });
            }

            const itemTotal = product.price * item.quantity;
            
            orderItems.push({
                product: product._id,
                seller: product.seller,
                name: product.name,
                brand: product.brand,
                price: product.price,
                originalPrice: product.originalPrice || product.price,
                quantity: item.quantity,
                imageUrl: product.imageUrl,
                specifications: {
                    processor: product.processor,
                    ram: product.ram,
                    storage: product.storage
                }
            });

            subtotal += itemTotal;

            // Reduce stock
            product.stock -= item.quantity;
            product.sold = (product.sold || 0) + item.quantity;
            await product.save();
        }

        // Calculate shipping fee (Free shipping for orders >= 10M)
        const shippingFee = subtotal >= 10000000 ? 0 : 30000;
        
        // Calculate total
        const totalAmount = subtotal + shippingFee;

        // Create order
        const order = new Order({
            user: req.user.id,
            items: orderItems,
            subtotal,
            shippingFee,
            totalAmount,
            shippingAddress,
            paymentMethod: paymentMethod || 'cod',
            customerNotes: customerNotes || notes,
            status: 'pending',
            paymentStatus: paymentMethod === 'cod' ? 'unpaid' : 'pending'
        });

        await order.save();
        
        // Populate for response
        await order.populate([
            { path: 'user', select: 'username email phone' },
            { path: 'items.product', select: 'name brand imageUrl' }
        ]);

        console.log('✅ Order created:', order.orderNumber);

        // Send email confirmation
        try {
            const user = await User.findById(req.user.id);
            if (user && user.email) {
                await emailService.sendOrderConfirmation(order, user);
            }
        } catch (emailErr) {
            console.error('⚠️ Failed to send order confirmation email:', emailErr);
        }

        // Create notifications
        try {
            // 1. Notification for customer
            await Notification.createNotification({
                user: req.user.id,
                type: 'order_confirmed',
                title: '✅ Đặt hàng thành công!',
                message: `Đơn hàng #${order.orderNumber} đã được tạo thành công. Tổng tiền: ${order.totalAmount.toLocaleString()}đ`,
                relatedOrder: order._id,
                actionUrl: `/orders/${order._id}`,
                actionText: 'Xem đơn hàng',
                priority: 'high'
            });

            // 2. Notifications for admin and partner
            const adminsAndPartners = await User.find({ 
                role: { $in: ['admin', 'partner'] },
                isActive: true
            }).select('_id');

            for (const staff of adminsAndPartners) {
                await Notification.createNotification({
                    user: staff._id,
                    type: 'new_order',
                    title: '🛒 Đơn hàng mới!',
                    message: `Có đơn hàng mới #${order.orderNumber} từ khách hàng. Giá trị: ${order.totalAmount.toLocaleString()}đ`,
                    relatedOrder: order._id,
                    actionUrl: `/dashboard/orders/${order._id}`,
                    actionText: 'Xử lý đơn hàng',
                    priority: 'high'
                });
            }

            // Emit real-time notification via Socket.IO
            const io = req.app.get('io');
            if (io) {
                // To customer
                io.to(`user:${req.user.id}`).emit('notification:new', {
                    type: 'order_confirmed',
                    message: `Đơn hàng #${order.orderNumber} đã được tạo thành công`,
                    orderId: order._id
                });

                // To admins/partners
                for (const staff of adminsAndPartners) {
                    io.to(`user:${staff._id}`).emit('notification:new', {
                        type: 'new_order',
                        message: `Đơn hàng mới #${order.orderNumber}`,
                        orderId: order._id
                    });
                }
            }
        } catch (notifErr) {
            console.error('⚠️ Failed to create notification:', notifErr);
            // Don't fail the order if notification fails
        }

        res.status(201).json({
            success: true,
            message: 'Đặt hàng thành công!',
            order: {
                _id: order._id,
                orderNumber: order.orderNumber,
                totalAmount: order.totalAmount,
                status: order.status,
                createdAt: order.createdAt
            }
        });
    } catch (err) {
        console.error('❌ CREATE ORDER ERROR:', err);
        res.status(500).json({ 
            success: false,
            message: 'Lỗi khi tạo đơn hàng. Vui lòng thử lại.',
            error: err.message,
            stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
        });
    }
};

// Get user's orders
exports.getMyOrders = async (req, res) => {
    try {
        const { page = 1, limit = 10, status } = req.query;
        
        const filter = { user: req.user.id };
        if (status) filter.status = status;
        
        const pageNum = Number(page);
        const limitNum = Number(limit);
        const skip = (pageNum - 1) * limitNum;

        const orders = await Order.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limitNum)
            .populate('items.product', 'name brand imageUrl price')
            .populate('items.seller', 'username email')
            .lean();

        const totalOrders = await Order.countDocuments(filter);
        const totalPages = Math.ceil(totalOrders / limitNum);

        res.json({
            success: true,
            orders,
            pagination: {
                currentPage: pageNum,
                totalPages,
                totalOrders,
                hasNextPage: pageNum < totalPages,
                hasPrevPage: pageNum > 1
            }
        });
    } catch (err) {
        console.error('❌ GET MY ORDERS ERROR:', err);
        res.status(500).json({ 
            success: false,
            message: 'Lỗi khi lấy danh sách đơn hàng',
            error: err.message 
        });
    }
};

// Get single order
exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('user', 'username email phone avatar')
            .populate('items.product', 'name brand imageUrl price specifications')
            .populate('items.seller', 'username email')
            .populate('statusHistory.updatedBy', 'username')
            .lean();

        if (!order) {
            return res.status(404).json({ 
                success: false,
                message: 'Không tìm thấy đơn hàng' 
            });
        }

        // Check if user owns this order or is partner/admin
        const orderUserId = order.user._id.toString();
        const requestUserId = req.user.id.toString();
        
        console.log('🔍 ORDER AUTHORIZATION CHECK:');
        console.log('   Order user ID:', orderUserId);
        console.log('   Request user ID:', requestUserId);
        console.log('   User role:', req.user.role);
        console.log('   Match:', orderUserId === requestUserId);
        console.log('   Is staff:', ['partner', 'admin'].includes(req.user.role));
        
        if (orderUserId !== requestUserId && 
            !['partner', 'admin'].includes(req.user.role)) {
            console.log('   ❌ ACCESS DENIED - User does not own order and is not staff');
            return res.status(403).json({ 
                success: false,
                message: 'Bạn không có quyền xem đơn hàng này' 
            });
        }
        
        console.log('   ✅ ACCESS GRANTED');

        res.json({
            success: true,
            order
        });
    } catch (err) {
        console.error('❌ GET ORDER BY ID ERROR:', err);
        res.status(500).json({ 
            success: false,
            message: 'Lỗi khi lấy thông tin đơn hàng',
            error: err.message 
        });
    }
};

// Get all orders (Manager/Admin only)
exports.getAllOrders = async (req, res) => {
    try {
        const { page = 1, limit = 10, status } = req.query;

        const filter = status ? { status } : {};
        
        const pageNum = Number(page);
        const limitNum = Number(limit);
        const skip = (pageNum - 1) * limitNum;

        const orders = await Order.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limitNum)
            .populate('user', 'username email')
            .populate('items.product', 'name');

        const totalOrders = await Order.countDocuments(filter);
        const totalPages = Math.ceil(totalOrders / limitNum);

        res.json({
            orders,
            currentPage: pageNum,
            totalPages,
            totalOrders
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update order status (Manager/Admin only)
exports.updateOrderStatus = async (req, res) => {
    try {
        console.log('🔄 UPDATE ORDER STATUS REQUEST:');
        console.log('   Order ID:', req.params.id);
        console.log('   New Status:', req.body.status);
        console.log('   User:', req.user.username, '(', req.user.role, ')');
        
        const { status, note } = req.body;
        
        if (!status) {
            return res.status(400).json({ 
                success: false,
                message: 'Thiếu trạng thái mới (status field required)' 
            });
        }
        
        const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded', 'returned'];
        if (!validStatuses.includes(status)) {
            console.log('   ❌ Invalid status:', status);
            return res.status(400).json({ 
                success: false,
                message: `Trạng thái không hợp lệ: "${status}"`,
                validStatuses,
                receivedStatus: status
            });
        }

        const order = await Order.findById(req.params.id);
        
        if (!order) {
            console.log('   ❌ Order not found:', req.params.id);
            return res.status(404).json({ 
                success: false,
                message: 'Không tìm thấy đơn hàng' 
            });
        }

        console.log('   📦 Current order status:', order.status);
        console.log('   🔄 Changing to:', status);

        // Update status
        const oldStatus = order.status;
        order.status = status;
        
        // Add to status history
        order.statusHistory.push({
            status,
            note: note || `Status updated from ${oldStatus} to ${status} by ${req.user.username}`,
            updatedBy: req.user.id,
            timestamp: new Date()
        });

        try {
            await order.save();
            console.log('   ✅ Order saved successfully');
        } catch (saveError) {
            console.error('   ❌ Error saving order:', saveError);
            return res.status(400).json({
                success: false,
                message: 'Lỗi khi lưu đơn hàng: ' + saveError.message,
                error: saveError.message
            });
        }

        // Create notifications for customer and staff
        try {
            // Customer notification messages
            const statusMessages = {
                confirmed: {
                    title: '✅ Đơn hàng đã được xác nhận',
                    message: `Đơn hàng #${order.orderNumber} đã được xác nhận và đang được chuẩn bị.`,
                    priority: 'high'
                },
                processing: {
                    title: '📦 Đơn hàng đang được xử lý',
                    message: `Đơn hàng #${order.orderNumber} đang được đóng gói và chuẩn bị giao.`,
                    priority: 'medium'
                },
                shipped: {
                    title: '🚚 Đơn hàng đang được giao',
                    message: `Đơn hàng #${order.orderNumber} đã được giao cho đơn vị vận chuyển!`,
                    priority: 'high'
                },
                delivered: {
                    title: '✅ Đơn hàng đã được giao',
                    message: `Đơn hàng #${order.orderNumber} đã được giao thành công. Cảm ơn bạn đã mua hàng!`,
                    priority: 'high'
                },
                cancelled: {
                    title: '❌ Đơn hàng đã bị hủy',
                    message: `Đơn hàng #${order.orderNumber} đã bị hủy. Vui lòng liên hệ hỗ trợ nếu có thắc mắc.`,
                    priority: 'high'
                }
            };

            // Staff notification messages (admin/partner)
            const staffMessages = {
                confirmed: {
                    title: '✅ Đơn hàng đã xác nhận',
                    message: `Đơn #${order.orderNumber} đã xác nhận. Tiến hành xử lý.`,
                    priority: 'medium'
                },
                processing: {
                    title: '📦 Đơn hàng đang xử lý',
                    message: `Đơn #${order.orderNumber} đang được đóng gói.`,
                    priority: 'low'
                },
                shipped: {
                    title: '🚚 Đơn hàng đã giao vận',
                    message: `Đơn #${order.orderNumber} đã bàn giao cho shipper.`,
                    priority: 'medium'
                },
                delivered: {
                    title: '✅ Giao hàng thành công',
                    message: `Đơn #${order.orderNumber} đã giao thành công.`,
                    priority: 'low'
                },
                cancelled: {
                    title: '❌ Đơn hàng đã hủy',
                    message: `Đơn #${order.orderNumber} đã bị hủy bởi ${req.user.username}.`,
                    priority: 'high'
                }
            };

            const customerNotif = statusMessages[status];
            const staffNotif = staffMessages[status];

            // 1. Notify customer
            if (customerNotif) {
                await Notification.createNotification({
                    user: order.user,
                    type: `order_${status}`,
                    title: customerNotif.title,
                    message: customerNotif.message,
                    relatedOrder: order._id,
                    actionUrl: `/orders/${order._id}`,
                    actionText: 'Xem đơn hàng',
                    priority: customerNotif.priority
                });
            }

            // 2. Notify admins and partners about order progress
            if (staffNotif) {
                const adminsAndPartners = await User.find({ 
                    role: { $in: ['admin', 'partner'] },
                    isActive: true,
                    _id: { $ne: req.user.id } // Don't notify the staff who made the update
                }).select('_id');

                for (const staff of adminsAndPartners) {
                    await Notification.createNotification({
                        user: staff._id,
                        type: `order_status_update`,
                        title: staffNotif.title,
                        message: staffNotif.message,
                        relatedOrder: order._id,
                        actionUrl: `/dashboard/orders/${order._id}`,
                        actionText: 'Xem chi tiết',
                        priority: staffNotif.priority
                    });
                }
            }

            // Emit Socket.IO events
            const io = req.app.get('io');
            if (io) {
                // To customer
                if (customerNotif) {
                    io.to(`user:${order.user}`).emit('notification:new', {
                        type: `order_${status}`,
                        message: customerNotif.message,
                        orderId: order._id
                    });
                }

                // To staff (if applicable)
                if (staffNotif) {
                    const adminsAndPartners = await User.find({ 
                        role: { $in: ['admin', 'partner'] },
                        isActive: true,
                        _id: { $ne: req.user.id }
                    }).select('_id');

                    for (const staff of adminsAndPartners) {
                        io.to(`user:${staff._id}`).emit('notification:new', {
                            type: 'order_status_update',
                            message: staffNotif.message,
                            orderId: order._id
                        });
                    }
                }
            }
        } catch (notifErr) {
            console.error('⚠️ Failed to create notification:', notifErr);
            // Don't fail the update if notification fails
        }

        console.log(`✅ Order ${order.orderNumber} status updated: ${oldStatus} → ${status}`);

        // Send email notification
        try {
            const user = await User.findById(order.user);
            if (user && user.email) {
                await emailService.sendOrderStatusUpdate(order, user, status);
            }
        } catch (emailErr) {
            console.error('⚠️ Failed to send status update email:', emailErr);
        }

        res.json({
            success: true,
            message: 'Đã cập nhật trạng thái đơn hàng',
            order: {
                _id: order._id,
                orderNumber: order.orderNumber,
                status: order.status,
                previousStatus: oldStatus,
                updatedAt: order.updatedAt
            }
        });
    } catch (err) {
        console.error('❌ UPDATE ORDER STATUS ERROR:', err);
        res.status(500).json({ 
            success: false,
            message: 'Lỗi khi cập nhật trạng thái đơn hàng',
            error: err.message 
        });
    }
};

// Cancel order (User can cancel their own pending orders)
exports.cancelOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Check ownership
        if (order.user.toString() !== req.user.id.toString()) {
            return res.status(403).json({ message: 'Access denied' });
        }

        // Can only cancel pending orders
        if (order.status !== 'pending') {
            return res.status(400).json({ 
                message: 'Can only cancel pending orders. Please contact support.' 
            });
        }

        // Restore stock
        for (const item of order.items) {
            await Product.findByIdAndUpdate(
                item.product,
                { $inc: { stock: item.quantity } }
            );
        }

        order.status = 'cancelled';
        await order.save();

        res.json({
            message: 'Order cancelled successfully',
            order
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
