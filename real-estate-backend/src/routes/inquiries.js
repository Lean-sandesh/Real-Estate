const express = require('express');
const {
  createInquiry,
  getMyInquiries,
  getAgentInquiries,
  updateInquiryStatus,
  updateVisitStatus,
  scheduleVisit,
  addResponse,
  addInternalNote,
  getInquiry,
  getInquiryStats,
  getUpcomingVisits,
  getOverdueFollowUps,
  markAsRead,
  scheduleFollowUp
} = require('../controllers/inquiryController');

const {
  createInquiryValidation,
  updateStatusValidation,
  updateVisitStatusValidation,
  scheduleVisitValidation,
  addResponseValidation,
  addNoteValidation,
  scheduleFollowUpValidation
} = require('../validations/inquiryValidation');

const { auth, authorize } = require('../middleware/auth');
const { handleValidationErrors } = require('../middleware/validationMiddleware');

const router = express.Router();

// All routes require authentication
router.use(auth);

// Inquiry creation (users and agents)
router.post('/', createInquiryValidation, handleValidationErrors, createInquiry);

// Get inquiries
router.get('/my-inquiries', getMyInquiries); // User's own inquiries
router.get('/agent/inquiries', authorize('agent', 'admin'), getAgentInquiries); // Agent's received inquiries
router.get('/:id', getInquiry); // Get specific inquiry

// Inquiry management (agent/admin only)
router.put('/:id/status', authorize('agent', 'admin'), updateStatusValidation, handleValidationErrors, updateInquiryStatus);
router.put('/:id/visit', authorize('agent', 'admin'), scheduleVisitValidation, handleValidationErrors, scheduleVisit);
router.put('/:id/visit-status', authorize('agent', 'admin'), updateVisitStatusValidation, handleValidationErrors, updateVisitStatus);

// Communication (both users and agents)
router.post('/:id/responses', addResponseValidation, handleValidationErrors, addResponse);

// Internal notes (agent/admin only)
router.post('/:id/notes', authorize('agent', 'admin'), addNoteValidation, handleValidationErrors, addInternalNote);

// Follow-ups (agent/admin only)
router.post('/:id/follow-ups', authorize('agent', 'admin'), scheduleFollowUpValidation, handleValidationErrors, scheduleFollowUp);

// Mark as read
router.patch('/:id/read', markAsRead);

// Dashboard and analytics (agent/admin only)
router.get('/agent/stats', authorize('agent', 'admin'), getInquiryStats);
router.get('/agent/upcoming-visits', authorize('agent', 'admin'), getUpcomingVisits);
router.get('/agent/overdue-followups', authorize('agent', 'admin'), getOverdueFollowUps);

module.exports = router;