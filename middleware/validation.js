const { body, validationResult } = require('express-validator');

// Handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// Customer registration validation
const validateUserRegistration = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('user_name')
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage('Username must be between 3 and 50 characters'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('phone_no')
    .optional()
    .trim(),
  body('city')
    .optional()
    .trim(),
  body('address')
    .optional()
    .trim(),
  handleValidationErrors
];

// Customer login validation
const validateUserLogin = [
  body('user_name')
    .trim()
    .notEmpty()
    .withMessage('Please provide a username'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  handleValidationErrors
];

// Admin registration validation
const validateAdminRegistration = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('phone')
    .matches(/^[0-9]{10}$/)
    .withMessage('Please provide a valid 10-digit phone number'),
  body('role')
    .optional()
    .isIn(['admin', 'super_admin'])
    .withMessage('Invalid role'),
  handleValidationErrors
];

// Vehicle validation
const validateVehicle = [
  body('vehicleNumber')
    .trim()
    .notEmpty()
    .withMessage('Vehicle number is required'),
  body('type')
    .isIn(['bus', 'taxi', 'auto', 'truck', 'van', 'car'])
    .withMessage('Invalid vehicle type'),
  body('brand')
    .trim()
    .notEmpty()
    .withMessage('Vehicle brand is required'),
  body('model')
    .trim()
    .notEmpty()
    .withMessage('Vehicle model is required'),
  body('capacity')
    .isInt({ min: 1 })
    .withMessage('Capacity must be a positive integer'),
  body('fuelType')
    .isIn(['petrol', 'diesel', 'cng', 'electric', 'hybrid'])
    .withMessage('Invalid fuel type'),
  handleValidationErrors
];

// Route validation
const validateRoute = [
  body('routeName')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Route name must be between 2 and 100 characters'),
  body('routeCode')
    .trim()
    .notEmpty()
    .withMessage('Route code is required'),
  body('startLocationName')
    .trim()
    .notEmpty()
    .withMessage('Start location name is required'),
  body('endLocationName')
    .trim()
    .notEmpty()
    .withMessage('End location name is required'),
  body('distance')
    .isFloat({ min: 0 })
    .withMessage('Distance must be a positive number'),
  body('estimatedDuration')
    .isInt({ min: 1 })
    .withMessage('Estimated duration must be at least 1 minute'),
  handleValidationErrors
];

// Booking validation
const validateBooking = [
  body('routeId')
    .notEmpty()
    .withMessage('Valid route ID is required'),
  body('vehicleId')
    .notEmpty()
    .withMessage('Valid vehicle ID is required'),
  body('travelDate')
    .isDate()
    .withMessage('Valid travel date is required'),
  body('departureTime')
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Valid departure time is required (HH:MM format)'),
  body('passengers')
    .isInt({ min: 1 })
    .withMessage('At least 1 passenger is required'),
  handleValidationErrors
];

// Store validation
const validateStore = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Store name must be between 2 and 100 characters'),
  body('city')
    .trim()
    .notEmpty()
    .withMessage('City is required'),
  body('address')
    .trim()
    .isLength({ min: 5, max: 255 })
    .withMessage('Address must be between 5 and 255 characters'),
  body('contactNo')
    .matches(/^[0-9]{10}$/)
    .withMessage('Please provide a valid 10-digit contact number'),
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  handleValidationErrors
];

// Truck validation
const validateTruck = [
  body('registrationNo')
    .trim()
    .notEmpty()
    .withMessage('Registration number is required'),
  body('capacity')
    .isFloat({ min: 0 })
    .withMessage('Capacity must be a positive number'),
  body('status')
    .optional()
    .isIn(['available', 'in_transit', 'maintenance', 'out_of_service'])
    .withMessage('Invalid truck status'),
  body('model')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Model must not exceed 100 characters'),
  body('year')
    .optional()
    .isInt({ min: 1900, max: new Date().getFullYear() + 1 })
    .withMessage('Invalid year'),
  handleValidationErrors
];

// Order validation
const validateOrder = [
  body('customerId')
    .notEmpty()
    .withMessage('Customer ID is required'),
  body('storeId')
    .notEmpty()
    .withMessage('Store ID is required'),
  body('deliveryAddress')
    .trim()
    .isLength({ min: 5, max: 255 })
    .withMessage('Delivery address must be between 5 and 255 characters'),
  body('orderDate')
    .optional()
    .isDate()
    .withMessage('Invalid order date'),
  body('status')
    .optional()
    .isIn(['pending', 'processing', 'in_transit', 'delivered', 'cancelled'])
    .withMessage('Invalid order status'),
  handleValidationErrors
];

// Customer validation
const validateCustomer = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('phone')
    .matches(/^[0-9]{10}$/)
    .withMessage('Please provide a valid 10-digit phone number'),
  body('address')
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage('Address must not exceed 255 characters'),
  handleValidationErrors
];

// Driver registration validation
const validateDriverRegistration = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('user_name')
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage('Username must be between 3 and 50 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('phone_no')
    .trim()
    .notEmpty()
    .withMessage('Phone number is required'),
  body('address')
    .optional()
    .trim(),
  handleValidationErrors
];

// Driver login validation
const validateDriverLogin = [
  body('user_name')
    .trim()
    .notEmpty()
    .withMessage('Please provide a username'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  handleValidationErrors
];

module.exports = {
  validateUserRegistration,
  validateUserLogin,
  validateAdminRegistration,
  validateVehicle,
  validateRoute,
  validateBooking,
  validateStore,
  validateTruck,
  validateOrder,
  validateCustomer,
  validateDriverRegistration,
  validateDriverLogin
};
