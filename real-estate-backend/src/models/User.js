const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

// User Schema Definition
const userSchema = new mongoose.Schema({
  // Basic Information
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters'],
    match: [/^[a-zA-Z\s]*$/, 'Name can only contain letters and spaces']
  },
  
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters'],
    select: false
  },

  // Location Information
  address: {
    street: {
      type: String,
      trim: true,
      maxlength: [200, 'Street address too long']
    },
    city: {
      type: String,
      trim: true,
      maxlength: [100, 'City name too long']
    },
    state: {
      type: String,
      trim: true,
      maxlength: [100, 'State name too long']
    },
    country: {
      type: String,
      trim: true,
      maxlength: [100, 'Country name too long'],
      default: 'India'
    },
    postalCode: {
      type: String,
      trim: true,
      match: [/^[0-9]{5,6}$/, 'Invalid postal code format']
    },
    coordinates: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number],
        default: [0, 0]
      }
    }
  },
  
  // Contact Information
  phone: {
    type: String,
    trim: true,
    match: [/^\+?[\d\s-()]+$/, 'Please enter a valid phone number']
  },
  
  // Role and Permissions
  role: {
    type: String,
    enum: ['user', 'agent', 'admin'],
    default: 'user'
  },
  
  // Professional Information (for agents)
  company: {
    type: String,
    trim: true,
    maxlength: [100, 'Company name cannot exceed 100 characters']
  },
  
  licenseNumber: {
    type: String,
    trim: true,
    maxlength: [50, 'License number cannot exceed 50 characters']
  },
  
  experience: {
    type: Number,
    min: [0, 'Experience cannot be negative'],
    max: [60, 'Experience seems too high']
  },
  
  specializations: [{
    type: String,
    trim: true,
    maxlength: [50, 'Specialization cannot exceed 50 characters']
  }],
  
  // Profile Information
  bio: {
    type: String,
    maxlength: [500, 'Bio cannot exceed 500 characters'],
    trim: true
  },
  
  website: {
    type: String,
    trim: true,
    match: [/^https?:\/\/.+\..+$/, 'Please enter a valid website URL']
  },
  
  // Social Media Links
  socialMedia: {
    linkedin: {
      type: String,
      trim: true,
      match: [/^https?:\/\/(www\.)?linkedin\.com\/.+$/, 'Please enter a valid LinkedIn URL']
    },
    twitter: {
      type: String,
      trim: true,
      match: [/^https?:\/\/(www\.)?twitter\.com\/.+$/, 'Please enter a valid Twitter URL']
    },
    facebook: {
      type: String,
      trim: true,
      match: [/^https?:\/\/(www\.)?facebook\.com\/.+$/, 'Please enter a valid Facebook URL']
    }
  },
  
  // Profile Image
  avatar: {
    public_id: {
      type: String,
      default: null
    },
    url: {
      type: String,
      default: 'https://res.cloudinary.com/demo/image/upload/v1234567/default-avatar.png'
    }
  },
  
  // Account Status
  isActive: {
    type: Boolean,
    default: true
  },
  
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  
  // Verification Tokens
  emailVerificationToken: String,
  emailVerificationExpire: Date,
  
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  
  // Login Tracking
  lastLogin: Date,
  loginCount: {
    type: Number,
    default: 0
  },
  
  // Profile Completion
  profileCompletion: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  
  // Agent Performance Stats
  agentStats: {
    totalProperties: {
      type: Number,
      default: 0
    },
    activeProperties: {
      type: Number,
      default: 0
    },
    soldProperties: {
      type: Number,
      default: 0
    },
    totalViews: {
      type: Number,
      default: 0
    },
    totalLikes: {
      type: Number,
      default: 0
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    reviewsCount: {
      type: Number,
      default: 0
    }
  },
  
  // User Preferences
  preferences: {
    notifications: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: false },
      push: { type: Boolean, default: true }
    },
    newsletter: {
      type: Boolean,
      default: true
    },
    language: {
      type: String,
      default: 'en',
      enum: ['en', 'es', 'fr', 'de']
    }
  },
  
  // Security
  passwordChangedAt: Date,
  twoFactorEnabled: {
    type: Boolean,
    default: false
  },

  // References to other collections
  favorites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property'
  }],
  
  reviews: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Review'
  }],
  
  agentReviews: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Review'
  }]

}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    
    // Update password changed timestamp
    if (!this.isNew) {
      this.passwordChangedAt = Date.now() - 1000;
    }
    
    next();
  } catch (error) {
    next(error);
  }
});

