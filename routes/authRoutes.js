const express = require('express');
const router = express.Router();
const { 
  registerUser,
  loginUser,
  registerAdmin,
  loginAdmin,
  getUserProfile,
  getAdminProfile,
  registerDriver,
  loginDriver
} = require('../controllers/authController');
const { verifyUser, verifyAdmin } = require('../middleware/auth');
const { 
  validateUserRegistration, 
  validateUserLogin, 
  validateAdminRegistration,
  validateDriverRegistration,
  validateDriverLogin
} = require('../middleware/validation');

// User routes
router.post('/register', validateUserRegistration, registerUser);
router.post('/login', validateUserLogin, loginUser);
router.get('/profile', verifyUser, getUserProfile);

// Admin routes
router.post('/admin/register', validateAdminRegistration, verifyAdmin, registerAdmin);
router.post('/admin/login', validateUserLogin, loginAdmin);
router.get('/admin/profile', verifyAdmin, getAdminProfile);

// Driver routes
router.post('/driver/register', validateDriverRegistration, registerDriver);
router.post('/driver/login', validateDriverLogin, loginDriver);

module.exports = router;
