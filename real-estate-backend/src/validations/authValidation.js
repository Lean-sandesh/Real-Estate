const { body } = require('express-validator');
const User = require('../models/User');

const registerValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]*$/)
    .withMessage('Name can only contain letters and spaces'),
  
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email address')
    .normalizeEmail()
    .custom(async (email) => {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new Error('Email is already registered');
      }
      return true;
    }),
  
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
  
  body('phone')
    .optional()
    .isMobilePhone()
    .withMessage('Please enter a valid phone number')
    .custom(async (phone) => {
      if (phone) {
        const existingUser = await User.findOne({ phone });
        if (existingUser) {
          throw new Error('Phone number is already registered');
        }
      }
      return true;
    }),
  
  body('role')
    .optional()
    .isIn(['user', 'agent', 'admin'])
    .withMessage('Role must be user, agent, or admin')
    .default('user'),
  
  body('company')
    .optional()
    .isLength({ max: 100 })
    .withMessage('Company name cannot exceed 100 characters'),
  
  body('licenseNumber')
    .optional()
    .isLength({ max: 50 })
    .withMessage('License number cannot exceed 50 characters')
    .custom((value, { req }) => {
      if (req.body.role === 'agent' && !value) {
        throw new Error('License number is required for agents');
      }
      return true;
    }),

  // ============ NEW: ADDRESS VALIDATION ============
  body('address')
    .optional()
    .isObject()
    .withMessage('Address must be an object'),
  
  body('address.street')
    .optional()
    .isLength({ max: 200 })
    .withMessage('Street address cannot exceed 200 characters'),
  
  body('address.city')
    .optional()
    .isLength({ max: 100 })
    .withMessage('City name cannot exceed 100 characters'),
  
  body('address.state')
    .optional()
    .isLength({ max: 100 })
    .withMessage('State name cannot exceed 100 characters'),
  
  body('address.country')
    .optional()
    .isLength({ max: 100 })
    .withMessage('Country name cannot exceed 100 characters')
    .default('India'),
  
  body('address.postalCode')
    .optional()
    .matches(/^[0-9]{5,6}$/)
    .withMessage('Invalid postal code format (5-6 digits)'),

  body('address.coordinates')
    .optional()
    .isObject()
    .withMessage('Coordinates must be an object'),

  body('address.coordinates.lat')
    .optional()
    .isFloat({ min: -90, max: 90 })
    .withMessage('Latitude must be between -90 and 90'),

  body('address.coordinates.lng')
    .optional()
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitude must be between -180 and 180'),
  // ============ END ADDRESS VALIDATION ============

  // ============ NEW: ADDITIONAL FIELDS ============
  body('bio')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Bio cannot exceed 500 characters'),
  
  body('website')
    .optional()
    .isURL()
    .withMessage('Please enter a valid website URL'),

  body('preferences')
    .optional()
    .isObject()
    .withMessage('Preferences must be an object'),

  body('preferences.notifications.email')
    .optional()
    .isBoolean()
    .withMessage('Email notification preference must be boolean'),

  body('preferences.notifications.sms')
    .optional()
    .isBoolean()
    .withMessage('SMS notification preference must be boolean'),

  body('preferences.notifications.push')
    .optional()
    .isBoolean()
    .withMessage('Push notification preference must be boolean'),

  body('preferences.newsletter')
    .optional()
    .isBoolean()
    .withMessage('Newsletter preference must be boolean'),

  body('preferences.language')
    .optional()
    .isIn(['en', 'es', 'fr', 'de'])
    .withMessage('Language must be one of: en, es, fr, de')
    .default('en')
  // ============ END ADDITIONAL FIELDS ============
];

