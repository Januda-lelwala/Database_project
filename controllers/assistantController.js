const db = require('../models');
const { Assistant } = db;

// Get all assistants
const getAllAssistants = async (req, res) => {
  try {
    const assistants = await Assistant.findAll({
      order: [['name', 'ASC']]
    });

    res.status(200).json({
      success: true,
      count: assistants.length,
      data: assistants
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get assistant by ID
const getAssistantById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const assistant = await Assistant.findByPk(id);

    if (!assistant) {
      return res.status(404).json({
        success: false,
        message: 'Assistant not found'
      });
    }

    res.status(200).json({
      success: true,
      data: assistant
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Create assistant
const createAssistant = async (req, res) => {
  try {
    const { name, address, phone_no, email } = req.body;

    // Generate assistant ID
    const assistantCount = await Assistant.count();
    const assistant_id = `AST${String(assistantCount + 1).padStart(3, '0')}`;

    // Check if assistant already exists by email
    if (email) {
      const existingAssistant = await Assistant.findOne({ where: { email } });
      if (existingAssistant) {
        return res.status(400).json({
          success: false,
          message: 'Assistant already exists with this email'
        });
      }
    }

    // Create new assistant
    const assistant = await Assistant.create({
      assistant_id,
      name,
      address,
      phone_no,
      email
    });

    res.status(201).json({
      success: true,
      message: 'Assistant created successfully',
      data: assistant
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Update assistant
const updateAssistant = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone_no, address } = req.body;

    const assistant = await Assistant.findByPk(id);

    if (!assistant) {
      return res.status(404).json({
        success: false,
        message: 'Assistant not found'
      });
    }

    // Update fields
    if (name) assistant.name = name;
    if (email) assistant.email = email;
    if (phone_no) assistant.phone_no = phone_no;
    if (address) assistant.address = address;

    await assistant.save();

    res.status(200).json({
      success: true,
      message: 'Assistant updated successfully',
      data: assistant
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Delete assistant
const deleteAssistant = async (req, res) => {
  try {
    const { id } = req.params;

    const assistant = await Assistant.findByPk(id);

    if (!assistant) {
      return res.status(404).json({
        success: false,
        message: 'Assistant not found'
      });
    }

    await assistant.destroy();

    res.status(200).json({
      success: true,
      message: 'Assistant deleted successfully'
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
  getAllAssistants,
  getAssistantById,
  createAssistant,
  updateAssistant,
  deleteAssistant
};
