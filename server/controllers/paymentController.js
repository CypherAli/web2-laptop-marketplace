const Payment = require('../models/Payment');
const Order = require('../models/Order');
const Notification = require('../models/Notification');
const crypto = require('crypto');
const querystring = require('querystring');

/**
 * PAYMENT CONTROLLER
 * Xử lý các thanh toán qua nhiều phương thức
 */

// ==================== COMMON PAYMENT FUNCTIONS ====================

// Create payment record
exports.createPayment = async (req, res) => {
    try {
        const { orderId, paymentMethod } = req.body;
        
        // Verify order exists and belongs to user
        const order = await Order.findOne({
            _id: orderId,
            user: req.user.id
        });
        
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        
        if (order.paymentStatus === 'paid') {
            return res.status(400).json({ message: 'Order already paid' });
        }
        
        // Create payment record
        const payment = new Payment({
            order: orderId,
            user: req.user.id,
            paymentMethod,
            amount: order.totalAmount,
            status: 'pending',
            ipAddress: req.ip,
            userAgent: req.headers['user-agent']
        });
        
        await payment.save();
        
        res.status(201).json({
            message: 'Payment record created',
            payment
        });
    } catch (error) {
        console.error('Create payment error:', error);
        res.status(500).json({ error: error.message });
    }
};

// Get payment by order
exports.getPaymentByOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        
        const payment = await Payment.findOne({ order: orderId })
            .populate('order', 'orderNumber totalAmount status')
            .populate('user', 'username email');
        
        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }
        
        // Check if user owns this payment or is admin
        if (payment.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }
        
        res.json(payment);
    } catch (error) {
        console.error('Get payment error:', error);
        res.status(500).json({ error: error.message });
    }
};

// Get user's payments
exports.getMyPayments = async (req, res) => {
    try {
        const { page = 1, limit = 20, status } = req.query;
        
        const filter = { user: req.user.id };
        if (status) filter.status = status;
        
        const skip = (parseInt(page) - 1) * parseInt(limit);
        
        const payments = await Payment.find(filter)
            .populate('order', 'orderNumber totalAmount createdAt')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));
        
        const total = await Payment.countDocuments(filter);
        
        res.json({
            payments,
            currentPage: parseInt(page),
            totalPages: Math.ceil(total / parseInt(limit)),
            total
        });
    } catch (error) {
        console.error('Get my payments error:', error);
        res.status(500).json({ error: error.message });
    }
};

// ==================== COD PAYMENT ====================

// Process COD payment (Admin/Delivery staff confirms)
exports.confirmCODPayment = async (req, res) => {
    try {
        const { paymentId } = req.params;
        const { collectedBy, receiptNumber } = req.body;
        
        const payment = await Payment.findById(paymentId);
        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }
        
        if (payment.paymentMethod !== 'cod') {
            return res.status(400).json({ message: 'This is not a COD payment' });
        }
        
        if (payment.status === 'success') {
            return res.status(400).json({ message: 'Payment already confirmed' });
        }
        
        // Update payment
        payment.status = 'success';
        payment.completedAt = new Date();
        payment.codDetails = {
            collectedBy: collectedBy || req.user.username,
            collectedAt: new Date(),
            receiptNumber
        };
        
        await payment.save();
        
        // Update order
        const order = await Order.findById(payment.order);
        if (order) {
            order.paymentStatus = 'paid';
            order.paymentDate = new Date();
            await order.save();
        }
        
        // Notify user
        await Notification.createNotification({
            user: payment.user,
            type: 'payment_confirmed',
            title: '✅ Đã xác nhận thanh toán',
            message: `Thanh toán COD cho đơn hàng #${order.orderNumber} đã được xác nhận`,
            relatedOrder: order._id,
            priority: 'high'
        });
        
        res.json({
            message: 'COD payment confirmed',
            payment
        });
    } catch (error) {
        console.error('Confirm COD payment error:', error);
        res.status(500).json({ error: error.message });
    }
};

// ==================== VNPAY INTEGRATION ====================

