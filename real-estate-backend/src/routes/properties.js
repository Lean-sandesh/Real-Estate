const express = require('express');
const {
  getProperties,
  getProperty,
  createProperty,
  updateProperty,
  deleteProperty,
  getMyProperties,
  uploadPropertyImages,
  deletePropertyImage,
  getFeaturedProperties,
  getNewLaunches,
  getProjects,
  togglePropertyLike,
  updatePropertyStatus,
  searchProperties
} = require('../controllers/propertyController');
const { 
  createPropertyValidation, 
  updatePropertyValidation, 
  updatePropertyStatusValidation 
} = require('../validations/propertyValidation');
const { auth, authorize } = require('../middleware/auth');
const { uploadMultiple, uploadSingle } = require('../middleware/upload');

const router = express.Router();

// Public routes
router.get('/', getProperties);
router.get('/featured', getFeaturedProperties);
router.get('/new-launches', getNewLaunches);
router.get('/projects', getProjects);
router.get('/search', searchProperties);
router.get('/:id', getProperty);

// Protected routes (require authentication)
router.post('/:id/like', auth, togglePropertyLike);

// Agent/Admin routes - Create Property with images
router.post(
  '/', 
  auth, 
  authorize('agent', 'admin'),
  uploadMultiple('images', 10),
  createPropertyValidation, 
  createProperty
);

router.get(
  '/my/properties', 
  auth, 
  authorize('agent', 'admin'), 
  getMyProperties
);

router.put(
  '/:id', 
  auth, 
  authorize('agent', 'admin'), 
  updatePropertyValidation, 
  updateProperty
);

router.delete(
  '/:id', 
  auth, 
  authorize('agent', 'admin'), 
  deleteProperty
);

// Image upload routes
router.post(
  '/:id/images',
  auth,
  authorize('agent', 'admin'),
  uploadMultiple('images', 10),
  uploadPropertyImages
);

// Upload brochure for property
router.post(
  '/:id/brochure',
  auth,
  authorize('agent', 'admin'),
  uploadSingle('brochure'),
  async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No brochure file uploaded'
        });
      }
      
      res.json({
        success: true,
        message: 'Brochure uploaded successfully',
        brochure: req.file
      });
    } catch (error) {
      next(error);
    }
  }
);

// Upload floor plans
router.post(
  '/:id/plans',
  auth,
  authorize('agent', 'admin'),
  uploadMultiple('plans', 5),
  async (req, res, next) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No plan files uploaded'
        });
      }
      
      res.json({
        success: true,
        message: 'Plans uploaded successfully',
        plans: req.files
      });
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  '/:id/images/:imageId',
  auth,
  authorize('agent', 'admin'),
  deletePropertyImage
);

// Admin-only routes
router.patch(
  '/:id/status',
  auth,
  authorize('admin'),
  updatePropertyStatusValidation,
  updatePropertyStatus
);

module.exports = router;