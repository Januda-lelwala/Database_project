const db = require('../models');
const { Driver, Order, OrderItem, Customer, Product } = db;
const { Op } = require('sequelize');

// Helper function to calculate priority based on order details
const calculatePriority = (order) => {
  const orderDate = new Date(order.created_at);
  const now = new Date();
  const hoursDiff = (now - orderDate) / (1000 * 60 * 60);
  
  if (hoursDiff > 24) return 'urgent';
  if (hoursDiff > 12) return 'high';
  if (hoursDiff > 6) return 'medium';
  return 'low';
};

// Helper function to estimate delivery time
const estimateDeliveryTime = (distance) => {
  // Simple estimation: 20 km/h average speed
  const hours = distance / 20;
  const minutes = Math.round(hours * 60);
  return minutes > 60 ? `${Math.round(minutes / 60)} hr ${minutes % 60} min` : `${minutes} min`;
};

// Get driver's assignments (delivery orders)
const getDriverAssignments = async (req, res) => {
  try {
    const driver_id = req.user.driver_id || req.user.id;

    // Get orders assigned to this driver (pending or in-progress)
    const orders = await Order.findAll({
      where: {
        driver_id,
        status: {
          [Op.in]: ['pending', 'in_progress', 'scheduled']
        }
      },
      include: [
        {
          model: Customer,
          as: 'customer',
          attributes: ['customer_id', 'name', 'phone_no', 'address']
        },
        {
          model: OrderItem,
          as: 'orderItems',
          include: [
            {
              model: Product,
              as: 'product',
              attributes: ['product_id', 'name', 'price']
            }
          ]
        }
      ],
      order: [['created_at', 'ASC']]
    });

    // Format assignments according to required format
    const assignments = orders.map(order => {
      // Calculate total order value
      const orderValue = order.orderItems.reduce((sum, item) => {
        return sum + (item.quantity * item.unit_price);
      }, 0);

      // Random distance for demo (in production, calculate actual distance)
      const distance = (Math.random() * 15 + 1).toFixed(1);
      
      // Map order status to assignment status
      let assignmentStatus = 'pending';
      if (order.status === 'in_transit') assignmentStatus = 'in-progress';
      if (order.status === 'delivered') assignmentStatus = 'completed';

      // Calculate pickup and delivery times
      const pickupTime = new Date(order.created_at);
      pickupTime.setMinutes(pickupTime.getMinutes() + 30);
      const deliveryStart = new Date(pickupTime);
      deliveryStart.setMinutes(deliveryStart.getMinutes() + parseInt(distance) * 3);
      const deliveryEnd = new Date(deliveryStart);
      deliveryEnd.setMinutes(deliveryEnd.getMinutes() + 60);

      const formatTime = (date) => {
        return date.toLocaleTimeString('en-US', { 
          hour: 'numeric', 
          minute: '2-digit',
          hour12: true 
        });
      };

      return {
        id: order.order_id,
        customerName: order.customer.name,
        customerPhone: order.customer.phone_no || 'N/A',
        address: order.destination_address,
        orderValue: parseFloat(orderValue.toFixed(2)),
        priority: calculatePriority(order),
        estimatedTime: estimateDeliveryTime(parseFloat(distance)),
        distance: `${distance} km`,
        status: assignmentStatus,
        items: order.orderItems.length,
        paymentMethod: order.payment_method || 'Cash',
        pickupTime: formatTime(pickupTime),
        deliveryWindow: `${formatTime(deliveryStart)} - ${formatTime(deliveryEnd)}`
      };
    });

    res.status(200).json(assignments);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while fetching assignments',
      error: error.message
    });
  }
};

// Get driver statistics
const getDriverStats = async (req, res) => {
  try {
    const driver_id = req.user.driver_id || req.user.id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Get total deliveries (all completed orders)
    const totalDeliveries = await Order.count({
      where: {
        driver_id,
        status: 'delivered'
      }
    });

    // Get completed today
    const completedToday = await Order.count({
      where: {
        driver_id,
        status: 'delivered',
        updated_at: {
          [Op.gte]: today,
          [Op.lt]: tomorrow
        }
      }
    });

    // Get pending deliveries
    const pendingDeliveries = await Order.count({
      where: {
        driver_id,
        status: {
          [Op.in]: ['pending', 'scheduled', 'in_transit']
        }
      }
    });

    // Calculate earnings (sum of completed orders today)
    const todayOrders = await Order.findAll({
      where: {
        driver_id,
        status: 'delivered',
        updated_at: {
          [Op.gte]: today,
          [Op.lt]: tomorrow
        }
      },
      include: [
        {
          model: OrderItem,
          as: 'orderItems',
          attributes: ['quantity', 'unit_price']
        }
      ]
    });

    const earnings = todayOrders.reduce((total, order) => {
      const orderValue = order.orderItems.reduce((sum, item) => {
        return sum + (item.quantity * item.unit_price);
      }, 0);
      // Assume driver gets 10% commission
      return total + (orderValue * 0.1);
    }, 0);

    // Calculate hours worked today (simplified: assume 30 min per delivery)
    const hoursWorked = (completedToday * 0.5).toFixed(1);

    // Mock rating (in production, fetch from rating system)
    const rating = 4.8;

    res.status(200).json({
      totalDeliveries,
      completedToday,
      pendingDeliveries,
      rating,
      earnings: parseFloat(earnings.toFixed(2)),
      hoursWorked: parseFloat(hoursWorked)
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while fetching statistics',
      error: error.message
    });
  }
};

// Update assignment status
const updateScheduleStatus = async (req, res) => {
  try {
    const driver_id = req.user.driver_id || req.user.id;
    const { assignmentId, status } = req.body;

    // Validate status
    const validStatuses = ['pending', 'in-progress', 'completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    // Find the order (assignment)
    const order = await Order.findOne({
      where: {
        order_id: assignmentId,
        driver_id
      }
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found or you are not assigned to this order'
      });
    }

    // Map frontend status to database status
    let dbStatus = status;
    if (status === 'in-progress') dbStatus = 'in_transit';
    if (status === 'completed') dbStatus = 'delivered';

    // Update order status
    order.status = dbStatus;
    await order.save();

    res.status(200).json({
      success: true,
      message: 'Status updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while updating status',
      error: error.message
    });
  }
};

module.exports = {
  getDriverAssignments,
  getDriverStats,
  updateScheduleStatus
};
