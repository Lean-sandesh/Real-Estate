const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const path = require('path');

// Configure Cloudinary with additional options
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true // Always use HTTPS
});

// Enhanced file filter with more specific validations
const fileFilter = (req, file, cb) => {
  try {
    // Check if file exists
    if (!file) {
      return cb(new Error('No file provided'), false);
    }

    // Allowed MIME types
    const allowedMimeTypes = [
      'image/jpeg',
      'image/jpg', 
      'image/png',
      'image/webp',
      'image/gif',
      'application/pdf'
    ];

    // Allowed file extensions
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.pdf'];

    // Check MIME type
    if (!allowedMimeTypes.includes(file.mimetype)) {
      return cb(new Error(`File type ${file.mimetype} is not allowed. Allowed types: ${allowedMimeTypes.join(', ')}`), false);
    }

    // Check file extension
    const fileExtension = path.extname(file.originalname).toLowerCase();
    if (!allowedExtensions.includes(fileExtension)) {
      return cb(new Error(`File extension ${fileExtension} is not allowed. Allowed extensions: ${allowedExtensions.join(', ')}`), false);
    }

    // Additional security checks
    if (file.mimetype.startsWith('image/')) {
      // Check for potential malicious image files
      if (file.originalname.toLowerCase().includes('php') || 
          file.originalname.toLowerCase().includes('exe') ||
          file.originalname.toLowerCase().includes('script')) {
        return cb(new Error('Potential malicious file detected'), false);
      }
    }

    cb(null, true);
  } catch (error) {
    cb(error, false);
  }
};

// Configure multer for memory storage with better limits
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 10, // Maximum number of files
    fields: 20, // Maximum number of non-file fields
  },
  fileFilter: fileFilter,
  // Handle multer errors gracefully
  onError: (error, next) => {
    console.error('Multer error:', error);
    next(error);
  }
});

// Enhanced Cloudinary upload function with better error handling and options
const uploadToCloudinary = (file, folder = 'real-estate', options = {}) => {
  return new Promise((resolve, reject) => {
    try {
      if (!file || !file.buffer) {
        return reject(new Error('No file provided or file buffer is empty'));
      }

      // Validate file size (additional client-side validation)
      if (file.size > 10 * 1024 * 1024) {
        return reject(new Error('File size exceeds 10MB limit'));
      }

      // Convert buffer to base64
      const fileStr = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;

      // Default transformation options
      const defaultTransformations = [
        { width: 1200, height: 800, crop: 'limit' },
        { quality: 'auto:good' }, // Better quality control
        { format: 'auto' }
      ];

      // Custom transformations based on file type
      let transformations = defaultTransformations;
      
      if (file.mimetype === 'application/pdf') {
        transformations = []; // No transformations for PDFs
      } else if (file.mimetype === 'image/png') {
        transformations = [
          ...defaultTransformations,
          { compression: 'auto' } // PNG compression
        ];
      }

      // Merge with user-provided options
      const uploadOptions = {
        folder: folder,
        resource_type: 'auto',
        transformation: transformations,
        ...options
      };

      // Upload to Cloudinary with timeout
      const uploadPromise = cloudinary.uploader.upload(fileStr, uploadOptions);
      
      // Add timeout to prevent hanging requests
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => {
          reject(new Error('Cloudinary upload timeout after 30 seconds'));
        }, 30000);
      });

      Promise.race([uploadPromise, timeoutPromise])
        .then(result => {
          resolve({
            success: true,
            url: result.secure_url,
            publicId: result.public_id,
            format: result.format,
            size: result.bytes,
            width: result.width,
            height: result.height,
            resourceType: result.resource_type,
            createdAt: result.created_at
          });
        })
        .catch(error => {
          console.error('Cloudinary upload error:', error);
          reject(new Error(`Upload failed: ${error.message}`));
        });

    } catch (error) {
      console.error('Error in uploadToCloudinary:', error);
      reject(new Error(`Upload processing error: ${error.message}`));
    }
  });
};

