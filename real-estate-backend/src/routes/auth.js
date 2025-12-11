const express = require('express');
const {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
  logout,
  logoutAll,
  forgotPassword,
  resetPassword,
  verifyEmail,
  resendVerification,
  registerAgent,
  updateUserStatus,
  getUsers,
  getUser,
  deleteUser
} = require('../controllers/authController');
const { uploadSingle } = require("../middleware/upload");



const {
  registerValidation,
  loginValidation,
  updateProfileValidation,
  changePasswordValidation,
  agentRegistrationValidation,
  forgotPasswordValidation,
  resetPasswordValidation
} = require('../validations/authValidation');

const { auth, authorize, optionalAuth } = require('../middleware/auth');
const { handleValidationErrors } = require('../middleware/validationMiddleware');

const router = express.Router();

// Public routes
router.post('/register', registerValidation, handleValidationErrors, register);
router.post('/register/agent', agentRegistrationValidation, handleValidationErrors, registerAgent);
router.post('/login', loginValidation, handleValidationErrors, login);
router.post('/forgot-password', forgotPasswordValidation, handleValidationErrors, forgotPassword);
router.post('/reset-password', resetPasswordValidation, handleValidationErrors, resetPassword);
router.post('/verify-email', verifyEmail);
router.post('/resend-verification', resendVerification);

// Protected routes (require authentication)
router.get('/me', auth, getMe);
router.put(
  '/profile',
  auth,
  uploadSingle("avatar"),   
  updateProfileValidation,
  handleValidationErrors,
  updateProfile
);

router.put('/change-password', auth, changePasswordValidation, handleValidationErrors, changePassword);
router.post('/logout', auth, logout);
router.post('/logout-all', auth, logoutAll);

// Admin only routes
router.get('/users', auth, authorize('admin'), getUsers);
router.get('/users/:id', auth, authorize('admin'), getUser);
router.patch('/users/:id/status', auth, authorize('admin'), updateUserStatus);
router.delete('/users/:id', auth, authorize('admin'), deleteUser);

// Optional auth routes (for public profiles)
router.get('/profile/:id', optionalAuth, getUser);

module.exports = router;