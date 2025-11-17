/**
 * EMAIL SERVICE
 * Gửi email cho user (order confirmations, notifications, etc.)
 */

const nodemailer = require('nodemailer');

class EmailService {
    constructor() {
        this.transporter = null;
        this.from = process.env.EMAIL_FROM || 'Laptop Marketplace <noreply@laptopmarketplace.com>';
        this.init();
    }
    
    // Initialize email transporter
    init() {
        try {
            // For production, use real SMTP service (Gmail, SendGrid, etc.)
            if (process.env.NODE_ENV === 'production') {
                this.transporter = nodemailer.createTransport({
                    host: process.env.SMTP_HOST || 'smtp.gmail.com',
                    port: process.env.SMTP_PORT || 587,
                    secure: false,
                    auth: {
                        user: process.env.SMTP_USER,
                        pass: process.env.SMTP_PASS
                    }
                });
            } else {
                // For development, use Ethereal (fake SMTP)
                this.transporter = nodemailer.createTransport({
                    host: 'smtp.ethereal.email',
                    port: 587,
                    auth: {
                        user: process.env.ETHEREAL_USER || 'test@ethereal.email',
                        pass: process.env.ETHEREAL_PASS || 'testpassword'
                    }
                });
            }
            
            console.log('📧 Email service initialized');
        } catch (error) {
            console.error('❌ Email service initialization failed:', error);
        }
    }
    
    // Send email
    async sendEmail(to, subject, html, text) {
        if (!this.transporter) {
            console.warn('⚠️ Email transporter not initialized');
            return false;
        }
        
        try {
            const info = await this.transporter.sendMail({
                from: this.from,
                to,
                subject,
                text: text || strip(html),
                html
            });
            
            console.log(`✅ Email sent: ${info.messageId}`);
            
            if (process.env.NODE_ENV !== 'production') {
                console.log('📧 Preview URL:', nodemailer.getTestMessageUrl(info));
            }
            
            return true;
        } catch (error) {
            console.error('❌ Send email failed:', error);
            return false;
        }
    }
    
    // Send order confirmation email
    async sendOrderConfirmation(order, user) {
        const subject = `Xác nhận đơn hàng #${order.orderNumber}`;
        const html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #2563eb;">Đơn hàng đã được xác nhận!</h2>
                <p>Xin chào <strong>${user.username}</strong>,</p>
                <p>Cảm ơn bạn đã đặt hàng tại Laptop Marketplace!</p>
                
                <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h3>Thông tin đơn hàng</h3>
                    <p><strong>Mã đơn hàng:</strong> ${order.orderNumber}</p>
                    <p><strong>Ngày đặt:</strong> ${new Date(order.createdAt).toLocaleDateString('vi-VN')}</p>
                    <p><strong>Tổng tiền:</strong> ${order.totalAmount.toLocaleString()} VND</p>
                    <p><strong>Trạng thái:</strong> ${getStatusText(order.status)}</p>
                </div>
                
                <div style="margin: 20px 0;">
                    <h3>Sản phẩm đã đặt</h3>
                    ${order.items.map(item => `
                        <div style="border-bottom: 1px solid #e5e7eb; padding: 10px 0;">
                            <p style="margin: 5px 0;"><strong>${item.name}</strong></p>
                            <p style="margin: 5px 0; color: #6b7280;">Số lượng: ${item.quantity} x ${item.price.toLocaleString()} VND</p>
                        </div>
                    `).join('')}
                </div>
                
                <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h3>Địa chỉ giao hàng</h3>
                    <p>${order.shippingAddress.fullName}</p>
                    <p>${order.shippingAddress.phone}</p>
                    <p>${order.shippingAddress.address}, ${order.shippingAddress.city}</p>
                </div>
                
                <p>Chúng tôi sẽ thông báo cho bạn khi đơn hàng được giao.</p>
                
                <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                    <p style="color: #6b7280; font-size: 12px;">
                        Email này được gửi tự động. Vui lòng không trả lời email này.
                        Nếu có thắc mắc, vui lòng liên hệ: support@laptopmarketplace.com
                    </p>
                </div>
            </div>
        `;
        
        return await this.sendEmail(user.email, subject, html);
    }
    
    // Send order status update email
    async sendOrderStatusUpdate(order, user, newStatus) {
        const subject = `Cập nhật đơn hàng #${order.orderNumber}`;
        const statusMessages = {
            confirmed: 'Đơn hàng của bạn đã được xác nhận và đang được chuẩn bị.',
            processing: 'Đơn hàng của bạn đang được đóng gói.',
            shipped: 'Đơn hàng của bạn đã được giao cho đơn vị vận chuyển.',
            delivered: 'Đơn hàng của bạn đã được giao thành công.',
            cancelled: 'Đơn hàng của bạn đã bị hủy.'
        };
        
        const html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #2563eb;">Cập nhật đơn hàng</h2>
                <p>Xin chào <strong>${user.username}</strong>,</p>
                <p>${statusMessages[newStatus] || 'Trạng thái đơn hàng đã được cập nhật.'}</p>
                
                <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <p><strong>Mã đơn hàng:</strong> ${order.orderNumber}</p>
                    <p><strong>Trạng thái mới:</strong> ${getStatusText(newStatus)}</p>
                </div>
                
                ${newStatus === 'shipped' && order.tracking?.trackingNumber ? `
                    <div style="background: #dbeafe; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <h3>Thông tin vận chuyển</h3>
                        <p><strong>Đơn vị vận chuyển:</strong> ${order.tracking.carrier || 'N/A'}</p>
                        <p><strong>Mã vận đơn:</strong> ${order.tracking.trackingNumber}</p>
                        ${order.tracking.trackingUrl ? `
                            <p><a href="${order.tracking.trackingUrl}" style="color: #2563eb;">Theo dõi đơn hàng</a></p>
                        ` : ''}
                    </div>
                ` : ''}
                
                <p>Cảm ơn bạn đã tin tưởng Laptop Marketplace!</p>
                
                <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                    <p style="color: #6b7280; font-size: 12px;">
                        Email này được gửi tự động. Vui lòng không trả lời email này.
                    </p>
                </div>
            </div>
        `;
        
        return await this.sendEmail(user.email, subject, html);
    }
    
    // Send price drop alert
    async sendPriceDropAlert(user, product, oldPrice, newPrice) {
        const subject = `🔥 Giá giảm: ${product.name}`;
        const discount = oldPrice - newPrice;
        const discountPercent = ((discount / oldPrice) * 100).toFixed(0);
        
        const html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #ef4444;">🔥 Giá đã giảm!</h2>
                <p>Xin chào <strong>${user.username}</strong>,</p>
                <p>Sản phẩm bạn quan tâm đã giảm giá!</p>
                
                <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h3>${product.name}</h3>
                    ${product.imageUrl ? `<img src="${product.imageUrl}" alt="${product.name}" style="max-width: 100%; height: auto; border-radius: 8px;">` : ''}
                    <div style="margin-top: 15px;">
                        <p style="text-decoration: line-through; color: #6b7280;">${oldPrice.toLocaleString()} VND</p>
                        <p style="font-size: 24px; font-weight: bold; color: #ef4444;">${newPrice.toLocaleString()} VND</p>
                        <p style="background: #fee2e2; color: #991b1b; padding: 10px; border-radius: 4px; display: inline-block;">
                            Giảm ${discountPercent}% (${discount.toLocaleString()} VND)
                        </p>
                    </div>
                </div>
                
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${process.env.CLIENT_URL}/product/${product._id}" 
                       style="background: #2563eb; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
                        Mua ngay
                    </a>
                </div>
                
                <p style="color: #6b7280; font-size: 14px;">Nhanh tay đặt hàng trước khi hết!</p>
            </div>
        `;
        
        return await this.sendEmail(user.email, subject, html);
    }
    
