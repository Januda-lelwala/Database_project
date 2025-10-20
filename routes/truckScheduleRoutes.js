const express = require('express');
const router = express.Router();
const { verifyAdmin } = require('../middleware/auth');
const truckScheduleController = require('../controllers/truckScheduleController');

// Truck schedule management - all require admin authentication
router.get('/', verifyAdmin, truckScheduleController.getAllTruckSchedules);
router.get('/driver/:driverId', verifyAdmin, truckScheduleController.getSchedulesByDriver);
router.get('/:id', verifyAdmin, truckScheduleController.getTruckScheduleById);

router.post('/', verifyAdmin, truckScheduleController.createTruckSchedule);
router.put('/:id', verifyAdmin, truckScheduleController.updateTruckSchedule);
router.delete('/:id', verifyAdmin, truckScheduleController.deleteTruckSchedule);

module.exports = router;
