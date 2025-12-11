const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const config = require('../config/environment');

// ==================== AUTHENTICATION MIDDLEWARE ====================

const auth = async (req, res, next) => {
  try {
    let token;
    
    // Check for token in multiple locations
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies?.token) {
      token = req.cookies.token;
    } else if (req.query?.token) {
      token = req.query.token;
    }
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.',
        errorType: 'NO_TOKEN'
      });
    }
    
    const decoded = jwt.verify(token, config.jwt.secret);
    
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token. User not found.',
        errorType: 'USER_NOT_FOUND'
      });
    }
    
    // Check if user account is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated. Please contact support.',
        errorType: 'ACCOUNT_DEACTIVATED'
      });
    }
    
    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    // Handle specific JWT errors
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token has expired. Please log in again.',
        errorType: 'TOKEN_EXPIRED'
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token. Please log in again.',
        errorType: 'INVALID_TOKEN'
      });
    }
    
    console.error('Auth middleware error:', error);
    
    return res.status(500).json({
      success: false,
      message: 'Authentication failed.',
      errorType: 'AUTH_ERROR'
    });
  }
};

// ==================== AUTHORIZATION MIDDLEWARE ====================

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.',
        errorType: 'AUTH_REQUIRED'
      });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user.role}' is not authorized to access this route. Required roles: ${roles.join(', ')}`,
        errorType: 'INSUFFICIENT_PERMISSIONS'
      });
    }
    next();
  };
};

// ==================== LOGIN HELPER FUNCTIONS ====================

/**
 * Authenticate user with email and password
 */
const authenticateUser = async (email, password) => {
  try {
    // Check if email and password are provided
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    // Get user including password
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Check if user is active
    if (!user.isActive) {
      throw new Error('Account is deactivated. Please contact support.');
    }

    // Check password using bcrypt directly (in case comparePassword method is missing)
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    // Update login stats
    user.lastLogin = new Date();
    user.loginCount += 1;
    await user.save({ validateBeforeSave: false });

    // Return user without password
    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;

    return userWithoutPassword;
  } catch (error) {
    throw error;
  }
};

/**
 * Generate JWT token for user
 */
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn }
  );
};

/**
 * Verify and decode JWT token
 */
const verifyToken = (token) => {
  return jwt.verify(token, config.jwt.secret);
};

/**
 * Check if password meets requirements
 */
const validatePassword = (password) => {
  const minLength = 6;
  
  if (password.length < minLength) {
    return {
      isValid: false,
      message: `Password must be at least ${minLength} characters long`
    };
  }

  return {
    isValid: true,
    message: 'Password is valid'
  };
};

// ==================== PASSWORD RESET FUNCTIONS ====================

/**
 * Generate password reset token
 */
const generatePasswordResetToken = () => {
  const crypto = require('crypto');
  const resetToken = crypto.randomBytes(32).toString('hex');
  const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  const resetExpire = Date.now() + 30 * 60 * 1000; // 30 minutes

  return {
    resetToken,
    hashedToken,
    resetExpire
  };
};

/**
 * Validate password reset token
 */
const validatePasswordResetToken = async (token) => {
  const crypto = require('crypto');
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  
  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() }
  });

  return user;
};

// ==================== SECURITY MIDDLEWARE ====================

/**
 * Middleware to check if user is property owner or admin
 */
const isOwnerOrAdmin = async (req, res, next) => {
  try {
    const Property = require('../models/Property');
    const property = await Property.findById(req.params.id);
    
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found.',
        errorType: 'PROPERTY_NOT_FOUND'
      });
    }

    if (property.agent.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to perform this action on this property.',
        errorType: 'NOT_PROPERTY_OWNER'
      });
    }

    req.property = property;
    next();
  } catch (error) {
    console.error('isOwnerOrAdmin middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Authorization check failed.',
      errorType: 'AUTHORIZATION_ERROR'
    });
  }
};

/**
 * Optional authentication (doesn't fail if no token)
 */
const optionalAuth = async (req, res, next) => {
  try {
    let token;
    
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies?.token) {
      token = req.cookies.token;
    }
    
    if (token) {
      const decoded = jwt.verify(token, config.jwt.secret);
      const user = await User.findById(decoded.id).select('-password');
      
      if (user && user.isActive) {
        req.user = user;
        req.token = token;
      }
    }
    
    next();
  } catch (error) {
    // Continue without authentication for optional auth
    next();
  }
};

/**
 * Rate limiting per user
 */
const userRateLimit = (requestsPerMinute = 60) => {
  const requests = new Map();
  
  return (req, res, next) => {
    if (!req.user) return next();
    
    const userId = req.user.id;
    const now = Date.now();
    const windowStart = now - 60000; // 1 minute window
    
    if (!requests.has(userId)) {
      requests.set(userId, []);
    }
    
    const userRequests = requests.get(userId);
    
    // Remove old requests outside the current window
    while (userRequests.length > 0 && userRequests[0] < windowStart) {
      userRequests.shift();
    }
    
    // Check if user has exceeded the limit
    if (userRequests.length >= requestsPerMinute) {
      return res.status(429).json({
        success: false,
        message: 'Too many requests. Please try again later.',
        errorType: 'RATE_LIMIT_EXCEEDED'
      });
    }
    
    // Add current request
    userRequests.push(now);
    next();
  };
};

// ==================== LOGIN CONTROLLER FUNCTIONS ====================

/**
 * Handle user login
 */
const handleLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Authenticate user
    const user = await authenticateUser(email, password);

    // Generate token
    const token = generateToken(user._id);

    // Set cookie if needed
    if (req.body.rememberMe) {
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });
    }

    return res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          avatar: user.avatar,
          company: user.company,
          isEmailVerified: user.isEmailVerified,
          isActive: user.isActive
        },
        token
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    
    return res.status(401).json({
      success: false,
      message: error.message,
      errorType: 'LOGIN_FAILED'
    });
  }
};

/**
 * Handle user logout
 */
const handleLogout = (req, res) => {
  // Clear cookie if exists
  res.clearCookie('token');
  
  // In a real application, you might want to blacklist the token
  
  return res.json({
    success: true,
    message: 'Logged out successfully'
  });
};

module.exports = {
  // Middleware
  auth,
  authorize,
  isOwnerOrAdmin,
  optionalAuth,
  userRateLimit,
  
  // Authentication functions
  authenticateUser,
  generateToken,
  verifyToken,
  validatePassword,
  
  // Password reset functions
  generatePasswordResetToken,
  validatePasswordResetToken,
  
  // Controller functions
  handleLogin,
  handleLogout
};