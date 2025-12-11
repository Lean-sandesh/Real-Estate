const { body } = require('express-validator');
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
    .withMessage('Please enter a valid Facebook URL')
];

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
    .withMessage('Please enter a valid phone number'),
  
  body('experience')
    .optional()
    .isInt({ min: 0, max: 60 })
    .withMessage('Experience must be between 0 and 60 years'),
  
  body('specializations')
    .optional()
    .isArray()
    .withMessage('Specializations must be an array'),
  
  body('specializations.*')
    .isString()
    .withMessage('Each specialization must be a string')
    .isLength({ max: 50 })
    .withMessage('Specialization cannot exceed 50 characters')
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
  body('preferences.notifications.email')
    .optional()
    .isBoolean()
    .withMessage('Email notifications must be a boolean value'),
  
  body('preferences.notifications.sms')
    .optional()
    .isBoolean()
    .withMessage('SMS notifications must be a boolean value'),
  
  body('preferences.notifications.push')
    .optional()
    .isBoolean()
    .withMessage('Push notifications must be a boolean value'),
  
  body('preferences.newsletter')
    .optional()
    .isBoolean()
    .withMessage('Newsletter preference must be a boolean value'),
  
  body('preferences.language')
    .optional()
    .isIn(['en', 'es', 'fr', 'de'])
    .withMessage('Language must be English, Spanish, French, or German')
];

const agentProfileValidation = [
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
    .isString()
    .withMessage('Each specialization must be a string')
    .isLength({ max: 50 })
    .withMessage('Specialization cannot exceed 50 characters'),
  
  body('bio')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Bio cannot exceed 500 characters')
];

const submitReviewValidation = [
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  
  body('comment')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Comment cannot exceed 1000 characters')
    .trim(),
  
  body('transactionType')
    .isIn(['sale', 'rent'])
    .withMessage('Transaction type must be sale or rent')
];

module.exports = {
  updateProfileValidation,
  becomeAgentValidation,
  changePasswordValidation,
  updatePreferencesValidation,
  agentProfileValidation,
  submitReviewValidation
};