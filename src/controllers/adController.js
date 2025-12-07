const Advertisement = require('../models/Advertisement');
const fs = require('fs');
const path = require('path');

const adController = {
    // Get all active ads
    getAds: async (req, res) => {
        try {
            const ads = await Advertisement.find({ 
                isActive: true,
                $or: [
                    { endDate: { $exists: false } },
                    { endDate: { $gt: new Date() } }
                ]
            }).sort({ createdAt: -1 });
            
            res.json({ success: true, ads });
        } catch (error) {
            console.error('Error getting ads:', error);
            res.status(500).json({ success: false, message: 'Error retrieving advertisements' });
        }
    },

    // Get all ads (admin)
    getAllAds: async (req, res) => {
        try {
            const ads = await Advertisement.find().sort({ createdAt: -1 });
            res.json({ success: true, ads });
        } catch (error) {
            console.error('Error getting all ads:', error);
            res.status(500).json({ success: false, message: 'Error retrieving advertisements' });
        }
    },

    // Create new ad
    createAd: async (req, res) => {
        try {
            const { title, description, link, position, startDate, endDate } = req.body;
            
            // Handle file upload
            let imagePath = '';
            
            if (req.files && req.files.image) {
                const image = req.files.image;
                imagePath = `/uploads/ads/${Date.now()}_${image.name}`;
                image.mv(path.join(__dirname, '../../public', imagePath));
            }
            
            const advertisement = new Advertisement({
                title,
                description,
                image: imagePath,
                link,
                position,
                startDate: startDate ? new Date(startDate) : new Date(),
                endDate: endDate ? new Date(endDate) : undefined,
                isActive: true,
                clicks: 0,
                impressions: 0
            });
            
            await advertisement.save();
            
            res.json({ success: true, message: 'Advertisement created successfully', advertisement });
        } catch (error) {
            console.error('Error creating ad:', error);
            res.status(500).json({ success: false, message: 'Error creating advertisement' });
        }
    },

    // Update ad
    updateAd: async (req, res) => {
        try {
            const advertisement = await Advertisement.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true }
            );
            
            if (!advertisement) {
                return res.status(404).json({ success: false, message: 'Advertisement not found' });
            }
            
            res.json({ success: true, message: 'Advertisement updated successfully', advertisement });
        } catch (error) {
            console.error('Error updating ad:', error);
            res.status(500).json({ success: false, message: 'Error updating advertisement' });
        }
    },

    // Delete ad
    deleteAd: async (req, res) => {
        try {
            const advertisement = await Advertisement.findByIdAndDelete(req.params.id);
            
            if (!advertisement) {
                return res.status(404).json({ success: false, message: 'Advertisement not found' });
            }
            
            // Delete associated image
            if (advertisement.image) {
                const imagePath = path.join(__dirname, '../../public', advertisement.image);
                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                }
            }
            
            res.json({ success: true, message: 'Advertisement deleted successfully' });
        } catch (error) {
            console.error('Error deleting ad:', error);
            res.status(500).json({ success: false, message: 'Error deleting advertisement' });
        }
    },

    // Track ad click
    trackAdClick: async (req, res) => {
        try {
            const { adId } = req.body;
            
            await Advertisement.findByIdAndUpdate(
                adId,
                { $inc: { clicks: 1 } }
            );
            
            res.json({ success: true });
        } catch (error) {
            console.error('Error tracking ad click:', error);
            res.status(500).json({ success: false, message: 'Error tracking click' });
        }
    },

    // Track ad impression
    trackAdImpression: async (req, res) => {
        try {
            const { adId } = req.body;
            
            await Advertisement.findByIdAndUpdate(
                adId,
                { $inc: { impressions: 1 } }
            );
            
            res.json({ success: true });
        } catch (error) {
            console.error('Error tracking ad impression:', error);
            res.status(500).json({ success: false, message: 'Error tracking impression' });
        }
    },

    // Toggle ad status
    toggleAdStatus: async (req, res) => {
        try {
            const advertisement = await Advertisement.findById(req.params.id);
            
            if (!advertisement) {
                return res.status(404).json({ success: false, message: 'Advertisement not found' });
            }
            
            advertisement.isActive = !advertisement.isActive;
            await advertisement.save();
            
            res.json({ 
                success: true, 
                message: `Advertisement ${advertisement.isActive ? 'activated' : 'deactivated'} successfully`,
                isActive: advertisement.isActive
            });
        } catch (error) {
            console.error('Error toggling ad status:', error);
            res.status(500).json({ success: false, message: 'Error updating advertisement' });
        }
    },

    // Get ad statistics
    getAdStats: async (req, res) => {
        try {
            const adId = req.params.id;
            const ad = await Advertisement.findById(adId);
            
            if (!ad) {
                return res.status(404).json({ success: false, message: 'Advertisement not found' });
            }
            
            // Calculate click-through rate
            const ctr = ad.impressions > 0 ? (ad.clicks / ad.impressions * 100).toFixed(2) : 0;
            
            res.json({
                success: true,
                stats: {
                    clicks: ad.clicks,
                    impressions: ad.impressions,
                    ctr: ctr + '%',
                    startDate: ad.startDate,
                    endDate: ad.endDate,
                    isActive: ad.isActive
                }
            });
        } catch (error) {
            console.error('Error getting ad stats:', error);
            res.status(500).json({ success: false, message: 'Error retrieving statistics' });
        }
    },

    // Get ads by position
    getAdsByPosition: async (req, res) => {
        try {
            const { position } = req.params;
            
            const ads = await Advertisement.find({ 
                position,
                isActive: true,
                $or: [
                    { endDate: { $exists: false } },
                    { endDate: { $gt: new Date() } }
                ]
            }).sort({ createdAt: -1 });
            
            res.json({ success: true, ads });
        } catch (error) {
            console.error('Error getting ads by position:', error);
            res.status(500).json({ success: false, message: 'Error retrieving advertisements' });
        }
    }
};

module.exports = adController;