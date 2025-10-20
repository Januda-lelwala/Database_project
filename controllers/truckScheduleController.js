const db = require('../models');
const { TruckSchedule, TruckRoute, Truck, Driver, Assistant, Store } = db;

// Get all truck schedules
const getAllTruckSchedules = async (req, res) => {
  try {
    const schedules = await TruckSchedule.findAll({
      include: [
        {
          model: TruckRoute,
          as: 'route',
          include: [
            {
              model: Store,
              as: 'store',
              attributes: ['store_id', 'name', 'city']
            }
          ]
        },
        {
          model: Truck,
          as: 'truck',
          attributes: ['truck_id', 'license_plate', 'capacity']
        },
        {
          model: Driver,
          as: 'driver',
          attributes: ['driver_id', 'name', 'phone_no']
        },
        {
          model: Assistant,
          as: 'assistant',
          attributes: ['assistant_id', 'name', 'phone_no']
        }
      ],
      order: [['start_time', 'DESC']]
    });

    res.status(200).json({
      success: true,
      count: schedules.length,
      data: schedules
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while fetching truck schedules',
      error: error.message
    });
  }
};

// Get truck schedule by ID
const getTruckScheduleById = async (req, res) => {
  try {
    const { id } = req.params;

    const schedule = await TruckSchedule.findByPk(id, {
      include: [
        {
          model: TruckRoute,
          as: 'route',
          include: [
            {
              model: Store,
              as: 'store',
              attributes: ['store_id', 'name', 'city', 'address']
            }
          ]
        },
        {
          model: Truck,
          as: 'truck',
          attributes: ['truck_id', 'license_plate', 'capacity']
        },
        {
          model: Driver,
          as: 'driver',
          attributes: ['driver_id', 'name', 'phone_no', 'email']
        },
        {
          model: Assistant,
          as: 'assistant',
          attributes: ['assistant_id', 'name', 'phone_no', 'email']
        }
      ]
    });

    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: 'Truck schedule not found'
      });
    }

    res.status(200).json({
      success: true,
      data: schedule
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while fetching truck schedule',
      error: error.message
    });
  }
};

// Create truck schedule
const createTruckSchedule = async (req, res) => {
  try {
    const { route_id, truck_id, driver_id, assistant_id, start_time, end_time } = req.body;

    // Verify route exists
    const route = await TruckRoute.findByPk(route_id);
    if (!route) {
      return res.status(404).json({
        success: false,
        message: 'Truck route not found'
      });
    }

    // Verify truck exists
    const truck = await Truck.findByPk(truck_id);
    if (!truck) {
      return res.status(404).json({
        success: false,
        message: 'Truck not found'
      });
    }

    // Verify driver exists
    const driver = await Driver.findByPk(driver_id);
    if (!driver) {
      return res.status(404).json({
        success: false,
        message: 'Driver not found'
      });
    }

    // Verify assistant exists
    const assistant = await Assistant.findByPk(assistant_id);
    if (!assistant) {
      return res.status(404).json({
        success: false,
        message: 'Assistant not found'
      });
    }

    // Generate schedule ID
    const scheduleCount = await TruckSchedule.count();
    const truck_schedule_id = `TS${String(scheduleCount + 1).padStart(4, '0')}`;

    // Create schedule
    const schedule = await TruckSchedule.create({
      truck_schedule_id,
      route_id,
      truck_id,
      driver_id,
      assistant_id,
      start_time,
      end_time
    });

    // Fetch complete schedule with associations
    const completeSchedule = await TruckSchedule.findByPk(truck_schedule_id, {
      include: [
        {
          model: TruckRoute,
          as: 'route',
          include: [
            {
              model: Store,
              as: 'store'
            }
          ]
        },
        {
          model: Truck,
          as: 'truck'
        },
        {
          model: Driver,
          as: 'driver'
        },
        {
          model: Assistant,
          as: 'assistant'
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Truck schedule created successfully',
      data: completeSchedule
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while creating truck schedule',
      error: error.message
    });
  }
};

// Update truck schedule
const updateTruckSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    const { route_id, truck_id, driver_id, assistant_id, start_time, end_time } = req.body;

    const schedule = await TruckSchedule.findByPk(id);

    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: 'Truck schedule not found'
      });
    }

    // Update fields
    if (route_id) schedule.route_id = route_id;
    if (truck_id) schedule.truck_id = truck_id;
    if (driver_id) schedule.driver_id = driver_id;
    if (assistant_id) schedule.assistant_id = assistant_id;
    if (start_time) schedule.start_time = start_time;
    if (end_time) schedule.end_time = end_time;

    await schedule.save();

    // Fetch updated schedule with associations
    const updatedSchedule = await TruckSchedule.findByPk(id, {
      include: [
        {
          model: TruckRoute,
          as: 'route',
          include: [
            {
              model: Store,
              as: 'store'
            }
          ]
        },
        {
          model: Truck,
          as: 'truck'
        },
        {
          model: Driver,
          as: 'driver'
        },
        {
          model: Assistant,
          as: 'assistant'
        }
      ]
    });

    res.status(200).json({
      success: true,
      message: 'Truck schedule updated successfully',
      data: updatedSchedule
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while updating truck schedule',
      error: error.message
    });
  }
};

// Delete truck schedule
const deleteTruckSchedule = async (req, res) => {
  try {
    const { id } = req.params;

    const schedule = await TruckSchedule.findByPk(id);

    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: 'Truck schedule not found'
      });
    }

    await schedule.destroy();

    res.status(200).json({
      success: true,
      message: 'Truck schedule deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while deleting truck schedule',
      error: error.message
    });
  }
};

// Get schedules by driver
const getSchedulesByDriver = async (req, res) => {
  try {
    const { driverId } = req.params;

    const schedules = await TruckSchedule.findAll({
      where: { driver_id: driverId },
      include: [
        {
          model: TruckRoute,
          as: 'route',
          include: [
            {
              model: Store,
              as: 'store'
            }
          ]
        },
        {
          model: Truck,
          as: 'truck'
        },
        {
          model: Assistant,
          as: 'assistant'
        }
      ],
      order: [['start_time', 'DESC']]
    });

    res.status(200).json({
      success: true,
      count: schedules.length,
      data: schedules
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while fetching schedules',
      error: error.message
    });
  }
};

module.exports = {
  getAllTruckSchedules,
  getTruckScheduleById,
  createTruckSchedule,
  updateTruckSchedule,
  deleteTruckSchedule,
  getSchedulesByDriver
};
