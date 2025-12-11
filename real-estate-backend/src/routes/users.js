const express = require('express');
const {
  getProfile,
  updateProfile,
  becomeAgent,
  getFavorites,
  addToFavorites,
  removeFromFavorites,
  getDashboardStats,
  updatePreferences,
  changePassword,
  uploadAvatar,
  deleteAvatar,
  getMyProperties,
  getMyInquiries,
  getAgentProfile,
  getAgentReviews,
  submitAgentReview,
  updateAgentProfile,
  getAgentStats
} = require('../controllers/userController');

const {
  updateProfileValidation,
  becomeAgentValidation,
  changePasswordValidation,
  updatePreferencesValidation,
  agentProfileValidation,
  submitReviewValidation
} = require('../validations/userValidation');

const { auth, authorize, optionalAuth } = require('../middleware/auth');
const { handleValidationErrors } = require('../middleware/validationMiddleware');
const { uploadSingle } = require('../middleware/upload');

const router = express.Router();

// Public routes (agent profiles)
router.get('/profile/agent/:id', optionalAuth, getAgentProfile);
router.get('/profile/agent/:id/reviews', getAgentReviews);

// Protected routes (all require authentication)
router.use(auth);

// Profile management
router.get('/profile', getProfile);
router.put('/profile', updateProfileValidation, handleValidationErrors, updateProfile);
router.put('/profile/agent', authorize('agent', 'admin'), agentProfileValidation, handleValidationErrors, updateAgentProfile);

// Avatar management - FIXED
router.post(
  '/profile/avatar', 
  uploadSingle('avatar'),
  uploadAvatar
);

router.delete('/profile/avatar', deleteAvatar);

// Password management
router.put('/change-password', changePasswordValidation, handleValidationErrors, changePassword);

// Agent registration
router.post('/become-agent', becomeAgentValidation, handleValidationErrors, becomeAgent);

// Favorites management
router.get('/favorites', getFavorites);
router.post('/favorites/:propertyId', addToFavorites);
router.delete('/favorites/:propertyId', removeFromFavorites);

// Dashboard & analytics
router.get('/dashboard/stats', getDashboardStats);
router.get('/dashboard/agent-stats', authorize('agent', 'admin'), getAgentStats);
router.get('/dashboard/my-properties', authorize('agent', 'admin'), getMyProperties);
router.get('/dashboard/my-inquiries', getMyInquiries);

// Reviews & ratings
router.post('/reviews/agent/:agentId', submitReviewValidation, handleValidationErrors, submitAgentReview);

// Preferences
router.put('/preferences', updatePreferencesValidation, handleValidationErrors, updatePreferences);

module.exports = router;