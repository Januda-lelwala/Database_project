const db = require('../models');
const { TruckRoute, Store } = db;

// Generate route ID
const generateRouteId = async () => {
  const routeCount = await TruckRoute.count();
  return `TR${String(routeCount + 1).padStart(4, '0')}`;
};

// Get all truck routes
const getAllTruckRoutes = async (req, res) => {
  try {
    const routes = await TruckRoute.findAll({
      include: [
        {
          model: Store,
          as: 'store',
          attributes: ['store_id', 'name', 'city']
        }
      ],
      order: [['route_id', 'ASC']]
    });

    res.status(200).json({
      success: true,
      count: routes.length,
      data: routes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while fetching truck routes',
      error: error.message
    });
  }
};

// Get truck route by ID
const getTruckRouteById = async (req, res) => {
  try {
    const { id } = req.params;

    const route = await TruckRoute.findByPk(id, {
      include: [
        {
          model: Store,
          as: 'store',
          attributes: ['store_id', 'name', 'city']
        }
      ]
    });

    if (!route) {
      return res.status(404).json({
        success: false,
        message: 'Truck route not found'
      });
    }

    res.status(200).json({
      success: true,
      data: route
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while fetching truck route',
      error: error.message
    });
  }
};

// Get routes by store ID
const getRoutesByStore = async (req, res) => {
  try {
    const { storeId } = req.params;

    const routes = await TruckRoute.findAll({
      where: { store_id: storeId },
      include: [
        {
          model: Store,
          as: 'store',
          attributes: ['store_id', 'name', 'city']
        }
      ],
      order: [['route_name', 'ASC']]
    });

    res.status(200).json({
      success: true,
      count: routes.length,
      data: routes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while fetching routes by store',
      error: error.message
    });
  }
};

// Create new truck route
const createTruckRoute = async (req, res) => {
  try {
    const { store_id, route_name, max_minutes } = req.body;

    // Check if store exists
    const store = await Store.findByPk(store_id);
    if (!store) {
      return res.status(404).json({
        success: false,
        message: 'Store not found'
      });
    }

    // Generate route ID
    const route_id = await generateRouteId();

    // Create route
    const route = await TruckRoute.create({
      route_id,
      store_id,
      route_name,
      max_minutes: max_minutes || 240
    });

    // Fetch with store details
    const createdRoute = await TruckRoute.findByPk(route_id, {
      include: [
        {
          model: Store,
          as: 'store',
          attributes: ['store_id', 'name', 'city']
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Truck route created successfully',
      data: createdRoute
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while creating truck route',
      error: error.message
    });
  }
};

// Update truck route
const updateTruckRoute = async (req, res) => {
  try {
    const { id } = req.params;
    const { store_id, route_name, max_minutes } = req.body;

    const route = await TruckRoute.findByPk(id);

    if (!route) {
      return res.status(404).json({
        success: false,
        message: 'Truck route not found'
      });
    }

    // If store_id is being updated, verify it exists
    if (store_id && store_id !== route.store_id) {
      const store = await Store.findByPk(store_id);
      if (!store) {
        return res.status(404).json({
          success: false,
          message: 'Store not found'
        });
      }
    }

    // Update fields
    if (store_id) route.store_id = store_id;
    if (route_name) route.route_name = route_name;
    if (max_minutes !== undefined) route.max_minutes = max_minutes;

    await route.save();

    // Fetch updated route with store details
    const updatedRoute = await TruckRoute.findByPk(id, {
      include: [
        {
          model: Store,
          as: 'store',
          attributes: ['store_id', 'name', 'city']
        }
      ]
    });

    res.status(200).json({
      success: true,
      message: 'Truck route updated successfully',
      data: updatedRoute
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while updating truck route',
      error: error.message
    });
  }
};

// Delete truck route
const deleteTruckRoute = async (req, res) => {
  try {
    const { id } = req.params;

    const route = await TruckRoute.findByPk(id);

    if (!route) {
      return res.status(404).json({
        success: false,
        message: 'Truck route not found'
      });
    }

    await route.destroy();

    res.status(200).json({
      success: true,
      message: 'Truck route deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while deleting truck route',
      error: error.message
    });
  }
};

module.exports = {
  getAllTruckRoutes,
  getTruckRouteById,
  getRoutesByStore,
  createTruckRoute,
  updateTruckRoute,
  deleteTruckRoute
};