// Calculate profile completion percentage
userSchema.pre('save', function(next) {
  let completion = 0;
  const fields = [
    'name', 'email', 'phone', 'bio', 'avatar', 'address.city'
  ];

  fields.forEach(field => {
    if (field.includes('.')) {
      // Handle nested fields
      const parts = field.split('.');
      let value = this;
      for (const part of parts) {
        value = value ? value[part] : undefined;
      }
      if (value && value.toString().trim()) {
        completion += 15;
      }
    } else {
      if (this[field]) {
        // Check if avatar is not default
        if (field === 'avatar' && this.avatar.url !== 'https://res.cloudinary.com/demo/image/upload/v1234567/default-avatar.png') {
          completion += 15;
        } else if (field !== 'avatar') {
          completion += 15;
        }
      }
    }
  });

  this.profileCompletion = Math.min(completion, 100);
  next();
});

// Update login statistics
userSchema.methods.updateLoginStats = function() {
  this.lastLogin = new Date();
  this.loginCount += 1;
  return this.save({ validateBeforeSave: false });
};

// Verify password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Check if password was changed after JWT token was issued
userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

// Role check methods
userSchema.methods.isAgent = function() {
  return this.role === 'agent' || this.role === 'admin';
};

userSchema.methods.isAdmin = function() {
  return this.role === 'admin';
};

// Check agent access permissions
userSchema.methods.canAccessAgentFeatures = function() {
  return this.isAgent() && this.isActive && this.isEmailVerified;
};

// Format address for display
userSchema.methods.getFormattedAddress = function() {
  const addr = this.address;
  if (!addr) return '';
  
  const parts = [];
  if (addr.street) parts.push(addr.street);
  if (addr.city) parts.push(addr.city);
  if (addr.state) parts.push(addr.state);
  if (addr.country) parts.push(addr.country);
  if (addr.postalCode) parts.push(`PIN: ${addr.postalCode}`);
  
  return parts.join(', ');
};

// Check if location information is complete
userSchema.methods.hasCompleteLocation = function() {
  return (
    this.address &&
    this.address.city &&
    this.address.state &&
    this.address.country
  );
};

// Generate email verification token
userSchema.methods.createEmailVerificationToken = function() {
  const verificationToken = crypto.randomBytes(32).toString('hex');
  
  this.emailVerificationToken = crypto
    .createHash('sha256')
    .update(verificationToken)
    .digest('hex');
    
  this.emailVerificationExpire = Date.now() + 24 * 60 * 60 * 1000;
  
  return verificationToken;
};

// Generate password reset token
userSchema.methods.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');
  
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
    
  this.resetPasswordExpire = Date.now() + 30 * 60 * 1000;
  
  return resetToken;
};

// Virtual full name property
userSchema.virtual('fullName').get(function() {
  return this.name;
});

// Static Methods

// Find all active users
userSchema.statics.findActiveUsers = function() {
  return this.find({ isActive: true });
};

// Find users by role
userSchema.statics.findByRole = function(role) {
  return this.find({ role, isActive: true });
};

// Find users by city
userSchema.statics.findByCity = function(city) {
  return this.find({ 
    'address.city': new RegExp(city, 'i'),
    isActive: true 
  });
};

// Find agents by location
userSchema.statics.findAgentsByLocation = function(city, state) {
  const query = { 
    role: 'agent', 
    isActive: true 
  };
  
  if (city) query['address.city'] = new RegExp(city, 'i');
  if (state) query['address.state'] = new RegExp(state, 'i');
  
  return this.find(query);
};

// Get user statistics by role
userSchema.statics.getUserStats = async function() {
  const stats = await this.aggregate([
    {
      $group: {
        _id: '$role',
        count: { $sum: 1 },
        active: { $sum: { $cond: ['$isActive', 1, 0] } },
        verified: { $sum: { $cond: ['$isEmailVerified', 1, 0] } }
      }
    }
  ]);
  
  return stats;
};

// Database Indexes for performance
userSchema.index({ email: 1 });
userSchema.index({ role: 1, isActive: 1 });
userSchema.index({ 'agentStats.rating': -1 });
userSchema.index({ createdAt: -1 });
userSchema.index({ 'address.city': 1, 'address.state': 1 });
userSchema.index({ emailVerificationToken: 1 }, { sparse: true });
userSchema.index({ resetPasswordToken: 1 }, { sparse: true });
userSchema.index({ 'address.coordinates': '2dsphere' });

module.exports = mongoose.model('User', userSchema);