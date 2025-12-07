# NtandoStore v7 - Professional Multi-Service Platform

🚀 **Version 7.0.0** | Created by NtandoMods

A comprehensive, professional multi-service platform offering domains, hosting, website development, premium apps, foreign numbers, and premium courses with full admin panel functionality.

## 🌟 Features

### Core Services
- **🌐 Domain Registration** - Sell domains with instant registration
- **🖥️ Web Hosting** - Premium hosting solutions with SSD storage
- **💻 Website Development** - Custom website development services
- **📱 Premium Apps** - Marketplace for premium applications
- **📞 Foreign Numbers** - Virtual phone numbers from 50+ countries
- **🎓 Premium Courses** - Educational platform with lifetime access

### Admin Panel Features
- **🔐 Secure Login** - Username: `Ntando`, Password: `Ntando`
- **📚 Course Management** - Upload and manage courses with scripts
- **🛠️ Service Management** - Add/edit/remove services
- **💬 Message System** - View and respond to customer messages
- **📢 Advertisement Control** - Manage site advertisements
- **🎵 Background Music** - Control background music settings
- **⚙️ General Settings** - Configure all platform settings
- **📊 Analytics Dashboard** - Track visitors, clicks, and performance

### Security Features
- **🔒 Code Protection** - Anti-theft mechanisms and obfuscation
- **🛡️ Advanced Security** - XSS, CSRF, SQL injection protection
- **🚦 Rate Limiting** - Prevent abuse and attacks
- **🔑 Authentication** - JWT and session-based auth
- **📝 Input Validation** - Comprehensive validation system

### Analytics & Monitoring
- **👥 Visitor Counter** - Real-time visitor tracking
- **⏱️ Runtime Display** - Server uptime monitoring
- **📈 Performance Metrics** - Load time and performance tracking
- **📊 Click Analytics** - Advertisement and link tracking
- **🎯 Conversion Tracking** - User interaction analytics

## 🚀 Quick Start

### Prerequisites
- Node.js 16.0.0 or higher
- MongoDB 4.4 or higher
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd ntandostore-v7
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment setup**
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. **Initialize database**
```bash
node database/init.js
```

5. **Start the server**
```bash
# Development
npm run dev

# Production
npm start
```

6. **Access the platform**
- **Main Website**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin
  - Username: `Ntando`
  - Password: `Ntando`

## 📁 Project Structure

```
ntandostore-v7/
├── src/
│   ├── controllers/          # API controllers
│   ├── models/              # Database models
│   ├── routes/              # Route definitions
│   ├── middleware/          # Custom middleware
│   └── utils/               # Utility functions
├── views/
│   ├── admin/               # Admin panel templates
│   └── *.ejs                # Main website templates
├── public/
│   ├── css/                 # Stylesheets
│   ├── js/                  # JavaScript files
│   ├── images/              # Static images
│   └── uploads/             # File uploads
├── database/
│   └── init.js              # Database initialization
├── config/                  # Configuration files
├── admin/                   # Admin-specific files
├── package.json             # Dependencies and scripts
├── server.js                # Main server file
├── render.yaml              # Render.com deployment config
└── README.md                # This file
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file based on `.env.example`:

```env
# Server Configuration
NODE_ENV=development
PORT=3000

# Database
MONGODB_URI=mongodb://localhost:27017/ntandostore-v7

# Security
SESSION_SECRET=your-secret-key
JWT_SECRET=your-jwt-secret

# Email (for notifications)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Admin Credentials
ADMIN_USERNAME=Ntando
ADMIN_PASSWORD=Ntando
ADMIN_EMAIL=admin@ntandostore.com
```

### MongoDB Setup

1. Install and start MongoDB
2. Create database `ntandostore-v7`
3. Run initialization script:
```bash
node database/init.js
```

## 🌐 Deployment

### Render.com Deployment

1. **Connect your repository** to Render.com
2. **Configure environment variables** in Render dashboard
3. **Deploy automatically** using `render.yaml`

Key Render settings:
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Port**: 10000 (Render's requirement)

### Manual Deployment

1. **Build for production**
```bash
npm install --production
```

2. **Set production environment**
```bash
export NODE_ENV=production
export PORT=80
```

3. **Start with process manager**
```bash
# Using PM2
npm install -g pm2
pm2 start server.js --name ntandostore-v7
```

## 📚 API Documentation

### Authentication

All admin endpoints require authentication:

```javascript
// Session-based (recommended)
headers: {
  'Cookie': 'your-session-cookie'
}

