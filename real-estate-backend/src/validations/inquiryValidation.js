const { body } = require('express-validator');
const Property = require('../models/Property');
const User = require('../models/User');

const createInquiryValidation = [
  body('propertyId')
    .notEmpty()
    .withMessage('Property ID is required')
    .isMongoId()
    .withMessage('Invalid property ID')
    .custom(async (propertyId) => {
      const property = await Property.findById(propertyId);
      if (!property) {
        throw new Error('Property not found');
      }
      if (!property.isActive || property.status !== 'approved') {
        throw new Error('Property is not available for inquiries');
      }
      return true;
    }),
  
  body('type')
    .optional()
    .isIn(['general', 'viewing', 'pricing', 'details', 'custom'])
    .withMessage('Inquiry type must be general, viewing, pricing, details, or custom'),
  
  body('subject')
    .notEmpty()
    .withMessage('Subject is required')
    .isLength({ max: 100 })
    .withMessage('Subject cannot exceed 100 characters'),
  
  body('message')
    .notEmpty()
    .withMessage('Message is required')
    .isLength({ max: 1000 })
    .withMessage('Message cannot exceed 1000 characters'),
  
  body('contactPreference')
    .optional()
    .isIn(['phone', 'email', 'both'])
    .withMessage('Contact preference must be phone, email, or both'),
  
  body('preferredContactTime')
    .optional()
    .isIn(['morning', 'afternoon', 'evening', 'anytime'])
    .withMessage('Preferred contact time must be morning, afternoon, evening, or anytime'),
  
  body('urgency')
    .optional()
    .isIn(['not_urgent', 'within_week', 'within_month', 'immediate'])
    .withMessage('Urgency must be not_urgent, within_week, within_month, or immediate'),
  
  body('budget.min')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Minimum budget must be a positive number'),
  
  body('budget.max')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Maximum budget must be a positive number'),
  
  body('timeline')
    .optional()
    .isIn(['immediate', '1_3_months', '3_6_months', '6_12_months', 'flexible'])
    .withMessage('Timeline must be immediate, 1_3_months, 3_6_months, 6_12_months, or flexible')
];

const updateStatusValidation = [
  body('status')
    .isIn(['new', 'contacted', 'viewing_scheduled', 'follow_up', 'interested', 'not_interested', 'negotiating', 'closed_success', 'closed_failed'])
    .withMessage('Invalid status value'),
  
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high', 'urgent'])
    .withMessage('Priority must be low, medium, high, or urgent')
];

const updateVisitStatusValidation = [
  body('visitStatus')
    .isIn(['pending', 'confirmed', 'cancelled', 'completed', 'rescheduled'])
    .withMessage('Visit status must be pending, confirmed, cancelled, completed, or rescheduled'),
  
  body('visitNotes')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Visit notes cannot exceed 500 characters')
];

const scheduleVisitValidation = [
  body('date')
    .isISO8601()
    .withMessage('Visit date must be a valid date')
    .custom((date) => {
      if (new Date(date) <= new Date()) {
        throw new Error('Visit date must be in the future');
      }
      return true;
    }),
  
  body('time')
    .notEmpty()
    .withMessage('Visit time is required'),
  
  body('duration')
    .optional()
    .isInt({ min: 15, max: 240 })
    .withMessage('Duration must be between 15 and 240 minutes'),
  
  body('notes')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Visit notes cannot exceed 500 characters')
];

const addResponseValidation = [
  body('message')
    .notEmpty()
    .withMessage('Response message is required')
    .isLength({ max: 1000 })
    .withMessage('Response message cannot exceed 1000 characters'),
  
  body('isInternal')
    .optional()
    .isBoolean()
    .withMessage('isInternal must be a boolean value')
];

const addNoteValidation = [
  body('note')
    .notEmpty()
    .withMessage('Note is required')
    .isLength({ max: 500 })
    .withMessage('Note cannot exceed 500 characters')
];

const scheduleFollowUpValidation = [
  body('scheduledDate')
    .isISO8601()
    .withMessage('Follow-up date must be a valid date')
    .custom((date) => {
      if (new Date(date) <= new Date()) {
        throw new Error('Follow-up date must be in the future');
      }
      return true;
    }),
  
  body('notes')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Follow-up notes cannot exceed 500 characters'),
  
  body('method')
    .optional()
    .isIn(['email', 'phone', 'sms', 'in_person'])
    .withMessage('Follow-up method must be email, phone, sms, or in_person')
];

module.exports = {
  createInquiryValidation,
  updateStatusValidation,
  updateVisitStatusValidation,
  scheduleVisitValidation,
  addResponseValidation,
  addNoteValidation,
  scheduleFollowUpValidation
};