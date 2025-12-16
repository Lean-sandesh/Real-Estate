const { body, param } = require('express-validator');
const User = require('../models/User');

const updateProfileValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]*$/)
    .withMessage('Name can only contain letters and spaces'),
  
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
    .withMessage('Country name cannot exceed 100 characters'),
  
  body('address.postalCode')
    .optional()
    .matches(/^[0-9]{5,6}$/)
    .withMessage('Invalid postal code format (5-6 digits)')
  // ============ END ADDRESS VALIDATION ============
];

// ============ NEW: UPDATE AGENT PROFILE VALIDATION ============
const updateAgentProfileValidation = [
  body('company')
    .optional()
    .isLength({ max: 100 })
    .withMessage('Company name cannot exceed 100 characters'),
  
  body('licenseNumber')
    .optional()
    .isLength({ max: 50 })
    .withMessage('License number cannot exceed 50 characters'),
  
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
  
  body('bio')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Bio cannot exceed 500 characters'),

  body('website')
    .optional()
    .isURL()
    .withMessage('Please enter a valid website URL'),

  body('socialMedia')
    .optional()
    .isObject()
    .withMessage('Social media must be an object'),

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

  // Address for agent profile
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
];
// ============ END UPDATE AGENT PROFILE VALIDATION ============

// ============ NEW: UPDATE LOCATION VALIDATION ============
const updateLocationValidation = [
  body('street')
    .optional()
    .isLength({ max: 200 })
    .withMessage('Street address cannot exceed 200 characters'),
  
  body('city')
    .notEmpty()
    .withMessage('City is required')
    .isLength({ max: 100 })
    .withMessage('City name cannot exceed 100 characters'),
  
  body('state')
    .notEmpty()
    .withMessage('State is required')
    .isLength({ max: 100 })
    .withMessage('State name cannot exceed 100 characters'),
  
  body('country')
    .notEmpty()
    .withMessage('Country is required')
    .isLength({ max: 100 })
    .withMessage('Country name cannot exceed 100 characters')
    .default('India'),
  
  body('postalCode')
    .optional()
    .matches(/^[0-9]{5,6}$/)
    .withMessage('Invalid postal code format (5-6 digits)'),

  body('coordinates')
    .optional()
    .isObject()
    .withMessage('Coordinates must be an object'),

  body('coordinates.lat')
    .optional()
    .isFloat({ min: -90, max: 90 })
    .withMessage('Latitude must be between -90 and 90'),

  body('coordinates.lng')
    .optional()
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitude must be between -180 and 180')
];
// ============ END UPDATE LOCATION VALIDATION ============

const becomeAgentValidation = [
  body('company')
    .notEmpty()
    .withMessage('Company name is required')
    .isLength({ max: 100 })
    .withMessage('Company name cannot exceed 100 characters'),
  
  body('licenseNumber')
    .notEmpty()
    .withMessage('License number is required')
    .isLength({ max: 50 })
    .withMessage('License number cannot exceed 50 characters'),
  
  body('phone')
    .notEmpty()
    .withMessage('Phone number is required for agents')
    .isMobilePhone()
    .withMessage('Please enter a valid phone number')
    .custom(async (phone, { req }) => {
      const existingUser = await User.findOne({ phone, _id: { $ne: req.user.id } });
      if (existingUser) {
        throw new Error('Phone number is already registered to another account');
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

  // ============ NEW: ADDRESS FOR BECOME AGENT ============
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
    .withMessage('Invalid postal code format (5-6 digits)')
  // ============ END ADDRESS FOR BECOME AGENT ============
];

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

const submitReviewValidation = [
  param('agentId')
    .isMongoId()
    .withMessage('Invalid agent ID')
    .custom(async (agentId, { req }) => {
      const agent = await User.findOne({ 
        _id: agentId, 
        role: 'agent',
        isActive: true 
      });
      
      if (!agent) {
        throw new Error('Agent not found or not active');
      }
      
      if (agentId === req.user.id.toString()) {
        throw new Error('You cannot review yourself');
      }
      
      return true;
    }),
  
  body('rating')
    .notEmpty()
    .withMessage('Rating is required')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  
  body('comment')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Comment cannot exceed 1000 characters')
    .trim(),
  
  body('transactionType')
    .notEmpty()
    .withMessage('Transaction type is required')
    .isIn(['sale', 'rent'])
    .withMessage('Transaction type must be sale or rent')
];

// ============ NEW: PROPERTY ID VALIDATION ============
const propertyIdValidation = [
  param('propertyId')
    .isMongoId()
    .withMessage('Invalid property ID')
];
// ============ END PROPERTY ID VALIDATION ============

module.exports = {
  updateProfileValidation,
  updateAgentProfileValidation,    // NEW: Renamed from agentProfileValidation
  updateLocationValidation,        // NEW
  becomeAgentValidation,
  changePasswordValidation,
  updatePreferencesValidation,
  submitReviewValidation,
  propertyIdValidation             // NEW
};