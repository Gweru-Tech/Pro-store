const Service = require('../models/Service');
const fs = require('fs');
const path = require('path');

const serviceController = {
    // Get all services
    getServices: async (req, res) => {
        try {
            const services = await Service.find({ availability: 'in-stock' })
                .select('name description category price image features specifications')
                .sort({ createdAt: -1 });
            
            res.json({ success: true, services });
        } catch (error) {
            console.error('Error getting services:', error);
            res.status(500).json({ success: false, message: 'Error retrieving services' });
        }
    },

    // Get service by ID
    getServiceById: async (req, res) => {
        try {
            const service = await Service.findById(req.params.id);
            
            if (!service) {
                return res.status(404).json({ success: false, message: 'Service not found' });
            }
            
            res.json({ success: true, service });
        } catch (error) {
            console.error('Error getting service:', error);
            res.status(500).json({ success: false, message: 'Error retrieving service' });
        }
    },

    // Get all services (admin)
    getAllServices: async (req, res) => {
        try {
            const services = await Service.find().sort({ createdAt: -1 });
            res.json({ success: true, services });
        } catch (error) {
            console.error('Error getting all services:', error);
            res.status(500).json({ success: false, message: 'Error retrieving services' });
        }
    },

    // Create new service
    createService: async (req, res) => {
        try {
            const { name, description, category, price, features } = req.body;
            
            // Handle file upload
            let imagePath = '';
            
            if (req.files && req.files.image) {
                const image = req.files.image;
                imagePath = `/uploads/services/${Date.now()}_${image.name}`;
                image.mv(path.join(__dirname, '../../public', imagePath));
            }
            
            const service = new Service({
                name,
                description,
                category,
                price,
                image: imagePath,
                features: features ? features.split('\n').filter(f => f.trim()) : [],
                availability: 'in-stock'
            });
            
            await service.save();
            
            res.json({ success: true, message: 'Service created successfully', service });
        } catch (error) {
            console.error('Error creating service:', error);
            res.status(500).json({ success: false, message: 'Error creating service' });
        }
    },

    // Update service
    updateService: async (req, res) => {
        try {
            const service = await Service.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true }
            );
            
            if (!service) {
                return res.status(404).json({ success: false, message: 'Service not found' });
            }
            
            res.json({ success: true, message: 'Service updated successfully', service });
        } catch (error) {
            console.error('Error updating service:', error);
            res.status(500).json({ success: false, message: 'Error updating service' });
        }
    },

    // Delete service
    deleteService: async (req, res) => {
        try {
            const service = await Service.findByIdAndDelete(req.params.id);
            
            if (!service) {
                return res.status(404).json({ success: false, message: 'Service not found' });
            }
            
            // Delete associated image
            if (service.image) {
                const imagePath = path.join(__dirname, '../../public', service.image);
                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                }
            }
            
            res.json({ success: true, message: 'Service deleted successfully' });
        } catch (error) {
            console.error('Error deleting service:', error);
            res.status(500).json({ success: false, message: 'Error deleting service' });
        }
    },

    // Get services by category
    getServicesByCategory: async (req, res) => {
        try {
            const { category } = req.params;
            const services = await Service.find({ 
                category, 
                availability: 'in-stock' 
            }).sort({ createdAt: -1 });
            
            res.json({ success: true, services });
        } catch (error) {
            console.error('Error getting services by category:', error);
            res.status(500).json({ success: false, message: 'Error retrieving services' });
        }
    },

    // Search services
    searchServices: async (req, res) => {
        try {
            const { query } = req.query;
            
            const services = await Service.find({
                $and: [
                    { availability: 'in-stock' },
                    {
                        $or: [
                            { name: { $regex: query, $options: 'i' } },
                            { description: { $regex: query, $options: 'i' } },
                            { category: { $regex: query, $options: 'i' } }
                        ]
                    }
                ]
            }).sort({ createdAt: -1 });
            
            res.json({ success: true, services });
        } catch (error) {
            console.error('Error searching services:', error);
            res.status(500).json({ success: false, message: 'Error searching services' });
        }
    }
};

module.exports = serviceController;