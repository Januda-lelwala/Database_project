const express = require('express');
const router = express.Router();
const { verifyAdmin } = require('../middleware/auth');
const truckRouteController = require('../controllers/truckRouteController');

// Truck route management - all require admin authentication
router.get('/', verifyAdmin, truckRouteController.getAllTruckRoutes);
router.get('/store/:storeId', verifyAdmin, truckRouteController.getRoutesByStore);
router.get('/:id', verifyAdmin, truckRouteController.getTruckRouteById);

router.post('/', verifyAdmin, truckRouteController.createTruckRoute);
router.put('/:id', verifyAdmin, truckRouteController.updateTruckRoute);
router.delete('/:id', verifyAdmin, truckRouteController.deleteTruckRoute);

module.exports = router;