// JWT token (alternative)
headers: {
  'Authorization': 'Bearer your-jwt-token'
}
```

### Main API Endpoints

#### Public Endpoints
- `GET /api/courses` - Get all published courses
- `GET /api/services` - Get all available services
- `GET /api/ads` - Get active advertisements
- `POST /api/contact` - Submit contact form

#### Admin Endpoints
- `GET /api/admin/stats` - Get dashboard statistics
- `GET /api/admin/courses` - Get all courses
- `POST /api/admin/courses` - Create new course
- `PUT /api/admin/courses/:id` - Update course
- `DELETE /api/admin/courses/:id` - Delete course
- `GET /api/admin/services` - Get all services
- `POST /api/admin/services` - Create new service
- `GET /api/admin/messages` - Get all messages
- `POST /api/admin/music` - Update music settings

## 🎨 Customization

### Adding New Services

1. **Create service in admin panel**
2. **Add service category to model**
3. **Update frontend categories**
4. **Create service-specific page if needed**

### Custom Styling

Edit `public/css/style.css`:
- Use CSS variables for theming
- Maintain responsive design
- Follow existing class conventions

### Adding New Features

1. **Update models** in `src/models/`
2. **Create controller** in `src/controllers/`
3. **Add routes** in `src/routes/`
4. **Update admin panel** if needed
5. **Test thoroughly**

## 🔒 Security Features

### Implemented Protections

- **XSS Protection**: Content Security Policy headers
- **CSRF Protection**: Session-based CSRF tokens
- **SQL Injection**: Mongoose ORM protection
- **Rate Limiting**: Configurable rate limits
- **Authentication**: JWT + session-based auth
- **File Upload**: Type and size validation
- **Input Validation**: Express-validator middleware

### Code Protection

- **Obfuscation**: JavaScript obfuscation
- **Anti-debugging**: Console clearing and right-click prevention
- **Source Protection**: No source code exposure
- **Hotlink Protection**: Referer checking

## 📊 Monitoring & Analytics

### Built-in Analytics

- **Visitor tracking**: Unique visitor counting
- **Page views**: Real-time page view tracking
- **User interactions**: Click and scroll tracking
- **Performance metrics**: Load time monitoring
- **Error tracking**: Automatic error logging

### External Analytics Integration

Configure in admin panel:
- **Google Analytics**: Add GA measurement ID
- **Facebook Pixel**: Add pixel ID for retargeting
- **Custom tracking**: Add custom tracking scripts

## 🛠️ Maintenance

### Database Backup

```bash
# MongoDB backup
mongodump --db ntandostore-v7 --out backup/

# Restore backup
mongorestore --db ntandostore-v7 backup/ntandostore-v7/
```

### Log Management

Logs are stored in:
- **Console logs**: Application logs
- **Error logs**: Error tracking
- **Access logs**: Request logging

### Performance Optimization

1. **Enable compression** (built-in)
2. **Use CDN** for static assets
3. **Optimize images** before upload
4. **Monitor memory usage**
5. **Regular database cleanup**

## 🐛 Troubleshooting

### Common Issues

**Server won't start**
```bash
# Check port availability
netstat -tlnp | grep :3000

# Check logs
npm start
```

**Database connection failed**
```bash
# Check MongoDB status
sudo systemctl status mongod

# Verify connection string
echo $MONGODB_URI
```

**File upload issues**
```bash
# Check upload directory permissions
ls -la public/uploads/
chmod 755 public/uploads/
```

**Admin login issues**
```bash
# Reset admin credentials
node database/init.js
```

### Debug Mode

Enable debug logging:
```bash
DEBUG=ntandostore:* npm run dev
```

## 🤝 Contributing

### Development Setup

1. **Fork the repository**
2. **Create feature branch**
```bash
git checkout -b feature-name
```

3. **Make changes** following code style
4. **Test thoroughly**
5. **Submit pull request**

### Code Style

- **ESLint** for JavaScript linting
- **Prettier** for code formatting
- **Semantic versioning** for releases
- **Git hooks** for pre-commit checks

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

### Contact Information

- **Email**: info@ntandostore.com
- **Phone**: +1234567890
- **Website**: https://ntandostore.com
- **Admin Panel**: https://ntandostore.com/admin

### Documentation

- **API Docs**: `/api` endpoint
- **Admin Guide**: Available in admin panel
- **FAQ**: `/faq` page
- **Status**: `/status` endpoint

## 🎉 Acknowledgments

Created with ❤️ by **NtandoMods**

Special thanks to:
- Express.js team
- MongoDB Inc.
- Render.com for hosting
- All contributors and users

---

**NtandoStore v7** - Your Professional Multi-Service Platform

🚀 Version 7.0.0 | 🔒 Enterprise Security | 📊 Advanced Analytics | 🎓 Educational Excellence