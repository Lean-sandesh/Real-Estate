const { body } = require('express-validator');

const createPropertyValidation = [
  body('title')
    .notEmpty()
    .withMessage('Property title is required')
    .isLength({ max: 100 })
    .withMessage('Title cannot exceed 100 characters'),
  
  body('description')
    .notEmpty()
    .withMessage('Property description is required')
    .isLength({ max: 1000 })
    .withMessage('Description cannot exceed 1000 characters'),
  
  body('type')
    .isIn(['sale', 'rent', 'pre-launch'])
    .withMessage('Property type must be either sale, rent, or pre-launch'),
  
  body('category')
    .isIn(['residential', 'commercial', 'land', 'industrial', 'project', 'new-launch'])
    .withMessage('Property category must be residential, commercial, land, industrial, project, or new-launch'),
  
  body('price')
    .optional({ checkFalsy: true })
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number')
    .custom((value, { req }) => {
      // Price is required for all categories except 'project'
      if (req.body.category !== 'project' && (!value || value === '')) {
        throw new Error('Price is required for this property category');
      }
      return true;
    }),
  
  body('location.address')
    .notEmpty()
    .withMessage('Address is required'),
  
  body('location.city')
    .notEmpty()
    .withMessage('City is required'),
  
  body('location.state')
    .notEmpty()
    .withMessage('State is required'),
  
  body('location.zipCode')
    .notEmpty()
    .withMessage('ZIP code is required'),
  
  body('specifications.bedrooms')
    .optional({ checkFalsy: true })
    .isInt({ min: 0 })
    .withMessage('Bedrooms must be a positive integer')
    .custom((value, { req }) => {
      // Bedrooms required for non-project categories
      if (req.body.category !== 'project' && (!value || value === '')) {
        throw new Error('Number of bedrooms is required for this property category');
      }
      return true;
    }),
  
  body('specifications.bathrooms')
    .optional({ checkFalsy: true })
    .isFloat({ min: 0 })
    .withMessage('Bathrooms must be a positive number')
    .custom((value, { req }) => {
      // Bathrooms required for non-project categories
      if (req.body.category !== 'project' && (!value || value === '')) {
        throw new Error('Number of bathrooms is required for this property category');
      }
      return true;
    }),
  
  body('specifications.area')
    .optional({ checkFalsy: true })
    .isFloat({ min: 0 })
    .withMessage('Area must be a positive number')
    .custom((value, { req }) => {
      // Area required for non-project categories
      if (req.body.category !== 'project' && (!value || value === '')) {
        throw new Error('Property area is required for this property category');
      }
      return true;
    }),
  
  body('specifications.areaUnit')
    .optional()
    .isIn(['sqft', 'sqm'])
    .withMessage('Area unit must be either sqft or sqm'),
  
  // Project-specific validations
  body('projectDetails.projectName')
    .optional()
    .custom((value, { req }) => {
      // Project name required for project and new-launch categories
      if ((req.body.category === 'project' || req.body.category === 'new-launch') && (!value || value === '')) {
        throw new Error('Project name is required for project and new-launch categories');
      }
      return true;
    }),
  
  body('projectDetails.developer')
    .optional()
    .custom((value, { req }) => {
      // Developer required for project and new-launch categories
      if ((req.body.category === 'project' || req.body.category === 'new-launch') && (!value || value === '')) {
        throw new Error('Developer name is required for project and new-launch categories');
      }
      return true;
    }),
  
  body('projectDetails.totalUnits')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Total units must be a positive integer'),
  
  body('projectDetails.unitsAvailable')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Available units must be a positive integer'),
  
  body('projectDetails.launchDate')
    .optional()
    .isISO8601()
    .withMessage('Launch date must be a valid date')
    .custom((value, { req }) => {
      // Launch date required for new-launch category
      if (req.body.category === 'new-launch' && (!value || value === '')) {
        throw new Error('Launch date is required for new-launch properties');
      }
      return true;
    }),
  
  body('projectDetails.projectPhase')
    .optional()
    .isIn(['planning', 'under-construction', 'completed', 'possession'])
    .withMessage('Project phase must be planning, under-construction, completed, or possession'),
  
  // Price range validations for projects
  body('priceRange.minPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Minimum price must be a positive number'),
  
  body('priceRange.maxPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Maximum price must be a positive number')
    .custom((value, { req }) => {
      // Max price should be >= min price
      if (value && req.body.priceRange?.minPrice && value < req.body.priceRange.minPrice) {
        throw new Error('Maximum price must be greater than or equal to minimum price');
      }
      return true;
    }),
  
  body('priceRange.pricePerUnit')
    .optional()
    .isIn(['sqft', 'sqm', 'acre', 'hectare'])
    .withMessage('Price per unit must be sqft, sqm, acre, or hectare'),
  
  // Amenities validation
  body('amenities')
    .optional()
    .isArray()
    .withMessage('Amenities must be an array'),
  
  body('amenities.*')
    .isString()
    .withMessage('Each amenity must be a string')
    .trim()
    .notEmpty()
    .withMessage('Amenity cannot be empty'),
  
  // Project amenities validation
  body('projectDetails.projectAmenities')
    .optional()
    .isArray()
    .withMessage('Project amenities must be an array'),
  
  body('projectDetails.projectAmenities.*')
    .isString()
    .withMessage('Each project amenity must be a string')
    .trim()
    .notEmpty()
    .withMessage('Project amenity cannot be empty'),
  
  // Contact info validation
  body('contactInfo.email')
    .optional()
    .isEmail()
    .withMessage('Please provide a valid email address'),
  
  body('contactInfo.phone')
    .optional()
    .isMobilePhone()
    .withMessage('Please provide a valid phone number'),
  
  // Tags validation
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  
  body('tags.*')
    .isString()
    .withMessage('Each tag must be a string')
    .trim()
    .notEmpty()
    .withMessage('Tag cannot be empty')
];

