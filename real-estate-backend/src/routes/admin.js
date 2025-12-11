const express = require('express');
const {
  getDashboardStats,
  getUsers,
  getUser,
  updateUserRole,
  updateUserStatus,
  deleteUser,
  getPendingProperties,
  updatePropertyStatus,
  togglePropertyFeatured,
  deleteProperty,
  getAgentApplications,
  approveAgentApplication,
  rejectAgentApplication,
  getSystemStats,
  getRecentActivities,
  getInquiryStats,
  bulkUpdateProperties,
  sendAnnouncement
} = require('../controllers/adminController');

const {
  updateRoleValidation,
  updateUserStatusValidation,
  updatePropertyStatusValidation,
  bulkUpdateValidation,
  announcementValidation
} = require('../validations/adminValidation');

const { auth, authorize } = require('../middleware/auth');
const { handleValidationErrors } = require('../middleware/validationMiddleware');

const Property = require("../models/Property");

const router = express.Router();

// All routes require admin authentication
router.use(auth, authorize('admin'));

// Dashboard & Analytics
router.get('/dashboard/stats', getDashboardStats);
router.get('/system/stats', getSystemStats);
router.get('/recent-activities', getRecentActivities);

// User Management
router.get('/users', getUsers);
router.get('/users/:id', getUser);
router.put('/users/:id/role', updateRoleValidation, handleValidationErrors, updateUserRole);
router.put('/users/:id/status', updateUserStatusValidation, handleValidationErrors, updateUserStatus);
router.delete('/users/:id', deleteUser);

// Agent Management
router.get('/agents/applications', getAgentApplications);
router.put('/agents/:id/approve', approveAgentApplication);
router.put('/agents/:id/reject', rejectAgentApplication);

// =====================================
// 🔥 PROPERTY MANAGEMENT (UPDATED)
// =====================================

// 1️⃣ GET ALL PROPERTIES (Missing Route Added)
router.get('/properties', async (req, res) => {
  try {
    const properties = await Property.find()
      .populate('agent', 'name email');

    res.json({
      success: true,
      data: { properties }
    });

  } catch (error) {
    console.error("Admin: Get All Properties Error →", error);
    res.status(500).json({
      success: false,
      message: "Failed to load properties"
    });
  }
});

// 2️⃣ GET PENDING PROPERTIES
router.get('/properties/pending', getPendingProperties);

// 3️⃣ UPDATE PROPERTY STATUS
router.put(
  '/properties/:id/status',
  updatePropertyStatusValidation,
  handleValidationErrors,
  updatePropertyStatus
);

// 4️⃣ TOGGLE FEATURED PROPERTY
router.put('/properties/:id/featured', togglePropertyFeatured);

// 5️⃣ DELETE PROPERTY
router.delete('/properties/:id', deleteProperty);

// 6️⃣ BULK UPDATE PROPERTIES
router.post(
  '/properties/bulk-update',
  bulkUpdateValidation,
  handleValidationErrors,
  bulkUpdateProperties
);

// Inquiry Management
router.get('/inquiries/stats', getInquiryStats);

// System Management
router.post('/announcements', announcementValidation, handleValidationErrors, sendAnnouncement);

module.exports = router;
