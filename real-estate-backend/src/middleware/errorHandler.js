const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error with more context
  console.error('Error Details:', {
    message: err.message,
    name: err.name,
    code: err.code,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString()
  });

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = `Resource not found with id of ${err.value}`;
    error = { message, statusCode: 404, errorType: 'NOT_FOUND' };
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const value = err.keyValue[field];
    const message = `Duplicate field value: ${field} '${value}' already exists`;
    error = { message, statusCode: 400, errorType: 'DUPLICATE_FIELD' };
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(val => val.message);
    const message = `Validation failed: ${messages.join(', ')}`;
    error = { message, statusCode: 400, errorType: 'VALIDATION_ERROR', details: messages };
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid token. Please log in again.';
    error = { message, statusCode: 401, errorType: 'INVALID_TOKEN' };
  }

  if (err.name === 'TokenExpiredError') {
    const message = 'Token expired. Please log in again.';
    error = { message, statusCode: 401, errorType: 'TOKEN_EXPIRED' };
  }

  // Multer errors (file upload)
  if (err.code === 'LIMIT_FILE_SIZE') {
    const message = 'File too large. Please upload a smaller file.';
    error = { message, statusCode: 400, errorType: 'FILE_TOO_LARGE' };
  }

  if (err.code === 'LIMIT_FILE_COUNT') {
    const message = 'Too many files uploaded. Please reduce the number of files.';
    error = { message, statusCode: 400, errorType: 'TOO_MANY_FILES' };
  }

  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    const message = 'Unexpected file field or file type not allowed.';
    error = { message, statusCode: 400, errorType: 'INVALID_FILE_TYPE' };
  }

  if (err.code === 'LIMIT_PART_COUNT') {
    const message = 'Too many form parts. Please reduce the number of fields.';
    error = { message, statusCode: 400, errorType: 'TOO_MANY_FIELDS' };
  }

  // Cloudinary errors
  if (err.name === 'CloudinaryError') {
    const message = 'File upload failed. Please try again.';
    error = { message, statusCode: 500, errorType: 'UPLOAD_FAILED' };
  }

  // Property-specific errors
  if (err.message?.includes('Only sale properties can be marked as sold')) {
    error = { message: err.message, statusCode: 400, errorType: 'INVALID_STATUS_CHANGE' };
  }

  if (err.message?.includes('Only rental properties can be marked as rented')) {
    error = { message: err.message, statusCode: 400, errorType: 'INVALID_STATUS_CHANGE' };
  }

  if (err.message?.includes('Project name is required')) {
    error = { message: err.message, statusCode: 400, errorType: 'PROJECT_VALIDATION_ERROR' };
  }

  if (err.message?.includes('Developer name is required')) {
    error = { message: err.message, statusCode: 400, errorType: 'PROJECT_VALIDATION_ERROR' };
  }

  if (err.message?.includes('Launch date is required')) {
    error = { message: err.message, statusCode: 400, errorType: 'PROJECT_VALIDATION_ERROR' };
  }

  // Rate limiting errors
  if (err.statusCode === 429) {
    error = { 
      message: 'Too many requests. Please try again later.', 
      statusCode: 429, 
      errorType: 'RATE_LIMIT_EXCEEDED' 
    };
  }

  // Database connection errors
  if (err.name === 'MongoNetworkError' || err.name === 'MongoTimeoutError') {
    const message = 'Database connection error. Please try again later.';
    error = { message, statusCode: 503, errorType: 'DATABASE_ERROR' };
  }

  // Syntax errors (malformed JSON)
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    const message = 'Invalid JSON in request body';
    error = { message, statusCode: 400, errorType: 'INVALID_JSON' };
  }

  // CORS errors
  if (err.message?.includes('CORS')) {
    const message = 'Cross-origin request blocked';
    error = { message, statusCode: 403, errorType: 'CORS_ERROR' };
  }

  // Default to 500 server error
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Server Error';

  // Don't leak error details in production
  const response = {
    success: false,
    message: statusCode === 500 && process.env.NODE_ENV === 'production' 
      ? 'Something went wrong. Please try again later.' 
      : message,
    errorType: error.errorType || 'SERVER_ERROR',
    timestamp: new Date().toISOString(),
    ...(process.env.NODE_ENV === 'development' && {
      stack: err.stack,
      originalError: err.message
    })
  };

  // Include validation details if available
  if (error.details) {
    response.details = error.details;
  }

  // Include path for client debugging
  if (process.env.NODE_ENV === 'development') {
    response.path = req.path;
    response.method = req.method;
  }

  res.status(statusCode).json(response);
};

module.exports = errorHandler;