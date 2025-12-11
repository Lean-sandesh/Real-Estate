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
  
  // body('confirmPassword')
  //   .notEmpty()
  //   .withMessage('Confirm password is required')
  //   .custom((value, { req }) => {
  //     if (value !== req.body.password) {
  //       throw new Error('Passwords do not match');
  //     }
  //     return true;
  //   }),
  
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
    })
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
    .withMessage('Please enter a valid Facebook URL')
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

const agentRegistrationValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  
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
    .notEmpty()
    .withMessage('Phone number is required for agents')
    .isMobilePhone()
    .withMessage('Please enter a valid phone number')
    .custom(async (phone) => {
      const existingUser = await User.findOne({ phone });
      if (existingUser) {
        throw new Error('Phone number is already registered');
      }
      return true;
    }),
  
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
  loginValidation,
  updateProfileValidation,
  changePasswordValidation,
  agentRegistrationValidation,
  forgotPasswordValidation,
  resetPasswordValidation
};