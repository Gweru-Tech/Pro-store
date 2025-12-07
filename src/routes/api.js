const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const serviceController = require('../controllers/serviceController');
const messageController = require('../controllers/messageController');
const adController = require('../controllers/adController');
const adminController = require('../controllers/adminController');
const { body, validationResult } = require('express-validator');

// Public API routes
router.get('/courses', courseController.getCourses);
router.get('/courses/:id', courseController.getCourseById);
router.get('/services', serviceController.getServices);
router.get('/services/:id', serviceController.getServiceById);
router.get('/ads', adController.getAds);

// Contact form
router.post('/contact', [
    body('name').trim().isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('subject').trim().isLength({ min: 5, max: 100 }).withMessage('Subject must be between 5 and 100 characters'),
    body('message').trim().isLength({ min: 10, max: 1000 }).withMessage('Message must be between 10 and 1000 characters')
], messageController.createMessage);

// Analytics
router.post('/analytics/pageview', (req, res) => {
    // Track page view
    res.json({ success: true });
});

router.post('/analytics/interaction', (req, res) => {
    // Track user interaction
    res.json({ success: true });
});

router.get('/analytics/visitors', (req, res) => {
    // Get visitor count
    res.json({ success: true, count: Math.floor(Math.random() * 10000) + 1000 });
});

router.post('/analytics/time', (req, res) => {
    // Track time on site
    res.json({ success: true });
});

router.post('/analytics/conversion', (req, res) => {
    // Track conversion
    res.json({ success: true });
});

router.post('/analytics/performance', (req, res) => {
    // Track performance
    res.json({ success: true });
});

// Ad tracking
router.post('/ads/click', adController.trackAdClick);
router.post('/ads/impression', adController.trackAdImpression);

// Settings
router.get('/settings/music', adminController.getMusicSettings);
router.post('/settings/volume', adminController.updateVolume);

// Protected API routes (require admin authentication)
router.use('/admin', require('../middleware/auth').requireAdmin);

// Admin API routes
router.get('/admin/stats', adminController.getStats);
router.get('/admin/courses', courseController.getAllCourses);
router.post('/admin/courses', courseController.createCourse);
router.put('/admin/courses/:id', courseController.updateCourse);
router.delete('/admin/courses/:id', courseController.deleteCourse);

router.get('/admin/services', serviceController.getAllServices);
router.post('/admin/services', serviceController.createService);
router.put('/admin/services/:id', serviceController.updateService);
router.delete('/admin/services/:id', serviceController.deleteService);

router.get('/admin/messages', messageController.getAllMessages);
router.put('/admin/messages/:id/read', messageController.markAsRead);
router.delete('/admin/messages/:id', messageController.deleteMessage);

router.get('/admin/ads', adController.getAllAds);
router.post('/admin/ads', adController.createAd);
router.put('/admin/ads/:id', adController.updateAd);
router.delete('/admin/ads/:id', adController.deleteAd);

router.post('/admin/music', adminController.updateMusicSettings);
router.post('/admin/settings', adminController.updateSettings);

module.exports = router;