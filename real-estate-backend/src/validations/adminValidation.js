const { body } = require('express-validator');

const updateRoleValidation = [
  body('role')
    .isIn(['user', 'agent', 'admin'])
    .withMessage('Role must be user, agent, or admin')
];

const updateUserStatusValidation = [
  body('isActive')
    .isBoolean()
    .withMessage('isActive must be a boolean value'),
  
  body('reason')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Reason cannot exceed 500 characters')
];

const updatePropertyStatusValidation = [
  body('status')
    .isIn(['approved', 'rejected', 'pending'])
    .withMessage('Status must be approved, rejected, or pending'),
  
  body('rejectionReason')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Rejection reason cannot exceed 500 characters'),
  
  body('adminNotes')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Admin notes cannot exceed 1000 characters')
];

const bulkUpdateValidation = [
  body('propertyIds')
    .isArray({ min: 1 })
    .withMessage('Property IDs must be an array with at least one ID'),
  
  body('propertyIds.*')
    .isMongoId()
    .withMessage('Each property ID must be a valid MongoDB ID'),
  
  body('updates.status')
    .optional()
    .isIn(['approved', 'rejected', 'pending', 'draft'])
    .withMessage('Invalid status value'),
  
  body('updates.isFeatured')
    .optional()
    .isBoolean()
    .withMessage('isFeatured must be a boolean value'),
  
  body('updates.isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean value')
];

const announcementValidation = [
  body('title')
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 200 })
    .withMessage('Title cannot exceed 200 characters'),
  
  body('message')
    .notEmpty()
    .withMessage('Message is required')
    .isLength({ max: 2000 })
    .withMessage('Message cannot exceed 2000 characters'),
  
  body('type')
    .isIn(['info', 'warning', 'success', 'maintenance'])
    .withMessage('Type must be info, warning, success, or maintenance'),
  
  body('targetUsers')
    .optional()
    .isIn(['all', 'agents', 'users', 'specific'])
    .withMessage('Target users must be all, agents, users, or specific'),
  
  body('specificUsers')
    .optional()
    .isArray()
    .withMessage('Specific users must be an array'),
  
  body('specificUsers.*')
    .isMongoId()
    .withMessage('Each user ID must be a valid MongoDB ID'),
  
  body('isImportant')
    .optional()
    .isBoolean()
    .withMessage('isImportant must be a boolean value')
];

module.exports = {
  updateRoleValidation,
  updateUserStatusValidation,
  updatePropertyStatusValidation,
  bulkUpdateValidation,
  announcementValidation
};