// Enhanced delete function with validation
const deleteFromCloudinary = (publicId, options = {}) => {
  return new Promise((resolve, reject) => {
    try {
      if (!publicId || typeof publicId !== 'string') {
        return reject(new Error('Invalid public ID provided'));
      }

      const deleteOptions = {
        resource_type: 'image', // Default to image, can be overridden
        invalidate: true, // Invalidate CDN cache
        ...options
      };

      cloudinary.uploader.destroy(publicId, deleteOptions, (error, result) => {
        if (error) {
          console.error('Cloudinary delete error:', error);
          reject(new Error(`Delete failed: ${error.message}`));
        } else {
          resolve({
            success: true,
            message: 'File deleted successfully',
            result: result
          });
        }
      });

    } catch (error) {
      console.error('Error in deleteFromCloudinary:', error);
      reject(new Error(`Delete processing error: ${error.message}`));
    }
  });
};

// Batch upload multiple files
const uploadMultipleToCloudinary = (files, folder = 'real-estate') => {
  return Promise.all(
    files.map(file => uploadToCloudinary(file, folder))
  );
};

// Batch delete multiple files
const deleteMultipleFromCloudinary = (publicIds) => {
  return Promise.all(
    publicIds.map(publicId => deleteFromCloudinary(publicId))
  );
};

// Get Cloudinary resource info
const getCloudinaryInfo = (publicId) => {
  return new Promise((resolve, reject) => {
    cloudinary.api.resource(publicId, (error, result) => {
      if (error) {
        reject(new Error(`Failed to get resource info: ${error.message}`));
      } else {
        resolve(result);
      }
    });
  });
};

// Middleware wrappers with error handling
const createUploadMiddleware = (type, ...args) => {
  const middleware = type === 'array' ? upload.array(...args) :
                   type === 'single' ? upload.single(...args) :
                   type === 'fields' ? upload.fields(...args) : null;

  return (req, res, next) => {
    middleware(req, res, (err) => {
      if (err) {
        // Handle multer errors gracefully
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({
            success: false,
            message: 'File too large. Maximum size is 10MB.',
            errorType: 'FILE_TOO_LARGE'
          });
        }
        if (err.code === 'LIMIT_FILE_COUNT') {
          return res.status(400).json({
            success: false,
            message: 'Too many files uploaded.',
            errorType: 'TOO_MANY_FILES'
          });
        }
        if (err.code === 'LIMIT_UNEXPECTED_FILE') {
          return res.status(400).json({
            success: false,
            message: 'Unexpected file field.',
            errorType: 'UNEXPECTED_FILE_FIELD'
          });
        }
        
        // Generic multer error
        return res.status(400).json({
          success: false,
          message: err.message,
          errorType: 'UPLOAD_ERROR'
        });
      }
      next();
    });
  };
};

// Export middleware with better naming
const uploadMultiple = (fieldName, maxCount = 10) => {
  return createUploadMiddleware('array', fieldName, maxCount);
};

const uploadSingle = (fieldName) => {
  return createUploadMiddleware('single', fieldName);
};

const uploadFields = (fields) => {
  return createUploadMiddleware('fields', fields);
};

// Utility function to validate file before upload
const validateFile = (file) => {
  const errors = [];
  
  if (!file) {
    errors.push('No file provided');
    return errors;
  }

  if (!file.buffer || file.buffer.length === 0) {
    errors.push('File buffer is empty');
  }

  if (file.size > 10 * 1024 * 1024) {
    errors.push('File size exceeds 10MB limit');
  }

  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'application/pdf'];
  if (!allowedTypes.includes(file.mimetype)) {
    errors.push(`File type ${file.mimetype} is not allowed`);
  }

  return errors;
};

module.exports = {
  upload,
  uploadToCloudinary,
  deleteFromCloudinary,
  uploadMultipleToCloudinary,
  deleteMultipleFromCloudinary,
  getCloudinaryInfo,
  uploadMultiple,
  uploadSingle,
  uploadFields,
  validateFile
};