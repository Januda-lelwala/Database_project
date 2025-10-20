const express = require('express');
const router = express.Router();
const { verifyDriver } = require('../middleware/auth');
const { validateScheduleStatusUpdate } = require('../middleware/validation');
const driverPortalController = require('../controllers/driverPortalController');

// Driver portal routes - all require driver authentication
router.get('/assignments', verifyDriver, driverPortalController.getDriverAssignments);
router.get('/stats', verifyDriver, driverPortalController.getDriverStats);
router.post('/update-status', verifyDriver, validateScheduleStatusUpdate, driverPortalController.updateScheduleStatus);

module.exports = router;
