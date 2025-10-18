const express = require('express');
const router = express.Router();
const { verifyAdmin } = require('../middleware/auth');
const driverController = require('../controllers/driverController');

// Admin driver routes - all require admin authentication
router.get('/', verifyAdmin, driverController.getAllDrivers);
router.get('/:id', verifyAdmin, driverController.getDriverById);
router.put('/:id', verifyAdmin, driverController.updateDriver);
router.delete('/:id', verifyAdmin, driverController.deleteDriver);

module.exports = router;
