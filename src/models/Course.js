const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: {
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
    enum: ['programming', 'design', 'marketing', 'business', 'premium']
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  script: {
    type: String,
    required: true
  },
  scriptType: {
    type: String,
    enum: ['text', 'video', 'pdf', 'interactive'],
    default: 'text'
  },
  duration: {
    type: String,
    required: true
  },
  level: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  instructor: {
    type: String,
    required: true
  },
  thumbnail: {
    type: String,
    required: true
  },
  previewVideo: {
    type: String
  },
  tags: [{
    type: String,
    trim: true
  }],
  enrolledStudents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: String,
    date: {
      type: Date,
      default: Date.now
    }
  }],
  isPublished: {
    type: Boolean,
    default: false
  },
  isPremium: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Course', courseSchema);