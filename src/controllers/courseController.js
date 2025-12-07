const Course = require('../models/Course');
const fs = require('fs');
const path = require('path');

const courseController = {
    // Get all published courses
    getCourses: async (req, res) => {
        try {
            const courses = await Course.find({ isPublished: true })
                .select('title description category price duration level instructor thumbnail tags')
                .sort({ createdAt: -1 });
            
            res.json({ success: true, courses });
        } catch (error) {
            console.error('Error getting courses:', error);
            res.status(500).json({ success: false, message: 'Error retrieving courses' });
        }
    },

    // Get course by ID
    getCourseById: async (req, res) => {
        try {
            const course = await Course.findById(req.params.id);
            
            if (!course) {
                return res.status(404).json({ success: false, message: 'Course not found' });
            }
            
            res.json({ success: true, course });
        } catch (error) {
            console.error('Error getting course:', error);
            res.status(500).json({ success: false, message: 'Error retrieving course' });
        }
    },

    // Get all courses (admin)
    getAllCourses: async (req, res) => {
        try {
            const courses = await Course.find().sort({ createdAt: -1 });
            res.json({ success: true, courses });
        } catch (error) {
            console.error('Error getting all courses:', error);
            res.status(500).json({ success: false, message: 'Error retrieving courses' });
        }
    },

    // Create new course
    createCourse: async (req, res) => {
        try {
            const { title, description, category, price, duration, level, instructor, tags } = req.body;
            
            // Handle file uploads
            let scriptPath = '';
            let thumbnailPath = '';
            
            if (req.files) {
                if (req.files.script) {
                    const script = req.files.script;
                    scriptPath = `/uploads/courses/${Date.now()}_${script.name}`;
                    script.mv(path.join(__dirname, '../../public', scriptPath));
                }
                
                if (req.files.thumbnail) {
                    const thumbnail = req.files.thumbnail;
                    thumbnailPath = `/uploads/courses/thumbnails/${Date.now()}_${thumbnail.name}`;
                    thumbnail.mv(path.join(__dirname, '../../public', thumbnailPath));
                }
            }
            
            const course = new Course({
                title,
                description,
                category,
                price,
                script: scriptPath,
                scriptType: 'text', // Determine based on file extension
                duration,
                level,
                instructor,
                thumbnail: thumbnailPath,
                tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
                isPublished: false
            });
            
            await course.save();
            
            res.json({ success: true, message: 'Course created successfully', course });
        } catch (error) {
            console.error('Error creating course:', error);
            res.status(500).json({ success: false, message: 'Error creating course' });
        }
    },

    // Update course
    updateCourse: async (req, res) => {
        try {
            const course = await Course.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true }
            );
            
            if (!course) {
                return res.status(404).json({ success: false, message: 'Course not found' });
            }
            
            res.json({ success: true, message: 'Course updated successfully', course });
        } catch (error) {
            console.error('Error updating course:', error);
            res.status(500).json({ success: false, message: 'Error updating course' });
        }
    },

    // Delete course
    deleteCourse: async (req, res) => {
        try {
            const course = await Course.findByIdAndDelete(req.params.id);
            
            if (!course) {
                return res.status(404).json({ success: false, message: 'Course not found' });
            }
            
            // Delete associated files
            if (course.script) {
                const scriptPath = path.join(__dirname, '../../public', course.script);
                if (fs.existsSync(scriptPath)) {
                    fs.unlinkSync(scriptPath);
                }
            }
            
            if (course.thumbnail) {
                const thumbnailPath = path.join(__dirname, '../../public', course.thumbnail);
                if (fs.existsSync(thumbnailPath)) {
                    fs.unlinkSync(thumbnailPath);
                }
            }
            
            res.json({ success: true, message: 'Course deleted successfully' });
        } catch (error) {
            console.error('Error deleting course:', error);
            res.status(500).json({ success: false, message: 'Error deleting course' });
        }
    },

    // Enroll student in course
    enrollStudent: async (req, res) => {
        try {
            const course = await Course.findById(req.params.id);
            
            if (!course) {
                return res.status(404).json({ success: false, message: 'Course not found' });
            }
            
            // Add student to enrolled list (simplified)
            course.enrolledStudents.push(req.user.id);
            await course.save();
            
            res.json({ success: true, message: 'Enrolled successfully' });
        } catch (error) {
            console.error('Error enrolling student:', error);
            res.status(500).json({ success: false, message: 'Error enrolling student' });
        }
    },

    // Add course review
    addReview: async (req, res) => {
        try {
            const { rating, comment } = req.body;
            const course = await Course.findById(req.params.id);
            
            if (!course) {
                return res.status(404).json({ success: false, message: 'Course not found' });
            }
            
            const review = {
                user: req.user.id,
                rating,
                comment,
                date: new Date()
            };
            
            course.reviews.push(review);
            
            // Update average rating
            const avgRating = course.reviews.reduce((sum, review) => sum + review.rating, 0) / course.reviews.length;
            course.rating = Math.round(avgRating * 10) / 10;
            
            await course.save();
            
            res.json({ success: true, message: 'Review added successfully' });
        } catch (error) {
            console.error('Error adding review:', error);
            res.status(500).json({ success: false, message: 'Error adding review' });
        }
    }
};

module.exports = courseController;