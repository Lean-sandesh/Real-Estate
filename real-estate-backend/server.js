const app = require('./src/app');
const config = require('./src/config/environment');
const mongoose = require('mongoose');

const PORT = process.env.PORT || config.port;
const HOST = process.env.HOST || '0.0.0.0';

// MongoDB connection events
mongoose.connection.on('connected', () => {
  console.log('MongoDB connected to:', mongoose.connection.host);
  console.log('Database:', mongoose.connection.name);
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err.message);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

// Graceful shutdown handler
const gracefulShutdown = async (signal) => {
  console.log(signal, 'received, starting graceful shutdown...');
  
  try {
    // Stop accepting new requests
    server.close((err) => {
      if (err) {
        console.error('Error closing HTTP server:', err);
        process.exit(1);
      }
      console.log('HTTP server closed');
    });

    // Close database connection with timeout
    const dbClosePromise = mongoose.connection.close();
    const dbCloseTimeout = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Database close timeout')), 10000);
    });

    await Promise.race([dbClosePromise, dbCloseTimeout]);
    console.log('MongoDB connection closed');

    console.log('Graceful shutdown completed');
    process.exit(0);
  } catch (error) {
    console.error('Error during graceful shutdown:', error);
    process.exit(1);
  }
};

// Start server
const server = app.listen(PORT, HOST, () => {
  console.log('Real Estate Platform Backend Server');
  console.log('=========================================');
  console.log('Server running in', config.nodeEnv, 'mode');
  console.log('Port:', PORT);
  console.log('Host:', HOST);
  console.log('URL: http://localhost:' + PORT);
  console.log('API: http://localhost:' + PORT + '/api');
  console.log('Health: http://localhost:' + PORT + '/api/health');
  console.log('=========================================');

  if (config.nodeEnv === 'development') {
    console.log('Development Tools:');
    console.log('   API Documentation: http://localhost:' + PORT + '/api');
    console.log('   Health Check: http://localhost:' + PORT + '/api/health');
    console.log('   Database Health: http://localhost:' + PORT + '/api/health/db');
    console.log('   Uploads: http://localhost:' + PORT + '/uploads');
    console.log('=========================================');
  }
});

// Server error handling
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error('Port', PORT, 'is already in use');
    console.log('Try:');
    console.log('   - Using a different port');
    console.log('   - Killing the process using port', PORT);
    console.log('   - Waiting a few moments and trying again');
    process.exit(1);
  } else {
    console.error('Server error:', error);
    process.exit(1);
  }
});

server.on('listening', () => {
  console.log('Server successfully started on port', PORT);
});

// Process event handlers
process.on('unhandledRejection', (err, promise) => {
  console.error('Unhandled Promise Rejection:');
  console.error('Promise:', promise);
  console.error('Reason:', err.message);
  console.error('Stack:', err.stack);
  
  // Graceful shutdown on unhandled rejection in production
  if (config.nodeEnv === 'production') {
    server.close(() => {
      console.log('Server closed due to unhandled promise rejection');
      process.exit(1);
    });
  }
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:');
  console.error('Error:', err.message);
  console.error('Stack:', err.stack);
  
  server.close(() => {
    console.log('Server closed due to uncaught exception');
    process.exit(1);
  });
});

// Signal handlers for graceful shutdown
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Process exit handler
process.on('exit', (code) => {
  if (code === 0) {
    console.log('Process exited successfully');
  } else {
    console.log('Process exited with error code:', code);
  }
});

// Memory monitoring in development
if (config.nodeEnv === 'development') {
  setInterval(() => {
    const memoryUsage = process.memoryUsage();
    const formatMemory = (bytes) => Math.round(bytes / 1024 / 1024 * 100) / 100;
    
    console.log('Memory Usage - RSS:', formatMemory(memoryUsage.rss), 'MB | Heap:', formatMemory(memoryUsage.heapUsed), 'MB /', formatMemory(memoryUsage.heapTotal), 'MB');
  }, 60000);
}

module.exports = server;