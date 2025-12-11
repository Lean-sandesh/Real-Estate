const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const compression = require('compression')
const rateLimit = require('express-rate-limit')
const morgan = require('morgan')
const hpp = require('hpp')
const cookieParser = require('cookie-parser')
const path = require('path')
const connectDB = require('./config/database')
const errorHandler = require('./middleware/errorHandler')
const routes = require('./routes')

// Load environment variables
require('dotenv').config()

// Environment validation
const requiredEnvVars = [
  'NODE_ENV',
  'MONGODB_URI',
  'JWT_SECRET',
  'PORT'
]

const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar])
if (missingEnvVars.length > 0) {
  console.error(' Missing required environment variables:', missingEnvVars)
  process.exit(1)
}

// Environment variables
const isProduction = process.env.NODE_ENV === 'production'
const isDevelopment = process.env.NODE_ENV === 'development'

// Connect to database
connectDB()

const app = express()

// Hide Express.js information
app.disable('x-powered-by')

// Trust proxy (for rate limiting behind reverse proxy)
app.set('trust proxy', 1)

// Security headers with specific configuration for real estate app
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: false,
}))

// Prevent clickjacking
app.use((req, res, next) => {
  res.setHeader('X-Frame-Options', 'DENY')
  next()
})

// Rate limiting configurations
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isProduction ? 200 : 1000,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later',
    errorType: 'RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false,
})

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isProduction ? 10 : 50,
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again later',
    errorType: 'AUTH_RATE_LIMIT'
  }
})

const propertyCreationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: isProduction ? 5 : 20,
  message: {
    success: false,
    message: 'Too many properties created, please try again later',
    errorType: 'PROPERTY_CREATION_LIMIT'
  }
})

// Apply rate limiting
app.use('/api', generalLimiter)
app.use('/api/auth', authLimiter)
app.use('/api/properties', propertyCreationLimiter)

// Compression
app.use(compression({
  level: 6,
  threshold: 100 * 1024,
  filter: (req, res) => {
    if (req.headers['x-no-compression']) return false
    if (res.getHeader('Content-Length') < 1024) return false
    return compression.filter(req, res)
  }
}))

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true)
    
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:5173',
      'http://localhost:5174',
      process.env.CLIENT_URL,
      process.env.ADMIN_URL
    ].filter(Boolean)
    
    if (allowedOrigins.indexOf(origin) !== -1 || isDevelopment) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin',
    'Access-Control-Request-Method',
    'Access-Control-Request-Headers'
  ]
}

app.use(cors(corsOptions))

// Body parsers with limits
app.use(express.json({
  limit: '10mb'
}))

app.use(express.urlencoded({
  extended: true,
  limit: '10mb',
  parameterLimit: 100
}))

// Cookie parser
app.use(cookieParser())

// Custom security middleware (replaces express-mongo-sanitize and xss-clean)
app.use((req, res, next) => {
  // Sanitize request body
  if (req.body && typeof req.body === 'object') {
    sanitizeObject(req.body);
  }
  
  // Sanitize request query
  if (req.query && typeof req.query === 'object') {
    sanitizeObject(req.query);
  }
  
  next();
});

