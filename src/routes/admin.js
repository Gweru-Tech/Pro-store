const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const auth = require('../middleware/auth');
const multer = require('multer');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (file.fieldname === 'music') {
            cb(null, 'public/uploads/music/');
        } else if (file.fieldname === 'image') {
            cb(null, 'public/uploads/services/');
        } else if (file.fieldname === 'script') {
            cb(null, 'public/uploads/courses/');
        } else if (file.fieldname === 'thumbnail') {
            cb(null, 'public/uploads/courses/thumbnails/');
        }
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '_' + file.originalname);
    }
});

const upload = multer({ storage: storage });

// Admin login page
router.get('/login', (req, res) => {
    if (req.session && req.session.adminId) {
        return res.redirect('/admin');
    }
    res.render('admin/login');
});

// Admin login POST
router.post('/login', adminController.login);

// Admin logout
router.get('/logout', auth.logout, (req, res) => {
    res.redirect('/admin/login');
});

// Admin dashboard (protected)
router.get('/', auth.requireAdmin, (req, res) => {
    res.render('admin/dashboard', {
        admin: req.admin,
        visitorCount: res.locals.visitorCount || 0,
        uptime: res.locals.uptime || 0
    });
});

// Admin settings pages
router.get('/settings', auth.requireAdmin, (req, res) => {
    res.render('admin/settings');
});

router.get('/courses', auth.requireAdmin, (req, res) => {
    res.render('admin/courses');
});

router.get('/services', auth.requireAdmin, (req, res) => {
    res.render('admin/services');
});

router.get('/messages', auth.requireAdmin, (req, res) => {
    res.render('admin/messages');
});

router.get('/ads', auth.requireAdmin, (req, res) => {
    res.render('admin/ads');
});

router.get('/analytics', auth.requireAdmin, (req, res) => {
    res.render('admin/analytics');
});

// File upload routes (protected)
router.post('/upload/course', auth.requireAdmin, upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    
    res.json({ 
        success: true, 
        filename: req.file.filename,
        path: `/uploads/courses/${req.file.filename}`
    });
});

router.post('/upload/service', auth.requireAdmin, upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: 'No image uploaded' });
    }
    
    res.json({ 
        success: true, 
        filename: req.file.filename,
        path: `/uploads/services/${req.file.filename}`
    });
});

router.post('/upload/ad', auth.requireAdmin, upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: 'No image uploaded' });
    }
    
    res.json({ 
        success: true, 
        filename: req.file.filename,
        path: `/uploads/ads/${req.file.filename}`
    });
});

router.post('/upload/music', auth.requireAdmin, upload.single('music'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: 'No music file uploaded' });
    }
    
    res.json({ 
        success: true, 
        filename: req.file.filename,
        path: `/uploads/music/${req.file.filename}`
    });
});

// Admin statistics API
router.get('/api/stats', auth.requireAdmin, adminController.getStats);

// Music settings API
router.get('/api/music', auth.requireAdmin, adminController.getMusicSettings);
router.post('/api/music', auth.requireAdmin, upload.single('music'), adminController.updateMusicSettings);

// General settings API
router.post('/api/settings', auth.requireAdmin, adminController.updateSettings);

module.exports = router;