const agentRegistrationValidation = [
  // Include all registerValidation rules
  ...registerValidation,

  // Additional agent-specific validations
  body('company')
    .notEmpty()
    .withMessage('Company name is required for agents')
    .isLength({ max: 100 })
    .withMessage('Company name cannot exceed 100 characters'),
  
  body('licenseNumber')
    .notEmpty()
    .withMessage('License number is required for agents')
    .isLength({ max: 50 })
    .withMessage('License number cannot exceed 50 characters'),
  
  body('phone')
    .notEmpty()
    .withMessage('Phone number is required for agents')
    .isMobilePhone()
    .withMessage('Please enter a valid phone number')
    .custom(async (phone) => {
      if (phone) {
        const existingUser = await User.findOne({ phone });
        if (existingUser) {
          throw new Error('Phone number is already registered');
        }
      }
      return true;
    }),
  
  body('experience')
    .optional()
    .isInt({ min: 0, max: 60 })
    .withMessage('Experience must be between 0 and 60 years'),
  
  body('specializations')
    .optional()
    .isArray()
    .withMessage('Specializations must be an array'),
  
  body('specializations.*')
    .optional()
    .isString()
    .withMessage('Each specialization must be a string')
    .isLength({ max: 50 })
    .withMessage('Specialization cannot exceed 50 characters'),

  // Address is more important for agents
  body('address.city')
    .notEmpty()
    .withMessage('City is required for agents')
    .isLength({ max: 100 })
    .withMessage('City name cannot exceed 100 characters'),

  body('address.state')
    .notEmpty()
    .withMessage('State is required for agents')
    .isLength({ max: 100 })
    .withMessage('State name cannot exceed 100 characters'),

  body('address.country')
    .notEmpty()
    .withMessage('Country is required for agents')
    .isLength({ max: 100 })
    .withMessage('Country name cannot exceed 100 characters')
];

const loginValidation = [
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email address')
    .normalizeEmail()
    .custom(async (email, { req }) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error('No account found with this email');
      }
      if (!user.isActive) {
        throw new Error('Account has been deactivated. Please contact support.');
      }
      req.user = user; // Attach user to request for controller
      return true;
    }),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

const updateProfileValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]*$/)
    .withMessage('Name can only contain letters and spaces'),
  
  body('email')
    .optional()
    .isEmail()
    .withMessage('Please enter a valid email address')
    .normalizeEmail()
    .custom(async (email, { req }) => {
      const existingUser = await User.findOne({ email, _id: { $ne: req.user.id } });
      if (existingUser) {
        throw new Error('Email is already registered to another account');
      }
      return true;
    }),
  
  body('phone')
    .optional()
    .isMobilePhone()
    .withMessage('Please enter a valid phone number')
    .custom(async (phone, { req }) => {
      if (phone) {
        const existingUser = await User.findOne({ phone, _id: { $ne: req.user.id } });
        if (existingUser) {
          throw new Error('Phone number is already registered to another account');
        }
      }
      return true;
    }),
  
  body('company')
    .optional()
    .isLength({ max: 100 })
    .withMessage('Company name cannot exceed 100 characters'),
  
  body('bio')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Bio cannot exceed 500 characters'),
  
  body('website')
    .optional()
    .isURL()
    .withMessage('Please enter a valid website URL'),
  
  body('socialMedia.linkedin')
    .optional()
    .isURL()
    .withMessage('Please enter a valid LinkedIn URL'),
  
  body('socialMedia.twitter')
    .optional()
    .isURL()
    .withMessage('Please enter a valid Twitter URL'),
  
  body('socialMedia.facebook')
    .optional()
    .isURL()
    .withMessage('Please enter a valid Facebook URL'),

  // ============ NEW: ADDRESS UPDATE VALIDATION ============
  body('address')
    .optional()
    .isObject()
    .withMessage('Address must be an object'),
  
  body('address.street')
    .optional()
    .isLength({ max: 200 })
    .withMessage('Street address cannot exceed 200 characters'),
  
  body('address.city')
    .optional()
    .isLength({ max: 100 })
    .withMessage('City name cannot exceed 100 characters'),
  
  body('address.state')
    .optional()
    .isLength({ max: 100 })
    .withMessage('State name cannot exceed 100 characters'),
  
  body('address.country')
    .optional()
    .isLength({ max: 100 })
    .withMessage('Country name cannot exceed 100 characters'),
  
  body('address.postalCode')
    .optional()
    .matches(/^[0-9]{5,6}$/)
    .withMessage('Invalid postal code format (5-6 digits)')
  // ============ END ADDRESS UPDATE VALIDATION ============
];

