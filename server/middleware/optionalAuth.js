const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Optional authentication middleware
 * Allows both authenticated and anonymous users
 * For authenticated users, sets req.user
 * For anonymous users, sets req.anonymousId from session or creates new one
 */
const optionalAuth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (token) {
            // Try to authenticate
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                const user = await User.findById(decoded.id).select('-password');
                
                if (user) {
                    req.user = user;
                    req.isAuthenticated = true;
                    return next();
                }
            } catch (err) {
                // Token invalid, treat as anonymous
                console.log('Invalid token, treating as anonymous user');
            }
        }
        
        // No token or invalid token - treat as anonymous user
        req.isAuthenticated = false;
        
        // Get or create anonymous ID from session/header
        const anonymousId = req.header('X-Anonymous-Id') || 
                           req.session?.anonymousId || 
                           `anon_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        req.anonymousId = anonymousId;
        req.anonymousName = req.header('X-Anonymous-Name') || 'Khách';
        
        // Save anonymous ID to session if available
        if (req.session) {
            req.session.anonymousId = anonymousId;
        }
        
        next();
    } catch (error) {
        console.error('Optional auth error:', error);
        // Even on error, allow anonymous access
        req.isAuthenticated = false;
        req.anonymousId = `anon_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        req.anonymousName = 'Khách';
        next();
    }
};

module.exports = optionalAuth;
