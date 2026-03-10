require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const { verifyToken, allowRoles } = require('./middleware/authMiddleware');

require('./config/db');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Auth routes
app.use('/api/auth', authRoutes);


const donorRoutes = require('./routes/donorRoutes');

app.use('/api/donor', donorRoutes);

// Protected route (any logged-in user)
app.get('/protected', verifyToken, (req, res) => {
  res.json({
    message: 'Protected route accessed',
    user: req.user
  });
});

// Role-based routes
app.get(
  '/recipient-only',
  verifyToken,
  allowRoles('recipient'),
  (req, res) => {
    res.json({ message: 'Recipient access granted' });
  }
);

app.get(
  '/donor-only',
  verifyToken,
  allowRoles('donor'),
  (req, res) => {
    res.json({ message: 'Donor access granted' });
  }
);

app.get(
  '/admin-only',
  verifyToken,
  allowRoles('admin'),
  (req, res) => {
    res.json({ message: 'Admin access granted' });
  }
);

module.exports = app;