// Helper function to sanitize objects for NoSQL injection and XSS
function sanitizeObject(obj) {
  if (!obj || typeof obj !== 'object') return;
  
  Object.keys(obj).forEach(key => {
    if (typeof obj[key] === 'object') {
      sanitizeObject(obj[key]);
    } else if (typeof obj[key] === 'string') {
      // Remove MongoDB operators
      const dangerousPatterns = [
        /\$where/i, /\$eq/i, /\$ne/i, /\$gt/i, /\$gte/i, /\$lt/i, /\$lte/i,
        /\$in/i, /\$nin/i, /\$and/i, /\$or/i, /\$not/i, /\$nor/i,
        /\$exists/i, /\$type/i, /\$mod/i, /\$regex/i, /\$text/i, /\$expr/i
      ];
      
      dangerousPatterns.forEach(pattern => {
        if (pattern.test(obj[key])) {
          obj[key] = obj[key].replace(pattern, '');
        }
      });
      
      // Basic XSS protection
      obj[key] = obj[key]
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;')
        .replace(/\\/g, '&#x5C;')
        .replace(/`/g, '&#96;');
    }
  });
}

// Prevent parameter pollution
app.use(hpp({
  whitelist: [
    'price',
    'bedrooms',
    'bathrooms',
    'area',
    'rating',
    'views',
    'likes',
    'limit',
    'page',
    'sort'
  ]
}))

// Request ID and logging middleware
app.use((req, res, next) => {
  req.id = Date.now().toString(36) + Math.random().toString(36).substr(2)
  req.requestTime = new Date().toISOString()
  res.setHeader('X-Request-ID', req.id)
  next()
})

// Custom morgan token for request ID
morgan.token('id', (req) => req.id)

// Logging
if (isDevelopment) {
  app.use(morgan('dev'))
} else {
  const morganFormat = ':id :remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"'
  
  app.use(morgan(morganFormat, {
    skip: (req, res) => res.statusCode < 400,
    stream: process.stderr
  }))
  
  app.use(morgan(morganFormat, {
    skip: (req, res) => res.statusCode >= 400,
    stream: process.stdout
  }))
}

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
  maxAge: '1d'
}))

app.use('/public', express.static(path.join(__dirname, 'public'), {
  maxAge: '7d'
}))

// API information route
app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to Real Estate Platform API',
    version: '1.0.0',
    timestamp: req.requestTime,
    environment: process.env.NODE_ENV || 'development',
    documentation: '/api/docs',
    endpoints: {
      auth: '/api/auth',
      properties: '/api/properties',
      users: '/api/users',
      inquiries: '/api/inquiries',
      admin: '/api/admin'
    }
  })
})

// Health check
app.get('/api/health', (req, res) => {
  const healthCheck = {
    success: true,
    message: ' Server is running smoothly',
    timestamp: req.requestTime,
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    memory: process.memoryUsage(),
    nodeVersion: process.version,
    platform: process.platform
  }
  
  res.status(200).json(healthCheck)
})

// Database health check
app.get('/api/health/db', async (req, res) => {
  try {
    const mongoose = require('mongoose')
    const dbState = mongoose.connection.readyState
    
    const states = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    }
    
    res.json({
      success: true,
      database: {
        status: states[dbState],
        readyState: dbState,
        host: mongoose.connection.host,
        name: mongoose.connection.name
      }
    })
  } catch (error) {
    res.status(503).json({
      success: false,
      message: 'Database connection failed',
      error: error.message
    })
  }
})

// API documentation route
app.get('/api/docs', (req, res) => {
  res.json({
    success: true,
    message: 'API Documentation',
    documentation: 'https://docs.yourdomain.com',
    version: '1.0.0',
    endpoints: {
      authentication: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        profile: 'GET /api/auth/me'
      },
      properties: {
        list: 'GET /api/properties',
        create: 'POST /api/properties',
        single: 'GET /api/properties/:id',
        update: 'PUT /api/properties/:id',
        delete: 'DELETE /api/properties/:id'
      },
      users: {
        profile: 'GET /api/users/profile',
        favorites: 'GET /api/users/favorites',
        dashboard: 'GET /api/users/dashboard/stats'
      }
    }
  })
})

// Mount all routes
app.use('/api', routes)

// Serve API documentation in production
if (isProduction) {
  app.use('/api/docs', express.static(path.join(__dirname, 'docs')))
}

// 404 handler
app.use((req, res, next) => {
  if (req.originalUrl.startsWith('/api/')) {
    return res.status(404).json({
      success: false,
      message: `API endpoint ${req.originalUrl} not found`,
      errorType: 'ENDPOINT_NOT_FOUND',
      timestamp: req.requestTime,
      suggestedEndpoints: [
        '/api/auth/login',
        '/api/properties',
        '/api/health'
      ]
    })
  }
  
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found on this server`,
    errorType: 'ROUTE_NOT_FOUND',
    timestamp: req.requestTime
  })
})

// Global error handler
app.use(errorHandler)

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully')
  process.exit(0)
})

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully')
  process.exit(0)
})

process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! Shutting down...')
  console.log(err.name, err.message)
  process.exit(1)
})

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! Shutting down...')
  console.log(err.name, err.message)
  process.exit(1)
})

module.exports = app