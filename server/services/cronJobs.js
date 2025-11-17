/**
 * CRON JOBS SERVICE
 * Các tác vụ tự động chạy theo lịch
 */

const cron = require('node-cron');
const { checkAllPriceAlerts } = require('../controllers/priceAlertController');
const { sendWarrantyReminders } = require('../controllers/warrantyController');
const Notification = require('../models/Notification');
const PriceAlert = require('../models/PriceAlert');
const Order = require('../models/Order');

class CronJobService {
    constructor() {
        this.jobs = [];
    }
    
    // Initialize all cron jobs
    init() {
        console.log('🕐 Initializing cron jobs...');
        
        // Check price alerts every 6 hours
        this.schedulePriceAlertCheck();
        
        // Send warranty reminders daily at 9 AM
        this.scheduleWarrantyReminders();
        
        // Clean up expired notifications daily at 2 AM
        this.scheduleNotificationCleanup();
        
        // Clean up expired price alerts daily at 3 AM
        this.schedulePriceAlertCleanup();
        
        // Send order review reminders daily at 10 AM
        this.scheduleOrderReviewReminders();
        
        // Update product statistics daily at 1 AM
        this.scheduleProductStatsUpdate();
        
        console.log('✅ Cron jobs initialized');
    }
    
    // Check price alerts every 6 hours
    schedulePriceAlertCheck() {
        const job = cron.schedule('0 */6 * * *', async () => {
            console.log('🔍 Running price alert check...');
            try {
                await checkAllPriceAlerts();
                console.log('✅ Price alert check completed');
            } catch (error) {
                console.error('❌ Price alert check failed:', error);
            }
        });
        
        this.jobs.push({ name: 'Price Alert Check', job });
    }
    
    // Send warranty reminders daily at 9 AM
    scheduleWarrantyReminders() {
        const job = cron.schedule('0 9 * * *', async () => {
            console.log('📧 Sending warranty reminders...');
            try {
                await sendWarrantyReminders();
                console.log('✅ Warranty reminders sent');
            } catch (error) {
                console.error('❌ Warranty reminders failed:', error);
            }
        });
        
        this.jobs.push({ name: 'Warranty Reminders', job });
    }
    
    // Clean up expired notifications daily at 2 AM
    scheduleNotificationCleanup() {
        const job = cron.schedule('0 2 * * *', async () => {
            console.log('🧹 Cleaning up expired notifications...');
            try {
                const result = await Notification.cleanupExpired();
                console.log(`✅ Deleted ${result.deletedCount} expired notifications`);
            } catch (error) {
                console.error('❌ Notification cleanup failed:', error);
            }
        });
        
        this.jobs.push({ name: 'Notification Cleanup', job });
    }
    
    // Clean up expired price alerts daily at 3 AM
    schedulePriceAlertCleanup() {
        const job = cron.schedule('0 3 * * *', async () => {
            console.log('🧹 Cleaning up expired price alerts...');
            try {
                const result = await PriceAlert.updateMany(
                    {
                        status: 'active',
                        expiresAt: { $lt: new Date() }
                    },
                    {
                        status: 'expired'
                    }
                );
                console.log(`✅ Expired ${result.modifiedCount} price alerts`);
            } catch (error) {
                console.error('❌ Price alert cleanup failed:', error);
            }
        });
        
        this.jobs.push({ name: 'Price Alert Cleanup', job });
    }
    
    // Send order review reminders daily at 10 AM
    scheduleOrderReviewReminders() {
        const job = cron.schedule('0 10 * * *', async () => {
            console.log('📧 Sending order review reminders...');
            try {
                // Find delivered orders from 3-7 days ago that haven't been reminded
                const threeDaysAgo = new Date();
                threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
                
                const sevenDaysAgo = new Date();
                sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
                
                const orders = await Order.find({
                    status: 'delivered',
                    'tracking.deliveredDate': {
                        $gte: sevenDaysAgo,
                        $lte: threeDaysAgo
                    },
                    reviewReminded: { $ne: true }
                }).populate('user', 'username email')
                  .populate('items.product', 'name');
                
                for (const order of orders) {
                    // Send notification
                    await Notification.createNotification({
                        user: order.user._id,
                        type: 'review_reminder',
                        title: '⭐ Đánh giá sản phẩm',
                        message: `Bạn đã nhận được đơn hàng #${order.orderNumber}. Hãy chia sẻ trải nghiệm của bạn!`,
                        relatedOrder: order._id,
                        actionUrl: `/orders/${order._id}`,
                        actionText: 'Đánh giá ngay',
                        priority: 'low'
                    });
                    
                    // Mark as reminded
                    order.reviewReminded = true;
                    await order.save();
                }
                
                console.log(`✅ Sent ${orders.length} review reminders`);
            } catch (error) {
                console.error('❌ Review reminders failed:', error);
            }
        });
        
        this.jobs.push({ name: 'Order Review Reminders', job });
    }
    
    // Update product statistics daily at 1 AM
    scheduleProductStatsUpdate() {
        const job = cron.schedule('0 1 * * *', async () => {
            console.log('📊 Updating product statistics...');
            try {
                const Product = require('../models/Product');
                const Review = require('../models/Review');
                
                // Update all products that need rating recalculation
                const products = await Product.find({});
                
                for (const product of products) {
                    await product.updateRating();
                }
                
                console.log(`✅ Updated statistics for ${products.length} products`);
            } catch (error) {
                console.error('❌ Product stats update failed:', error);
            }
        });
        
        this.jobs.push({ name: 'Product Stats Update', job });
    }
    
    // Stop all cron jobs
    stopAll() {
        console.log('⏹️ Stopping all cron jobs...');
        this.jobs.forEach(({ name, job }) => {
            job.stop();
            console.log(`  Stopped: ${name}`);
        });
    }
    
    // Get status of all jobs
    getStatus() {
        return this.jobs.map(({ name, job }) => ({
            name,
            running: job.running
        }));
    }
}

// Export singleton instance
module.exports = new CronJobService();
