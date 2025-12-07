const Admin = require('../models/Admin');
const SiteSetting = require('../models/SiteSetting');
const Course = require('../models/Course');
const Service = require('../models/Service');
const Message = require('../models/Message');
const Advertisement = require('../models/Advertisement');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const adminController = {
    // Login admin
    login: async (req, res) => {
        try {
            const { username, password } = req.body;
            
            // Find admin by username
            const admin = await Admin.findOne({ username });
            
            if (!admin) {
                return res.status(401).json({ success: false, message: 'Invalid credentials' });
            }
            
            // Compare password
            const isMatch = await admin.comparePassword(password);
            
            if (!isMatch) {
                return res.status(401).json({ success: false, message: 'Invalid credentials' });
            }
            
            // Update last login
            admin.lastLogin = new Date();
            await admin.save();
            
            // Create JWT token
            const token = jwt.sign(
                { id: admin._id, username: admin.username },
                process.env.JWT_SECRET || 'ntandostore-secret-key',
                { expiresIn: '24h' }
            );
            
            // Set session
            req.session.adminId = admin._id;
            req.session.isAdmin = true;
            
            res.json({ 
                success: true, 
                message: 'Login successful',
                token,
                admin: {
                    id: admin._id,
                    username: admin.username,
                    email: admin.email
                }
            });
        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({ success: false, message: 'Login failed' });
        }
    },

    // Logout admin
    logout: (req, res) => {
        req.session.destroy();
        res.json({ success: true, message: 'Logout successful' });
    },

    // Get dashboard stats
    getStats: async (req, res) => {
        try {
            const stats = await Promise.all([
                Course.countDocuments(),
                Service.countDocuments(),
                Message.countDocuments({ status: 'unread' }),
                Advertisement.countDocuments({ isActive: true })
            ]);
            
            res.json({
                success: true,
                courses: stats[0],
                services: stats[1],
                unreadMessages: stats[2],
                activeAds: stats[3],
                visitors: global.visitorCount || 0
            });
        } catch (error) {
            console.error('Error getting stats:', error);
            res.status(500).json({ success: false, message: 'Error retrieving stats' });
        }
    },

    // Update music settings
    updateMusicSettings: async (req, res) => {
        try {
            let musicPath = '';
            
            // Handle file upload
            if (req.files && req.files.music) {
                const music = req.files.music;
                musicPath = `/uploads/music/${Date.now()}_${music.name}`;
                music.mv(path.join(__dirname, '../../public', musicPath));
            }
            
            // Get or create site settings
            let settings = await SiteSetting.findOne();
            if (!settings) {
                settings = new SiteSetting();
            }
            
            // Update music settings
            if (musicPath) {
                settings.backgroundMusic.file = musicPath;
            }
            
            settings.backgroundMusic.isActive = req.body.isActive === 'true';
            settings.backgroundMusic.volume = parseInt(req.body.volume) || 50;
            
            await settings.save();
            
            res.json({ success: true, message: 'Music settings updated successfully' });
        } catch (error) {
            console.error('Error updating music settings:', error);
            res.status(500).json({ success: false, message: 'Error updating music settings' });
        }
    },

    // Get music settings
    getMusicSettings: async (req, res) => {
        try {
            const settings = await SiteSetting.findOne();
            
            if (!settings) {
                return res.json({ success: true, music: null });
            }
            
            res.json({ 
                success: true, 
                music: settings.backgroundMusic 
            });
        } catch (error) {
            console.error('Error getting music settings:', error);
            res.status(500).json({ success: false, message: 'Error retrieving music settings' });
        }
    },

    // Update volume
    updateVolume: async (req, res) => {
        try {
            const { volume } = req.body;
            
            const settings = await SiteSetting.findOne();
            if (settings) {
                settings.backgroundMusic.volume = volume;
                await settings.save();
            }
            
            res.json({ success: true });
        } catch (error) {
            console.error('Error updating volume:', error);
            res.status(500).json({ success: false, message: 'Error updating volume' });
        }
    },

    // Update general settings
    updateSettings: async (req, res) => {
        try {
            const {
                siteName,
                contactEmail,
                contactPhone,
                address,
                maintenance,
                maintenanceMessage
            } = req.body;
            
            // Get or create site settings
            let settings = await SiteSetting.findOne();
            if (!settings) {
                settings = new SiteSetting();
            }
            
            // Update settings
            settings.siteName = siteName || settings.siteName;
            settings.contactEmail = contactEmail || settings.contactEmail;
            settings.contactPhone = contactPhone || settings.contactPhone;
            settings.address = address || settings.address;
            settings.maintenance.isActive = maintenance === 'true';
            settings.maintenance.message = maintenanceMessage || '';
            
            await settings.save();
            
            res.json({ success: true, message: 'Settings updated successfully' });
        } catch (error) {
            console.error('Error updating settings:', error);
            res.status(500).json({ success: false, message: 'Error updating settings' });
        }
    },

    // Initialize admin user
    initializeAdmin: async () => {
        try {
            const existingAdmin = await Admin.findOne({ username: 'Ntando' });
            
            if (!existingAdmin) {
                const admin = new Admin({
                    username: 'Ntando',
                    password: 'Ntando',
                    email: 'admin@ntandostore.com'
                });
                
                await admin.save();
                console.log('Admin user created successfully');
            }
        } catch (error) {
            console.error('Error initializing admin:', error);
        }
    },

    // Initialize site settings
    initializeSettings: async () => {
        try {
            const existingSettings = await SiteSetting.findOne();
            
            if (!existingSettings) {
                const settings = new SiteSetting({
                    siteName: 'NtandoStore v7',
                    siteVersion: '7.0.0',
                    contactEmail: 'info@ntandostore.com',
                    contactPhone: '+1234567890',
                    address: '123 Business Ave, Tech City, TC 12345'
                });
                
                await settings.save();
                console.log('Site settings initialized successfully');
            }
        } catch (error) {
            console.error('Error initializing settings:', error);
        }
    }
};

module.exports = adminController;