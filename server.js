require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const { connectDB } = require('./config/database');
const db = require('./models');

// Import routes
const authRoutes = require('./routes/authRoutes');
// Customer order management routes
const customerRoutes = require('./routes/customerRoutes');
const orderRoutes = require('./routes/orderRoutes');
const productRoutes = require('./routes/productRoutes');
// Store and truck routes
const storeRoutes = require('./routes/storeRoutes');
const truckRoutes = require('./routes/truckRoutes');
const trainRoutes = require('./routes/trainRoutes');
// Driver and assistant routes
const driverRoutes = require('./routes/driverRoutes');
const assistantRoutes = require('./routes/assistantRoutes');
// Admin management routes
const adminRoutes = require('./routes/adminRoutes');
// Truck route management
const truckRouteRoutes = require('./routes/truckRouteRoutes');

// Initialize express app
const app = express();

// Database connection
connectDB();

// Set security HTTP headers
app.use(helmet());

// Rate limiting - more lenient in development
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 100 : 1000, // Higher limit in development
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests from this IP, please try again after 15 minutes',
  skip: (req) => {
    // Skip rate limiting for health check
    return req.path === '/health' || req.path === '/';
  }
});
app.use('/api', limiter);

// Body parser
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Enable CORS
const corsOptions = {
  origin: ['http://localhost:3002', 'http://127.0.0.1:3002'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Authorization']
};
app.use(cors(corsOptions));

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// API routes
app.use('/api/auth', authRoutes);
// Customer order management routes
app.use('/api/customers', customerRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/products', productRoutes);
// Store and truck routes
app.use('/api/stores', storeRoutes);
app.use('/api/trucks', truckRoutes);
app.use('/api/trains', trainRoutes);
// Driver and assistant routes
app.use('/api/drivers', driverRoutes);
app.use('/api/assistants', assistantRoutes);
// Admin management routes
app.use('/api/admins', adminRoutes);
// Truck route management
app.use('/api/truck-routes', truckRouteRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is running',
    timestamp: new Date()
  });
});

// Root route
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Welcome to Customer Order Management System API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      customers: '/api/customers',
      orders: '/api/orders',
      products: '/api/products',
      stores: '/api/stores',
      trucks: '/api/trucks',
      trains: '/api/trains',
      drivers: '/api/drivers',
      assistants: '/api/assistants',
      admins: '/api/admins',
      truckRoutes: '/api/truck-routes'
    },
    documentation: '/api/docs'
  });
});

// Handle undefined routes
app.all('*', (req, res) => {
  res.status(404).json({
    status: 'fail',
    message: `Can't find ${req.originalUrl} on this server!`
  });
});

// Global error handler
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Start server - using fixed port 3001 for testing
const PORT = 3000; // Hardcoded to avoid env loading issues
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});

// Handle unhandled rejections
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION! 💥 Shutting down...');
  console.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.error(err.name, err.message);
  process.exit(1);
});