// Create VNPay payment URL
exports.createVNPayPayment = async (req, res) => {
    try {
        const { orderId } = req.body;
        
        // Get order
        const order = await Order.findOne({
            _id: orderId,
            user: req.user.id
        });
        
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        
        // Create payment record
        const payment = new Payment({
            order: orderId,
            user: req.user.id,
            paymentMethod: 'vnpay',
            amount: order.totalAmount,
            status: 'pending'
        });
        
        await payment.save();
        
        // VNPay configuration
        const vnpUrl = process.env.VNPAY_URL || 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html';
        const vnpTmnCode = process.env.VNPAY_TMN_CODE || 'YOUR_TMN_CODE';
        const vnpHashSecret = process.env.VNPAY_HASH_SECRET || 'YOUR_HASH_SECRET';
        const returnUrl = process.env.VNPAY_RETURN_URL || 'http://localhost:3000/payment/vnpay/return';
        
        const date = new Date();
        const createDate = formatDate(date);
        const orderId_vnp = payment._id.toString();
        
        let vnp_Params = {
            vnp_Version: '2.1.0',
            vnp_Command: 'pay',
            vnp_TmnCode: vnpTmnCode,
            vnp_Locale: 'vn',
            vnp_CurrCode: 'VND',
            vnp_TxnRef: orderId_vnp,
            vnp_OrderInfo: `Thanh toan don hang ${order.orderNumber}`,
            vnp_OrderType: 'other',
            vnp_Amount: order.totalAmount * 100, // VNPay requires amount in smallest unit
            vnp_ReturnUrl: returnUrl,
            vnp_IpAddr: req.ip || '127.0.0.1',
            vnp_CreateDate: createDate
        };
        
        // Sort params
        vnp_Params = sortObject(vnp_Params);
        
        // Create signature
        const signData = querystring.stringify(vnp_Params, { encode: false });
        const hmac = crypto.createHmac('sha512', vnpHashSecret);
        const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
        vnp_Params['vnp_SecureHash'] = signed;
        
        // Create payment URL
        const paymentUrl = vnpUrl + '?' + querystring.stringify(vnp_Params, { encode: false });
        
        res.json({
            message: 'VNPay payment URL created',
            paymentUrl,
            paymentId: payment._id
        });
    } catch (error) {
        console.error('Create VNPay payment error:', error);
        res.status(500).json({ error: error.message });
    }
};

// Handle VNPay return
exports.vnpayReturn = async (req, res) => {
    try {
        let vnp_Params = req.query;
        const secureHash = vnp_Params['vnp_SecureHash'];
        
        delete vnp_Params['vnp_SecureHash'];
        delete vnp_Params['vnp_SecureHashType'];
        
        vnp_Params = sortObject(vnp_Params);
        
        const vnpHashSecret = process.env.VNPAY_HASH_SECRET || 'YOUR_HASH_SECRET';
        const signData = querystring.stringify(vnp_Params, { encode: false });
        const hmac = crypto.createHmac('sha512', vnpHashSecret);
        const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
        
        if (secureHash === signed) {
            const paymentId = vnp_Params['vnp_TxnRef'];
            const rspCode = vnp_Params['vnp_ResponseCode'];
            
            const payment = await Payment.findById(paymentId);
            if (!payment) {
                return res.status(404).json({ message: 'Payment not found' });
            }
            
            if (rspCode === '00') {
                // Payment success
                await payment.markAsSuccess({
                    name: 'VNPay',
                    transactionId: vnp_Params['vnp_TransactionNo'],
                    transactionRef: vnp_Params['vnp_TxnRef'],
                    gatewayOrderInfo: vnp_Params
                });
                
                // Update order
                const order = await Order.findById(payment.order);
                if (order) {
                    order.paymentStatus = 'paid';
                    order.paymentDate = new Date();
                    order.transactionId = vnp_Params['vnp_TransactionNo'];
                    await order.save();
                    
                    // Notify user
                    await Notification.createNotification({
                        user: payment.user,
                        type: 'payment_confirmed',
                        title: '✅ Thanh toán thành công',
                        message: `Đơn hàng #${order.orderNumber} đã được thanh toán qua VNPay`,
                        relatedOrder: order._id,
                        priority: 'high'
                    });
                }
                
                res.json({
                    success: true,
                    message: 'Payment successful',
                    payment
                });
            } else {
                // Payment failed
                await payment.markAsFailed({
                    code: rspCode,
                    message: 'VNPay payment failed',
                    details: vnp_Params
                });
                
                res.json({
                    success: false,
                    message: 'Payment failed',
                    code: rspCode
                });
            }
        } else {
            res.status(400).json({ message: 'Invalid signature' });
        }
    } catch (error) {
        console.error('VNPay return error:', error);
        res.status(500).json({ error: error.message });
    }
};

