const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required']
  },
  
  agent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Agent is required']
  },
  
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5']
  },
  
  comment: {
    type: String,
    maxlength: [1000, 'Comment cannot exceed 1000 characters'],
    trim: true
  },
  
  transactionType: {
    type: String,
    enum: ['sale', 'rent'],
    required: [true, 'Transaction type is required']
  },
  
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property'
  },
  
  isVerified: {
    type: Boolean,
    default: false
  },
  
  helpful: {
    count: {
      type: Number,
      default: 0
    },
    users: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }]
  }

}, {
  timestamps: true
});

module.exports = mongoose.model('Review', reviewSchema);