const updatePropertyValidation = [
  body('title')
    .optional()
    .notEmpty()
    .withMessage('Property title cannot be empty')
    .isLength({ max: 100 })
    .withMessage('Title cannot exceed 100 characters'),
  
  body('description')
    .optional()
    .notEmpty()
    .withMessage('Property description cannot be empty')
    .isLength({ max: 1000 })
    .withMessage('Description cannot exceed 1000 characters'),
  
  body('type')
    .optional()
    .isIn(['sale', 'rent', 'pre-launch'])
    .withMessage('Property type must be either sale, rent, or pre-launch'),
  
  body('category')
    .optional()
    .isIn(['residential', 'commercial', 'land', 'industrial', 'project', 'new-launch'])
    .withMessage('Property category must be residential, commercial, land, industrial, project, or new-launch'),
  
  body('price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  
  body('specifications.bedrooms')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Bedrooms must be a positive integer'),
  
  body('specifications.bathrooms')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Bathrooms must be a positive number'),
  
  body('specifications.area')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Area must be a positive number'),
  
  body('projectDetails.launchDate')
    .optional()
    .isISO8601()
    .withMessage('Launch date must be a valid date'),
  
  body('projectDetails.projectPhase')
    .optional()
    .isIn(['planning', 'under-construction', 'completed', 'possession'])
    .withMessage('Project phase must be planning, under-construction, completed, or possession'),
  
  body('priceRange.minPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Minimum price must be a positive number'),
  
  body('priceRange.maxPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Maximum price must be a positive number')
];

const updatePropertyStatusValidation = [
  body('status')
    .isIn(['pending', 'approved', 'rejected', 'sold', 'rented', 'under-construction', 'completed'])
    .withMessage('Status must be pending, approved, rejected, sold, rented, under-construction, or completed')
];

module.exports = {
  createPropertyValidation,
  updatePropertyValidation,
  updatePropertyStatusValidation
};