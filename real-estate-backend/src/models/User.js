const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
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
  
  phone: {
    type: String,
    trim: true,
    match: [/^\+?[\d\s-()]+$/, 'Please enter a valid phone number']
  },
  
  role: {
    type: String,
    enum: ['user', 'agent', 'admin'],
    default: 'user'
  },
  
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
  
  isActive: {
    type: Boolean,
    default: true
  },
  
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  
  emailVerificationToken: String,
  emailVerificationExpire: Date,
  
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  
  lastLogin: Date,
  loginCount: {
    type: Number,
    default: 0
  },
  
  profileCompletion: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  
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
  
  passwordChangedAt: Date,
  twoFactorEnabled: {
    type: Boolean,
    default: false
  },

  // Add favorites and reviews references
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

// ==================== MIDDLEWARE ====================

// Encrypt password before saving
userSchema.pre('save', async function(next) {
  // Only run if password was modified
  if (!this.isModified('password')) {
    return next();
  }

  try {
    // Hash the password with cost of 12
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    
    // Set passwordChangedAt if not new user
    if (!this.isNew) {
      this.passwordChangedAt = Date.now() - 1000;
    }
    
    next();
  } catch (error) {
    next(error);
  }
});

// Update profile completion percentage
userSchema.pre('save', function(next) {
  let completion = 0;
  const fields = [
    'name', 'email', 'phone', 'bio', 'avatar'
  ];

  fields.forEach(field => {
    if (this[field]) {
      if (field === 'avatar' && this.avatar.url !== 'https://res.cloudinary.com/demo/image/upload/v1234567/default-avatar.png') {
        completion += 20;
      } else if (field !== 'avatar') {
        completion += 20;
      }
    }
  });

  this.profileCompletion = Math.min(completion, 100);
  next();
});

// Update lastLogin and loginCount
userSchema.methods.updateLoginStats = function() {
  this.lastLogin = new Date();
  this.loginCount += 1;
  return this.save({ validateBeforeSave: false });
};

// ==================== INSTANCE METHODS ====================

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Check if password was changed after token was issued
userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

// Check if user is agent
userSchema.methods.isAgent = function() {
  return this.role === 'agent' || this.role === 'admin';
};

// Check if user is admin
userSchema.methods.isAdmin = function() {
  return this.role === 'admin';
};

// Check if user can access agent features
userSchema.methods.canAccessAgentFeatures = function() {
  return this.isAgent() && this.isActive && this.isEmailVerified;
};

// Generate email verification token
userSchema.methods.createEmailVerificationToken = function() {
  const verificationToken = crypto.randomBytes(32).toString('hex');
  
  this.emailVerificationToken = crypto
    .createHash('sha256')
    .update(verificationToken)
    .digest('hex');
    
  this.emailVerificationExpire = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
  
  return verificationToken;
};

// Generate password reset token
userSchema.methods.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');
  
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
    
  this.resetPasswordExpire = Date.now() + 30 * 60 * 1000; // 30 minutes
  
  return resetToken;
};

// ==================== VIRTUAL FIELDS ====================

// Virtual for full name (if needed)
userSchema.virtual('fullName').get(function() {
  return this.name;
});


// ==================== STATIC METHODS ====================

// Find active users
userSchema.statics.findActiveUsers = function() {
  return this.find({ isActive: true });
};

// Find users by role
userSchema.statics.findByRole = function(role) {
  return this.find({ role, isActive: true });
};

// Get user stats
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

// ==================== INDEXES ====================

userSchema.index({ email: 1 });
userSchema.index({ role: 1, isActive: 1 });
userSchema.index({ 'agentStats.rating': -1 });
userSchema.index({ createdAt: -1 });
userSchema.index({ emailVerificationToken: 1 }, { sparse: true });
userSchema.index({ resetPasswordToken: 1 }, { sparse: true });

module.exports = mongoose.model('User', userSchema);