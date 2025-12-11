const { validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    // Group errors by field for better client-side handling
    const errorGroups = {};
    errors.array().forEach(error => {
      if (!errorGroups[error.param]) {
        errorGroups[error.param] = [];
      }
      errorGroups[error.param].push({
        message: error.msg,
        value: error.value,
        location: error.location
      });
    });

    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errorType: 'VALIDATION_ERROR',
      timestamp: new Date().toISOString(),
      errors: errors.array().map(error => ({
        field: error.param,
        message: error.msg,
        value: error.value,
        location: error.location
      })),
      // Optional: grouped errors for easier client-side processing
      groupedErrors: errorGroups
    });
  }
  
  next();
};

// Optional: Specific middleware for different error scenarios
const handleAsyncValidation = (validator) => {
  return async (req, res, next) => {
    try {
      await Promise.all(validator.map(validation => validation.run(req)));
      handleValidationErrors(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};

// Optional: Sanitize middleware to trim and clean data
const sanitizeData = (req, res, next) => {
  if (req.body) {
    // Trim string fields
    Object.keys(req.body).forEach(key => {
      if (typeof req.body[key] === 'string') {
        req.body[key] = req.body[key].trim();
      }
    });

    // Convert empty strings to null for optional fields
    const optionalFields = ['description', 'contactInfo.phone', 'contactInfo.email'];
    optionalFields.forEach(field => {
      const keys = field.split('.');
      let obj = req.body;
      for (let i = 0; i < keys.length - 1; i++) {
        if (obj[keys[i]] && typeof obj[keys[i]] === 'object') {
          obj = obj[keys[i]];
        }
      }
      const lastKey = keys[keys.length - 1];
      if (obj[lastKey] === '') {
        obj[lastKey] = null;
      }
    });
  }
  next();
};

module.exports = {
  handleValidationErrors,
  handleAsyncValidation,
  sanitizeData
};