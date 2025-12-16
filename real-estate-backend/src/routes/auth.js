const express = require('express');
const {
  register,
  registerAgent,
  login,
  getMe,
  updateProfile,
  updateLocation,
  updatePreferences,
  changePassword,
  logout,
  logoutAll,
  forgotPassword,
  resetPassword,
  verifyEmail,
  resendVerification,
  getUsersByLocation,
  getAgentsByLocation,
  getUsers,
  getUser,
  updateUserStatus,
  deleteUser
} = require('../controllers/authController');

const {
  registerValidation,
  loginValidation,
  updateProfileValidation,
  changePasswordValidation,
  agentRegistrationValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
  updateLocationValidation,
  updatePreferencesValidation
} = require('../validations/authValidation');

const { 
  auth, 
  authorize, 
  optionalAuth,
  isAgentWithCompleteProfile,
  isVerifiedAgent,
  hasCompleteProfile,
  hasCompleteLocation 
} = require('../middleware/auth');

const { handleValidationErrors } = require('../middleware/validationMiddleware');

const router = express.Router();

// ==================== PUBLIC ROUTES ====================

// Authentication
router.post('/register', registerValidation, handleValidationErrors, register);
router.post('/register/agent', agentRegistrationValidation, handleValidationErrors, registerAgent);
router.post('/login', loginValidation, handleValidationErrors, login);
router.post('/forgot-password', forgotPasswordValidation, handleValidationErrors, forgotPassword);
router.post('/reset-password', resetPasswordValidation, handleValidationErrors, resetPassword);

// Email Verification
router.post('/verify-email', verifyEmail);
router.post('/resend-verification', resendVerification);

// Public agent listings by location
router.get('/agents/location', getAgentsByLocation);

// ==================== PROTECTED ROUTES (REQUIRE AUTH) ====================

// User profile management
router.get('/me', auth, getMe);
router.put('/profile', auth, updateProfileValidation, handleValidationErrors, updateProfile);
router.put('/update-location', auth, updateLocationValidation, handleValidationErrors, updateLocation);
router.put('/update-preferences', auth, updatePreferencesValidation, handleValidationErrors, updatePreferences);
router.put('/change-password', auth, changePasswordValidation, handleValidationErrors, changePassword);

// Session management
router.post('/logout', auth, logout);
router.post('/logout-all', auth, logoutAll);

// ==================== AGENT SPECIFIC ROUTES ====================

// Agent profile completion
router.get('/agent/profile-complete', auth, isAgentWithCompleteProfile, (req, res) => {
  res.json({
    success: true,
    message: 'Agent profile is complete',
    data: {
      profileCompletion: req.user.profileCompletion,
      hasCompleteLocation: req.user.hasCompleteLocation()
    }
  });
});

// ==================== ADMIN ROUTES ====================

// User management
router.get('/users', auth, authorize('admin'), getUsers);
router.get('/users/location', auth, authorize('admin'), getUsersByLocation);
router.get('/users/:id', auth, authorize('admin'), getUser);
router.patch('/users/:id/status', auth, authorize('admin'), updateUserStatus);
router.delete('/users/:id', auth, authorize('admin'), deleteUser);

// ==================== OPTIONAL AUTH ROUTES ====================

// Public profiles with optional authentication
router.get('/profile/:id', optionalAuth, getUser);

module.exports = router;