    // Send warranty reminder
    async sendWarrantyReminder(user, warranty, daysLeft) {
        const subject = `⚠️ Bảo hành sắp hết hạn: ${warranty.productName}`;
        
        const html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #f59e0b;">⚠️ Nhắc nhở bảo hành</h2>
                <p>Xin chào <strong>${user.username}</strong>,</p>
                <p>Bảo hành cho sản phẩm của bạn sắp hết hạn!</p>
                
                <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h3>${warranty.productName}</h3>
                    <p><strong>Mã bảo hành:</strong> ${warranty._id}</p>
                    <p><strong>Còn lại:</strong> ${daysLeft} ngày</p>
                    <p><strong>Ngày hết hạn:</strong> ${new Date(warranty.warrantyPeriod.endDate).toLocaleDateString('vi-VN')}</p>
                </div>
                
                <p>Nếu sản phẩm có vấn đề, hãy liên hệ bảo hành ngay để được hỗ trợ!</p>
                
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${process.env.CLIENT_URL}/profile/warranty/${warranty._id}" 
                       style="background: #2563eb; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
                        Xem chi tiết
                    </a>
                </div>
            </div>
        `;
        
        return await this.sendEmail(user.email, subject, html);
    }
    
    // Send welcome email
    async sendWelcomeEmail(user) {
        const subject = 'Chào mừng đến với Laptop Marketplace!';
        
        const html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #2563eb;">Chào mừng bạn!</h2>
                <p>Xin chào <strong>${user.username}</strong>,</p>
                <p>Cảm ơn bạn đã đăng ký tài khoản tại Laptop Marketplace!</p>
                
                <div style="background: #dbeafe; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h3>🎉 Bắt đầu mua sắm ngay!</h3>
                    <ul style="line-height: 1.8;">
                        <li>Hàng nghìn laptop chất lượng cao</li>
                        <li>Giá cả cạnh tranh, ưu đãi hấp dẫn</li>
                        <li>Bảo hành chính hãng</li>
                        <li>Giao hàng toàn quốc</li>
                    </ul>
                </div>
                
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${process.env.CLIENT_URL}/products" 
                       style="background: #2563eb; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
                        Khám phá ngay
                    </a>
                </div>
                
                <p>Chúc bạn có trải nghiệm mua sắm tuyệt vời!</p>
            </div>
        `;
        
        return await this.sendEmail(user.email, subject, html);
    }
}

// Helper functions
function strip(html) {
    return html.replace(/<[^>]*>?/gm, '');
}

function getStatusText(status) {
    const statusMap = {
        'pending': 'Chờ xác nhận',
        'confirmed': 'Đã xác nhận',
        'processing': 'Đang xử lý',
        'shipped': 'Đang giao hàng',
        'delivered': 'Đã giao hàng',
        'cancelled': 'Đã hủy',
        'refunded': 'Đã hoàn tiền'
    };
    return statusMap[status] || status;
}

// Export singleton instance
module.exports = new EmailService();