// ============ NEW: UPDATE LOCATION VALIDATION ============
const updateLocationValidation = [
  body('address')
    .notEmpty()
    .withMessage('Address is required')
    .isObject()
    .withMessage('Address must be an object'),
  
  body('address.street')
    .optional()
    .isLength({ max: 200 })
    .withMessage('Street address cannot exceed 200 characters'),
  
  body('address.city')
    .notEmpty()
    .withMessage('City is required')
    .isLength({ max: 100 })
    .withMessage('City name cannot exceed 100 characters'),
  
  body('address.state')
    .notEmpty()
    .withMessage('State is required')
    .isLength({ max: 100 })
    .withMessage('State name cannot exceed 100 characters'),
  
  body('address.country')
    .notEmpty()
    .withMessage('Country is required')
    .isLength({ max: 100 })
    .withMessage('Country name cannot exceed 100 characters')
    .default('India'),
  
  body('address.postalCode')
    .optional()
    .matches(/^[0-9]{5,6}$/)
    .withMessage('Invalid postal code format (5-6 digits)'),

  body('address.coordinates')
    .optional()
    .isObject()
    .withMessage('Coordinates must be an object'),

  body('address.coordinates.lat')
    .optional()
    .isFloat({ min: -90, max: 90 })
    .withMessage('Latitude must be between -90 and 90'),

  body('address.coordinates.lng')
    .optional()
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitude must be between -180 and 180')
];
// ============ END UPDATE LOCATION VALIDATION ============

// ============ NEW: UPDATE PREFERENCES VALIDATION ============
const updatePreferencesValidation = [
  body('preferences')
    .notEmpty()
    .withMessage('Preferences are required')
    .isObject()
    .withMessage('Preferences must be an object'),

  body('preferences.notifications')
    .optional()
    .isObject()
    .withMessage('Notifications must be an object'),

  body('preferences.notifications.email')
    .optional()
    .isBoolean()
    .withMessage('Email notification preference must be boolean')
    .default(true),

  body('preferences.notifications.sms')
    .optional()
    .isBoolean()
    .withMessage('SMS notification preference must be boolean')
    .default(false),

  body('preferences.notifications.push')
    .optional()
    .isBoolean()
    .withMessage('Push notification preference must be boolean')
    .default(true),

  body('preferences.newsletter')
    .optional()
    .isBoolean()
    .withMessage('Newsletter preference must be boolean')
    .default(true),

  body('preferences.language')
    .optional()
    .isIn(['en', 'es', 'fr', 'de'])
    .withMessage('Language must be one of: en, es, fr, de')
    .default('en')
];
// ============ END UPDATE PREFERENCES VALIDATION ============

const changePasswordValidation = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  
  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('New password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('New password must contain at least one uppercase letter, one lowercase letter, one number, and one special character')
    .custom((value, { req }) => {
      if (value === req.body.currentPassword) {
        throw new Error('New password must be different from current password');
      }
      return true;
    }),
  
  body('confirmPassword')
    .notEmpty()
    .withMessage('Confirm password is required')
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error('Passwords do not match');
      }
      return true;
    })
];

const forgotPasswordValidation = [
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email address')
    .normalizeEmail()
    .custom(async (email) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error('No account found with this email address');
      }
      return true;
    })
];

const resetPasswordValidation = [
  body('token')
    .notEmpty()
    .withMessage('Reset token is required'),
  
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
  
  body('confirmPassword')
    .notEmpty()
    .withMessage('Confirm password is required')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords do not match');
      }
      return true;
    })
];

module.exports = {
  registerValidation,
  agentRegistrationValidation,
  loginValidation,
  updateProfileValidation,
  updateLocationValidation,      // NEW
  updatePreferencesValidation,   // NEW
  changePasswordValidation,
  forgotPasswordValidation,
  resetPasswordValidation
};