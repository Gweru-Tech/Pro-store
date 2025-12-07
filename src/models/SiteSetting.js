const mongoose = require('mongoose');

const siteSettingSchema = new mongoose.Schema({
  siteName: {
    type: String,
    default: 'NtandoStore v7'
  },
  siteVersion: {
    type: String,
    default: '7.0.0'
  },
  backgroundMusic: {
    file: String,
    isActive: {
      type: Boolean,
      default: false
    },
    volume: {
      type: Number,
      default: 50,
      min: 0,
      max: 100
    }
  },
  contactEmail: {
    type: String,
    default: 'info@ntandostore.com'
  },
  contactPhone: {
    type: String,
    default: '+1234567890'
  },
  address: {
    type: String,
    default: '123 Business Ave, Tech City, TC 12345'
  },
  socialLinks: {
    facebook: String,
    twitter: String,
    instagram: String,
    youtube: String,
    linkedin: String
  },
  maintenance: {
    isActive: {
      type: Boolean,
      default: false
    },
    message: String
  },
  analytics: {
    googleAnalyticsId: String,
    facebookPixelId: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('SiteSetting', siteSettingSchema);