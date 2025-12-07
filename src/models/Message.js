const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true
  },
  subject: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['unread', 'read', 'replied'],
    default: 'unread'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  reply: {
    text: String,
    date: Date,
    repliedBy: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Message', messageSchema);