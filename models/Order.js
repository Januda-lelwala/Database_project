const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Order = sequelize.define('Order', {
    order_id: {
      type: DataTypes.STRING(40),
      primaryKey: true
    },
    customer_id: {
      type: DataTypes.STRING(40),
      allowNull: false,
      references: {
        model: 'customer',
        key: 'customer_id'
      }
    },
    order_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    destination_city: {
      type: DataTypes.STRING(80),
      allowNull: false
    },
    destination_address: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('pending', 'confirmed', 'scheduled', 'in_transit', 'delivered', 'cancelled'),
      defaultValue: 'pending'
    },
    driver_id: {
      type: DataTypes.STRING(40),
      allowNull: true,
      references: {
        model: 'driver',
        key: 'driver_id'
      }
    },
    payment_method: {
      type: DataTypes.ENUM('Cash', 'Card'),
      defaultValue: 'Cash'
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    timestamps: false,
    underscored: true,
    tableName: 'orders'
  });

  // Define associations
  Order.associate = (models) => {
    Order.belongsTo(models.Customer, {
      foreignKey: 'customer_id',
      as: 'customer'
    });
    
    Order.belongsTo(models.Driver, {
      foreignKey: 'driver_id',
      as: 'driver'
    });
    
    Order.hasMany(models.OrderItem, {
      foreignKey: 'order_id',
      as: 'orderItems'
    });

    // Uncomment when TrainShipment and TruckDelivery models are created
    // Order.hasMany(models.TrainShipment, {
    //   foreignKey: 'order_id',
    //   as: 'trainShipments'
    // });

    // Order.hasMany(models.TruckDelivery, {
    //   foreignKey: 'order_id',
    //   as: 'truckDeliveries'
    // });
  };

  return Order;
};
