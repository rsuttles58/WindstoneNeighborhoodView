const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const locationRoutes = require('./routes/locations');
const { PROPERTY_TAGS, HOLIDAY_TYPES } = require('./config/constants');

const app = express();
const PORT = process.env.PORT || 3001;

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

// Stricter rate limit for POST requests
const createLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Limit each IP to 10 POST requests per hour
  message: 'Too many locations submitted, please try again later.'
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(limiter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Get available property tags
app.get('/api/properties', (req, res) => {
  res.json({
    success: true,
    data: PROPERTY_TAGS
  });
});

// Get holiday types
app.get('/api/holidays', (req, res) => {
  res.json({
    success: true,
    data: Object.values(HOLIDAY_TYPES)
  });
});

// Location routes
app.use('/api/locations', locationRoutes);

// Apply stricter rate limiting to POST
app.post('/api/locations', createLimiter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;

