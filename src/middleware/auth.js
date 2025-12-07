const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const auth = {
    // Require admin authentication
    requireAdmin: async (req, res, next) => {
        try {
            // Check session first
            if (req.session && req.session.adminId && req.session.isAdmin) {
                req.admin = { id: req.session.adminId };
                return next();
            }
            
            // Check JWT token as fallback
            const token = req.header('Authorization')?.replace('Bearer ', '');
            
            if (!token) {
                return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
            }
            
            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'ntandostore-secret-key');
            
            // Get admin from database
            const admin = await Admin.findById(decoded.id);
            
            if (!admin) {
                return res.status(401).json({ success: false, message: 'Invalid token.' });
            }
            
            req.admin = admin;
            next();
        } catch (error) {
            console.error('Auth middleware error:', error);
            res.status(401).json({ success: false, message: 'Invalid token.' });
        }
    },

    // Optional admin authentication (doesn't fail if not authenticated)
    optionalAdmin: async (req, res, next) => {
        try {
            // Check session first
            if (req.session && req.session.adminId && req.session.isAdmin) {
                req.admin = { id: req.session.adminId };
                return next();
            }
            
            // Check JWT token as fallback
            const token = req.header('Authorization')?.replace('Bearer ', '');
            
            if (!token) {
                return next();
            }
            
            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'ntandostore-secret-key');
            
            // Get admin from database
            const admin = await Admin.findById(decoded.id);
            
            if (admin) {
                req.admin = admin;
            }
            
            next();
        } catch (error) {
            // Continue without authentication
            next();
        }
    },

    // Rate limiting middleware
    rateLimit: (maxRequests = 100, windowMs = 15 * 60 * 1000) => {
        const requests = new Map();
        
        return (req, res, next) => {
            const ip = req.ip || req.connection.remoteAddress;
            const now = Date.now();
            const windowStart = now - windowMs;
            
            // Clean old requests
            for (const [key, value] of requests.entries()) {
                if (value.timestamp < windowStart) {
                    requests.delete(key);
                }
            }
            
            // Get current requests for this IP
            const ipRequests = Array.from(requests.values())
                .filter(r => r.ip === ip && r.timestamp > windowStart);
            
            if (ipRequests.length >= maxRequests) {
                return res.status(429).json({ 
                    success: false, 
                    message: 'Too many requests. Please try again later.' 
                });
            }
            
            // Add current request
            requests.set(now + Math.random(), { ip, timestamp: now });
            
            next();
        };
    },

    // Validate admin session
    validateAdminSession: (req, res, next) => {
        if (!req.session || !req.session.adminId || !req.session.isAdmin) {
            return res.status(401).json({ success: false, message: 'Session expired. Please login again.' });
        }
        next();
    },

    // Generate JWT token
    generateToken: (admin) => {
        return jwt.sign(
            { id: admin._id, username: admin.username },
            process.env.JWT_SECRET || 'ntandostore-secret-key',
            { expiresIn: '24h' }
        );
    },

    // Verify JWT token
    verifyToken: (token) => {
        try {
            return jwt.verify(token, process.env.JWT_SECRET || 'ntandostore-secret-key');
        } catch (error) {
            return null;
        }
    },

    // Logout middleware
    logout: (req, res, next) => {
        req.session.destroy();
        res.clearCookie('connect.sid');
        next();
    },

    // Security headers middleware
    securityHeaders: (req, res, next) => {
        // Set security headers
        res.setHeader('X-Content-Type-Options', 'nosniff');
        res.setHeader('X-Frame-Options', 'DENY');
        res.setHeader('X-XSS-Protection', '1; mode=block');
        res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
        res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self'; media-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self';");
        
        next();
    },

    // IP whitelist middleware (optional)
    ipWhitelist: (allowedIPs = []) => {
        return (req, res, next) => {
            const ip = req.ip || req.connection.remoteAddress;
            
            if (allowedIPs.length === 0 || allowedIPs.includes(ip)) {
                return next();
            }
            
            res.status(403).json({ success: false, message: 'Access denied from this IP.' });
        };
    },

    // Request logging middleware
    requestLogger: (req, res, next) => {
        const timestamp = new Date().toISOString();
        const ip = req.ip || req.connection.remoteAddress;
        const method = req.method;
        const url = req.url;
        
        console.log(`[${timestamp}] ${ip} ${method} ${url}`);
        
        // Log response when finished
        res.on('finish', () => {
            const statusCode = res.statusCode;
            console.log(`[${timestamp}] ${ip} ${method} ${url} - ${statusCode}`);
        });
        
        next();
    },

    // File upload validation
    validateFileUpload: (allowedTypes = [], maxSize = 10 * 1024 * 1024) => {
        return (req, res, next) => {
            if (!req.files || Object.keys(req.files).length === 0) {
                return next();
            }
            
            for (const [key, file] of Object.entries(req.files)) {
                // Check file size
                if (file.size > maxSize) {
                    return res.status(400).json({ 
                        success: false, 
                        message: `File ${file.name} is too large. Maximum size is ${maxSize / 1024 / 1024}MB.` 
                    });
                }
                
                // Check file type
                if (allowedTypes.length > 0 && !allowedTypes.includes(file.mimetype)) {
                    return res.status(400).json({ 
                        success: false, 
                        message: `File ${file.name} has invalid type. Allowed types: ${allowedTypes.join(', ')}.` 
                    });
                }
            }
            
            next();
        };
    }
};

module.exports = auth;