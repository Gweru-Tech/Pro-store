const express = require('express');
const router = express.Router();

// Home page
router.get('/', (req, res) => {
    res.render('index', {
        visitorCount: res.locals.visitorCount || 0,
        uptime: res.locals.uptime || 0,
        startTime: res.locals.startTime || new Date()
    });
});

// Services page
router.get('/services', (req, res) => {
    res.render('services');
});

// Domains page
router.get('/domains', (req, res) => {
    res.render('domains');
});

// Hosting page
router.get('/hosting', (req, res) => {
    res.render('hosting');
});

// Development page
router.get('/development', (req, res) => {
    res.render('development');
});

// Courses page
router.get('/courses', (req, res) => {
    res.render('courses');
});

// Apps page
router.get('/apps', (req, res) => {
    res.render('apps');
});

// Numbers page
router.get('/numbers', (req, res) => {
    res.render('numbers');
});

// About page
router.get('/about', (req, res) => {
    res.render('about');
});

// Contact page
router.get('/contact', (req, res) => {
    res.render('contact');
});

// Privacy policy
router.get('/privacy', (req, res) => {
    res.render('privacy');
});

// Terms of service
router.get('/terms', (req, res) => {
    res.render('terms');
});

// FAQ page
router.get('/faq', (req, res) => {
    res.render('faq');
});

// Blog page
router.get('/blog', (req, res) => {
    res.render('blog');
});

// Careers page
router.get('/careers', (req, res) => {
    res.render('careers');
});

// Partners page
router.get('/partners', (req, res) => {
    res.render('partners');
});

// Help center
router.get('/help', (req, res) => {
    res.render('help');
});

// API documentation
router.get('/api', (req, res) => {
    res.render('api-docs');
});

// System status
router.get('/status', (req, res) => {
    res.json({
        status: 'operational',
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        timestamp: new Date().toISOString()
    });
});

// Sitemap
router.get('/sitemap.xml', (req, res) => {
    res.set('Content-Type', 'application/xml');
    res.render('sitemap');
});

// Robots.txt
router.get('/robots.txt', (req, res) => {
    res.set('Content-Type', 'text/plain');
    res.send(`User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/admin/
Sitemap: https://ntandostore.com/sitemap.xml`);
});

module.exports = router;