// ==================== MOMO INTEGRATION ====================

// Create MoMo payment
exports.createMoMoPayment = async (req, res) => {
    try {
        const { orderId } = req.body;
        
        // Get order
        const order = await Order.findOne({
            _id: orderId,
            user: req.user.id
        });
        
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        
        // Create payment record
        const payment = new Payment({
            order: orderId,
            user: req.user.id,
            paymentMethod: 'momo',
            amount: order.totalAmount,
            status: 'pending'
        });
        
        await payment.save();
        
        // MoMo configuration
        const partnerCode = process.env.MOMO_PARTNER_CODE || 'YOUR_PARTNER_CODE';
        const accessKey = process.env.MOMO_ACCESS_KEY || 'YOUR_ACCESS_KEY';
        const secretKey = process.env.MOMO_SECRET_KEY || 'YOUR_SECRET_KEY';
        const returnUrl = process.env.MOMO_RETURN_URL || 'http://localhost:3000/payment/momo/return';
        const notifyUrl = process.env.MOMO_NOTIFY_URL || 'http://localhost:5000/api/payment/momo/notify';
        
        const orderId_momo = payment._id.toString();
        const requestId = orderId_momo;
        const amount = order.totalAmount.toString();
        const orderInfo = `Thanh toan don hang ${order.orderNumber}`;
        const requestType = 'captureWallet';
        const extraData = '';
        
        // Create signature
        const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${notifyUrl}&orderId=${orderId_momo}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${returnUrl}&requestId=${requestId}&requestType=${requestType}`;
        const signature = crypto.createHmac('sha256', secretKey)
            .update(rawSignature)
            .digest('hex');
        
        // Request body
        const requestBody = {
            partnerCode,
            accessKey,
            requestId,
            amount,
            orderId: orderId_momo,
            orderInfo,
            redirectUrl: returnUrl,
            ipnUrl: notifyUrl,
            extraData,
            requestType,
            signature,
            lang: 'vi'
        };
        
        // Note: In production, you would make an HTTP request to MoMo API
        // const momoUrl = 'https://test-payment.momo.vn/v2/gateway/api/create';
        // const response = await axios.post(momoUrl, requestBody);
        
        res.json({
            message: 'MoMo payment created',
            // payUrl: response.data.payUrl,
            paymentId: payment._id,
            requestBody // For testing
        });
    } catch (error) {
        console.error('Create MoMo payment error:', error);
        res.status(500).json({ error: error.message });
    }
};

// ==================== BANK TRANSFER ====================

// Submit bank transfer proof
exports.submitBankTransfer = async (req, res) => {
    try {
        const { paymentId } = req.params;
        const { bankName, accountNumber, accountName, transferDate, referenceNumber, proofImageUrl } = req.body;
        
        const payment = await Payment.findOne({
            _id: paymentId,
            user: req.user.id
        });
        
        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }
        
        if (payment.paymentMethod !== 'bank_transfer') {
            return res.status(400).json({ message: 'This is not a bank transfer payment' });
        }
        
        payment.status = 'processing';
        payment.bankTransferDetails = {
            bankName,
            accountNumber,
            accountName,
            transferDate: new Date(transferDate),
            referenceNumber,
            proofImageUrl
        };
        
        await payment.save();
        
        // Notify admin to verify
        await Notification.createNotification({
            user: req.user.id,
            type: 'payment_processing',
            title: '⏳ Đang xử lý thanh toán',
            message: 'Chúng tôi đã nhận được thông tin chuyển khoản của bạn và đang xác minh',
            priority: 'medium'
        });
        
        res.json({
            message: 'Bank transfer details submitted',
            payment
        });
    } catch (error) {
        console.error('Submit bank transfer error:', error);
        res.status(500).json({ error: error.message });
    }
};

// Verify bank transfer (Admin)
exports.verifyBankTransfer = async (req, res) => {
    try {
        const { paymentId } = req.params;
        const { verified, note } = req.body;
        
        const payment = await Payment.findById(paymentId);
        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }
        
        if (verified) {
            await payment.markAsSuccess({
                name: 'Bank Transfer',
                transactionRef: payment.bankTransferDetails.referenceNumber
            });
            
            // Update order
            const order = await Order.findById(payment.order);
            if (order) {
                order.paymentStatus = 'paid';
                order.paymentDate = new Date();
                await order.save();
            }
            
            // Notify user
            await Notification.createNotification({
                user: payment.user,
                type: 'payment_confirmed',
                title: '✅ Đã xác nhận thanh toán',
                message: 'Thanh toán chuyển khoản của bạn đã được xác nhận',
                priority: 'high'
            });
        } else {
            await payment.markAsFailed({
                code: 'VERIFICATION_FAILED',
                message: note || 'Bank transfer verification failed'
            });
            
            // Notify user
            await Notification.createNotification({
                user: payment.user,
                type: 'payment_failed',
                title: '❌ Thanh toán thất bại',
                message: note || 'Chuyển khoản không được xác nhận. Vui lòng liên hệ hỗ trợ.',
                priority: 'high'
            });
        }
        
        res.json({
            message: verified ? 'Payment verified' : 'Payment rejected',
            payment
        });
    } catch (error) {
        console.error('Verify bank transfer error:', error);
        res.status(500).json({ error: error.message });
    }
};

// ==================== REFUND ====================

// Request refund
exports.requestRefund = async (req, res) => {
    try {
        const { paymentId } = req.params;
        const { amount, reason } = req.body;
        
        const payment = await Payment.findOne({
            _id: paymentId,
            user: req.user.id
        });
        
        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }
        
        if (payment.status !== 'success') {
            return res.status(400).json({ message: 'Can only refund successful payments' });
        }
        
        if (amount > payment.amount) {
            return res.status(400).json({ message: 'Refund amount cannot exceed payment amount' });
        }
        
        await payment.requestRefund(amount, reason, req.user.id);
        
        res.json({
            message: 'Refund request submitted',
            payment
        });
    } catch (error) {
        console.error('Request refund error:', error);
        res.status(500).json({ error: error.message });
    }
};

// Process refund (Admin)
exports.processRefund = async (req, res) => {
    try {
        const { paymentId } = req.params;
        const { approved, transactionId, note } = req.body;
        
        const payment = await Payment.findById(paymentId);
        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }
        
        await payment.processRefund(approved, req.user.id, transactionId);
        
        // Update order
        if (approved) {
            const order = await Order.findById(payment.order);
            if (order) {
                order.paymentStatus = 'refunded';
                await order.save();
            }
        }
        
        // Notify user
        await Notification.createNotification({
            user: payment.user,
            type: approved ? 'refund_approved' : 'refund_rejected',
            title: approved ? '✅ Hoàn tiền thành công' : '❌ Yêu cầu hoàn tiền bị từ chối',
            message: note || (approved ? 'Tiền đã được hoàn vào tài khoản của bạn' : 'Yêu cầu hoàn tiền không được chấp nhận'),
            priority: 'high'
        });
        
        res.json({
            message: approved ? 'Refund processed' : 'Refund rejected',
            payment
        });
    } catch (error) {
        console.error('Process refund error:', error);
        res.status(500).json({ error: error.message });
    }
};

// ==================== HELPER FUNCTIONS ====================

function sortObject(obj) {
    const sorted = {};
    const keys = Object.keys(obj).sort();
    keys.forEach(key => {
        sorted[key] = obj[key];
    });
    return sorted;
}

function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');
    const second = String(date.getSeconds()).padStart(2, '0');
    return `${year}${month}${day}${hour}${minute}${second}`;
}

module.exports = exports;
