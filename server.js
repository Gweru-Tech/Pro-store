const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      mediaSrc: ["'self'"],
      connectSrc: ["'self'"]
    }
  }
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// CORS
app.use(cors());

// Compression
app.use(compression());

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'ntandostore-v7-secret-key-2024',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Static files with security headers
app.use(express.static(path.join(__dirname, 'public'), {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.js')) {
      res.setHeader('X-Content-Type-Options', 'nosniff');
    }
  }
}));

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Logging
app.use(morgan('combined'));

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ntandostore-v7', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Database connection event listeners
mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB database');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Disconnected from MongoDB');
});

// Global variables for analytics
let visitorCount = 0;
const startTime = new Date();

// Middleware to track visitors
app.use((req, res, next) => {
  if (!req.session.visited) {
    visitorCount++;
    req.session.visited = true;
  }
  next();
});

// Import routes
const mainRoutes = require('./src/routes/main');
const adminRoutes = require('./src/routes/admin');
const apiRoutes = require('./src/routes/api');

// Use routes
app.use('/', mainRoutes);
app.use('/admin', adminRoutes);
app.use('/api', apiRoutes);

// Global middleware to pass analytics data
app.use((req, res, next) => {
  res.locals.visitorCount = visitorCount;
  res.locals.startTime = startTime;
  res.locals.uptime = process.uptime();
  next();
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// 404 handler
app.use((req, res) => {
  res.status(404).render('404');
});

// Start server
app.listen(PORT, () => {
  console.log(`NtandoStore v7 server running on port ${PORT}`);
  console.log(`Server started at: ${startTime}`);
  console.log(`Website: http://localhost:${PORT}`);
  console.log(`Admin Panel: http://localhost:${PORT}/admin`);
});

module.exports = app;