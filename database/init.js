const mongoose = require('mongoose');
const Admin = require('../src/models/Admin');
const SiteSetting = require('../src/models/SiteSetting');
const Service = require('../src/models/Service');
const Course = require('../src/models/Course');
const Advertisement = require('../src/models/Advertisement');

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ntandostore-v7', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const initializeDatabase = async () => {
    try {
        console.log('🚀 Initializing NtandoStore v7 Database...');
        
        // Clear existing data (for development)
        if (process.env.NODE_ENV === 'development') {
            console.log('📋 Clearing existing data...');
            await Admin.deleteMany({});
            await SiteSetting.deleteMany({});
            await Service.deleteMany({});
            await Course.deleteMany({});
            await Advertisement.deleteMany({});
        }
        
        // Initialize Admin User
        console.log('👤 Creating admin user...');
        const existingAdmin = await Admin.findOne({ username: 'Ntando' });
        
        if (!existingAdmin) {
            const admin = new Admin({
                username: 'Ntando',
                password: 'Ntando',
                email: 'admin@ntandostore.com',
                role: 'admin'
            });
            await admin.save();
            console.log('✅ Admin user created successfully');
        } else {
            console.log('✅ Admin user already exists');
        }
        
        // Initialize Site Settings
        console.log('⚙️ Creating site settings...');
        const existingSettings = await SiteSetting.findOne();
        
        if (!existingSettings) {
            const settings = new SiteSetting({
                siteName: 'NtandoStore v7',
                siteVersion: '7.0.0',
                contactEmail: 'info@ntandostore.com',
                contactPhone: '+1234567890',
                address: '123 Business Ave, Tech City, TC 12345',
                socialLinks: {
                    facebook: 'https://facebook.com/ntandostore',
                    twitter: 'https://twitter.com/ntandostore',
                    instagram: 'https://instagram.com/ntandostore',
                    youtube: 'https://youtube.com/ntandostore',
                    linkedin: 'https://linkedin.com/company/ntandostore'
                },
                analytics: {
                    googleAnalyticsId: 'GA_MEASUREMENT_ID',
                    facebookPixelId: 'YOUR_FACEBOOK_PIXEL_ID'
                }
            });
            await settings.save();
            console.log('✅ Site settings created successfully');
        } else {
            console.log('✅ Site settings already exist');
        }
        
        // Initialize Default Services
        console.log('🛠️ Creating default services...');
        const existingServices = await Service.find();
        
        if (existingServices.length === 0) {
            const defaultServices = [
                {
                    name: 'Premium Domain Registration',
                    description: 'Get your perfect domain name with instant registration and free DNS management',
                    category: 'domain',
                    price: 9.99,
                    image: '/uploads/services/domain.jpg',
                    features: [
                        '.com, .net, .org extensions available',
                        'Free WHOIS privacy protection',
                        'Instant DNS activation',
                        '24/7 technical support',
                        'Domain forwarding included',
                        'Email forwarding included'
                    ],
                    availability: 'in-stock',
                    popular: true,
                    featured: true
                },
                {
                    name: 'Professional Web Hosting',
                    description: 'Lightning-fast hosting with 99.9% uptime guarantee and SSD storage',
                    category: 'hosting',
                    price: 4.99,
                    image: '/uploads/services/hosting.jpg',
                    features: [
                        'SSD NVMe storage',
                        'Free SSL certificate',
                        '1-click WordPress installation',
                        'Daily automated backups',
                        'Unlimited bandwidth',
                        '99.9% uptime guarantee'
                    ],
                    availability: 'in-stock',
                    popular: true,
                    featured: true
                },
                {
                    name: 'Custom Website Development',
                    description: 'Professional custom websites built with modern technologies and best practices',
                    category: 'development',
                    price: 299,
                    image: '/uploads/services/development.jpg',
                    features: [
                        'Fully responsive design',
                        'SEO optimized structure',
                        'Mobile-first approach',
                        'Custom functionality',
                        'Content management system',
                        '6 months support included'
                    ],
                    availability: 'in-stock',
                    popular: false,
                    featured: true
                },
                {
                    name: 'Premium Mobile Apps',
                    description: 'High-quality premium applications for various platforms and purposes',
                    category: 'apps',
                    price: 19.99,
                    image: '/uploads/services/apps.jpg',
                    features: [
                        'iOS and Android apps',
                        'Full source code included',
                        'White-label license',
                        'Documentation included',
                        '6 months updates',
                        'Priority support'
                    ],
                    availability: 'in-stock',
                    popular: false,
                    featured: false
                },
                {
                    name: 'Virtual Foreign Numbers',
                    description: 'Get virtual phone numbers from over 50 countries worldwide',
                    category: 'numbers',
                    price: 2.99,
                    image: '/uploads/services/numbers.jpg',
                    features: [
                        '50+ countries available',
                        'SMS and call forwarding',
                        'API access included',
                        'Instant setup',
                        'No contracts',
                        'Cancel anytime'
                    ],
                    availability: 'in-stock',
                    popular: false,
                    featured: false
                },
                {
                    name: 'Premium Online Courses',
                    description: 'High-quality educational content with lifetime access and certificates',
                    category: 'courses',
                    price: 29.99,
                    image: '/uploads/services/courses.jpg',
                    features: [
                        'Lifetime access guaranteed',
                        'Certificate of completion',
                        'Expert instructors',
                        'Regular content updates',
                        'Downloadable resources',
                        '30-day money-back guarantee'
                    ],
                    availability: 'in-stock',
                    popular: true,
                    featured: true
                }
            ];
            
            await Service.insertMany(defaultServices);
            console.log('✅ Default services created successfully');
        } else {
            console.log('✅ Services already exist');
        }
        
        // Initialize Sample Courses
        console.log('📚 Creating sample courses...');
        const existingCourses = await Course.find();
        
        if (existingCourses.length === 0) {
            const sampleCourses = [
                {
                    title: 'Complete Web Development Bootcamp 2024',
                    description: 'Learn web development from scratch with HTML, CSS, JavaScript, React, Node.js and more',
                    category: 'programming',
                    price: 89.99,
                    script: '/uploads/courses/web-dev-course.pdf',
                    scriptType: 'pdf',
                    duration: '40 hours',
                    level: 'beginner',
                    instructor: 'Ntando Mods',
                    thumbnail: '/uploads/courses/thumbnails/web-dev.jpg',
                    tags: ['web', 'javascript', 'react', 'nodejs', 'fullstack'],
                    isPublished: true,
                    isPremium: true
                },
                {
                    title: 'Advanced React & Redux Masterclass',
                    description: 'Master React.js and Redux with real-world projects and best practices',
                    category: 'programming',
                    price: 69.99,
                    script: '/uploads/courses/react-redux-course.pdf',
                    scriptType: 'pdf',
                    duration: '25 hours',
                    level: 'advanced',
                    instructor: 'Expert Developer',
                    thumbnail: '/uploads/courses/thumbnails/react.jpg',
                    tags: ['react', 'redux', 'javascript', 'frontend'],
                    isPublished: true,
                    isPremium: true
                },
                {
                    title: 'UI/UX Design Fundamentals',
                    description: 'Learn the principles of user interface and user experience design',
                    category: 'design',
                    price: 49.99,
                    script: '/uploads/courses/ui-ux-course.pdf',
                    scriptType: 'pdf',
                    duration: '20 hours',
                    level: 'beginner',
                    instructor: 'Design Expert',
                    thumbnail: '/uploads/courses/thumbnails/ui-ux.jpg',
                    tags: ['ui', 'ux', 'design', 'figma', 'prototype'],
                    isPublished: true,
                    isPremium: false
                }
            ];
            
            await Course.insertMany(sampleCourses);
            console.log('✅ Sample courses created successfully');
        } else {
            console.log('✅ Courses already exist');
        }
        
        // Initialize Sample Advertisements
        console.log('📢 Creating sample advertisements...');
        const existingAds = await Advertisement.find();
        
        if (existingAds.length === 0) {
            const sampleAds = [
                {
                    title: 'Special Offer - 50% Off Web Hosting',
                    description: 'Get our premium web hosting at half price for the first 3 months',
                    image: '/uploads/ads/hosting-promo.jpg',
                    link: '/hosting',
                    position: 'banner',
                    isActive: true,
                    startDate: new Date(),
                    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
                    clicks: 0,
                    impressions: 0
                },
                {
                    title: 'New Course Launch - AI Development',
                    description: 'Learn AI development with our comprehensive new course',
                    image: '/uploads/ads/ai-course.jpg',
                    link: '/courses',
                    position: 'sidebar',
                    isActive: true,
                    startDate: new Date(),
                    endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
                    clicks: 0,
                    impressions: 0
                }
            ];
            
            await Advertisement.insertMany(sampleAds);
            console.log('✅ Sample advertisements created successfully');
        } else {
            console.log('✅ Advertisements already exist');
        }
        
        console.log('🎉 Database initialization completed successfully!');
        console.log('');
        console.log('📋 Login Credentials:');
        console.log('   Username: Ntando');
        console.log('   Password: Ntando');
        console.log('');
        console.log('🌐 Website URLs:');
        console.log('   Main Site: http://localhost:3000');
        console.log('   Admin Panel: http://localhost:3000/admin');
        console.log('');
        
    } catch (error) {
        console.error('❌ Database initialization failed:', error);
    } finally {
        mongoose.connection.close();
        console.log('🔌 Database connection closed');
    }
};

// Run initialization
if (require.main === module) {
    initializeDatabase();
}

module.exports = initializeDatabase;