const express = require('express');
const {
  getProfile,
  updateProfile,
  updateAgentProfile,
  updateLocation,
  updatePreferences,
  becomeAgent,
  getFavorites,
  addToFavorites,
  removeFromFavorites,
  getDashboardStats,
  getAgentStats,
  getMyProperties,
  getMyInquiries,
  getAgentProfile,
  getAgentsByLocation,
  getAgentReviews,
  submitAgentReview,
  uploadAvatar,
  deleteAvatar,
  changePassword
} = require('../controllers/userController');

const {
  updateProfileValidation,
  updateAgentProfileValidation,
  updateLocationValidation,
  becomeAgentValidation,
  changePasswordValidation,
  updatePreferencesValidation,
  submitReviewValidation
} = require('../validations/userValidation');

const { 
  auth, 
  authorize, 
  optionalAuth,
  isVerifiedAgent,
  isAgentWithCompleteProfile,
  canReviewAgent,
  hasCompleteProfile,
  hasCompleteLocation 
} = require('../middleware/auth');

const { handleValidationErrors } = require('../middleware/validationMiddleware');
const { uploadSingle } = require('../middleware/upload');

const router = express.Router();

// ==================== PUBLIC ROUTES ====================

// Public agent profiles
router.get('/profile/agent/:id', optionalAuth, getAgentProfile);
router.get('/profile/agent/:id/reviews', getAgentReviews);

// Find agents by location (public)
router.get('/agents/location', getAgentsByLocation);

// ==================== PROTECTED ROUTES ====================

// Apply authentication to all following routes
router.use(auth);

// ==================== PROFILE MANAGEMENT ====================

// Get and update user profile
router.get('/profile', getProfile);
router.put('/profile', updateProfileValidation, handleValidationErrors, updateProfile);

// Update location
router.put('/update-location', updateLocationValidation, handleValidationErrors, updateLocation);

// Update preferences
router.put('/update-preferences', updatePreferencesValidation, handleValidationErrors, updatePreferences);

// Agent profile management
router.put('/profile/agent', authorize('agent', 'admin'), updateAgentProfileValidation, handleValidationErrors, updateAgentProfile);

// ==================== AVATAR MANAGEMENT ====================

router.post('/profile/avatar', uploadSingle('avatar'), uploadAvatar);
router.delete('/profile/avatar', deleteAvatar);

// ==================== PASSWORD MANAGEMENT ====================

router.put('/change-password', changePasswordValidation, handleValidationErrors, changePassword);

// ==================== AGENT REGISTRATION ====================

router.post('/become-agent', becomeAgentValidation, handleValidationErrors, becomeAgent);

// ==================== FAVORITES MANAGEMENT ====================

router.get('/favorites', getFavorites);
router.post('/favorites/:propertyId', addToFavorites);
router.delete('/favorites/:propertyId', removeFromFavorites);

// ==================== DASHBOARD & ANALYTICS ====================

// General dashboard stats
router.get('/dashboard/stats', getDashboardStats);

// Agent-specific dashboard
router.get('/dashboard/agent-stats', authorize('agent', 'admin'), getAgentStats);
router.get('/dashboard/my-properties', authorize('agent', 'admin'), getMyProperties);

// Inquiries (both users and agents)
router.get('/dashboard/my-inquiries', getMyInquiries);

// Agent profile completion check
router.get('/dashboard/profile-complete', authorize('agent', 'admin'), isAgentWithCompleteProfile, (req, res) => {
  res.json({
    success: true,
    message: 'Agent profile is complete',
    data: {
      profileCompletion: req.user.profileCompletion,
      hasCompleteLocation: req.user.hasCompleteLocation(),
      isVerified: req.user.isEmailVerified,
      isActive: req.user.isActive
    }
  });
});

// Location insights
router.get('/dashboard/location-insights', authorize('agent', 'admin'), (req, res) => {
  // This would typically be in controller, but simplified here
  res.json({
    success: true,
    message: 'Location insights',
    data: {
      userLocation: req.user.address,
      formattedAddress: req.user.getFormattedAddress(),
      hasCompleteLocation: req.user.hasCompleteLocation()
    }
  });
});

// ==================== REVIEWS & RATINGS ====================

router.post(
  '/reviews/agent/:agentId', 
  canReviewAgent,
  submitReviewValidation, 
  handleValidationErrors, 
  submitAgentReview
);

// ==================== VERIFICATION CHECKS ====================

// Check if agent is verified and can perform actions
router.get('/verify/agent-status', authorize('agent', 'admin'), isVerifiedAgent, (req, res) => {
  res.json({
    success: true,
    message: 'Agent is verified and approved',
    data: {
      isEmailVerified: req.user.isEmailVerified,
      isActive: req.user.isActive,
      canAccessAgentFeatures: req.user.canAccessAgentFeatures()
    }
  });
});

// Check profile completeness
router.get('/verify/profile-complete', hasCompleteProfile(70), (req, res) => {
  res.json({
    success: true,
    message: 'Profile is complete',
    data: {
      profileCompletion: req.user.profileCompletion,
      requiredCompletion: 70
    }
  });
});

// Check location completeness
router.get('/verify/location-complete', hasCompleteLocation, (req, res) => {
  res.json({
    success: true,
    message: 'Location is complete',
    data: {
      address: req.user.address,
      formattedAddress: req.user.getFormattedAddress(),
      hasCompleteLocation: req.user.hasCompleteLocation()
    }
  });
});

module.exports = router;