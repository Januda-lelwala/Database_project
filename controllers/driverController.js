const db = require('../models');
const { Driver } = db;

// Get all drivers
const getAllDrivers = async (req, res) => {
  try {
    const drivers = await Driver.findAll({
      order: [['name', 'ASC']]
    });

    res.status(200).json({
      success: true,
      count: drivers.length,
      data: drivers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get driver by ID
const getDriverById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const driver = await Driver.findByPk(id);

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: 'Driver not found'
      });
    }

    res.status(200).json({
      success: true,
      data: driver
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Update driver
const updateDriver = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone_no, address } = req.body;

    const driver = await Driver.findByPk(id);

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: 'Driver not found'
      });
    }

    // Update fields
    if (name) driver.name = name;
    if (email) driver.email = email;
    if (phone_no) driver.phone_no = phone_no;
    if (address) driver.address = address;

    await driver.save();

    res.status(200).json({
      success: true,
      message: 'Driver updated successfully',
      data: driver
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Delete driver
const deleteDriver = async (req, res) => {
  try {
    const { id } = req.params;

    const driver = await Driver.findByPk(id);

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: 'Driver not found'
      });
    }

    await driver.destroy();

    res.status(200).json({
      success: true,
      message: 'Driver deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

module.exports = {
  getAllDrivers,
  getDriverById,
  updateDriver,
  deleteDriver
};
