const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema({
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: [true, 'Property is required']
  },
  
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
  
  type: {
    type: String,
    enum: ['general', 'viewing', 'pricing', 'details', 'custom'],
    default: 'general'
  },
  
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    trim: true,
    maxlength: [100, 'Subject cannot exceed 100 characters']
  },
  
  message: {
    type: String,
    required: [true, 'Message is required'],
    trim: true,
    maxlength: [1000, 'Message cannot exceed 1000 characters']
  },
  
  contactPreference: {
    type: String,
    enum: ['phone', 'email', 'both'],
    default: 'email'
  },
  
  preferredContactTime: {
    type: String,
    enum: ['morning', 'afternoon', 'evening', 'anytime'],
    default: 'anytime'
  },
  
  scheduledVisit: {
    date: Date,
    time: String,
    duration: {
      type: Number,
      min: 15,
      max: 240,
      default: 30
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'completed', 'rescheduled'],
      default: 'pending'
    },
    notes: {
      type: String,
      maxlength: [500, 'Visit notes cannot exceed 500 characters']
    },
    reminderSent: {
      type: Boolean,
      default: false
    }
  },
  
  status: {
    type: String,
    enum: ['new', 'contacted', 'viewing_scheduled', 'follow_up', 'interested', 'not_interested', 'negotiating', 'closed_success', 'closed_failed'],
    default: 'new'
  },
  
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  
  responses: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    message: {
      type: String,
      required: true,
      maxlength: [1000, 'Response message cannot exceed 1000 characters']
    },
    attachments: [{
      public_id: String,
      url: String,
      filename: String,
      size: Number
    }],
    isInternal: {
      type: Boolean,
      default: false
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  followUps: [{
    scheduledDate: {
      type: Date,
      required: true
    },
    notes: {
      type: String,
      maxlength: [500, 'Follow-up notes cannot exceed 500 characters']
    },
    method: {
      type: String,
      enum: ['email', 'phone', 'sms', 'in_person'],
      default: 'email'
    },
    status: {
      type: String,
      enum: ['scheduled', 'completed', 'cancelled'],
      default: 'scheduled'
    },
    completedAt: Date,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  source: {
    type: String,
    enum: ['website', 'mobile_app', 'phone', 'email', 'referral', 'walk_in'],
    default: 'website'
  },
  
  urgency: {
    type: String,
    enum: ['not_urgent', 'within_week', 'within_month', 'immediate'],
    default: 'within_month'
  },
  
  budget: {
    min: {
      type: Number,
      min: [0, 'Minimum budget cannot be negative']
    },
    max: {
      type: Number,
      min: [0, 'Maximum budget cannot be negative']
    },
    currency: {
      type: String,
      default: 'USD'
    }
  },
  
  timeline: {
    type: String,
    enum: ['immediate', '1_3_months', '3_6_months', '6_12_months', 'flexible'],
    default: 'flexible'
  },
  
  internalNotes: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    note: {
      type: String,
      required: true,
      maxlength: [500, 'Internal note cannot exceed 500 characters']
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  readBy: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    readAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  lastContacted: Date,
  nextFollowUp: Date,
  
  autoCloseAt: Date,
  isAutoClosed: {
    type: Boolean,
    default: false
  }

}, {
  timestamps: true
});

module.exports = mongoose.model('Inquiry', inquirySchema);