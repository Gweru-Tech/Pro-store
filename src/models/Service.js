const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['domain', 'hosting', 'development', 'apps', 'numbers', 'courses', 'other']
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  image: {
    type: String,
    required: true
  },
  features: [{
    type: String,
    trim: true
  }],
  specifications: {
    type: Map,
    of: String
  },
  availability: {
    type: String,
    enum: ['in-stock', 'out-of-stock', 'pre-order'],
    default: 'in-stock'
  },
  popular: {
    type: Boolean,
    default: false
  },
  featured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Service', serviceSchema);