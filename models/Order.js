const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Order = sequelize.define('Order', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    orderNumber: {
      type: DataTypes.STRING,
      unique: true,
      defaultValue: () => 'ORD-' + Date.now() + Math.floor(Math.random() * 1000)
    },
    customerId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'customers',
        key: 'id'
      }
    },
    orderDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    subTotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0
    },
    taxAmount: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0
    },
    shippingCost: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0
    },
    discountAmount: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0
    },
    totalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0
    },
    paymentStatus: {
      type: DataTypes.STRING,
      defaultValue: 'pending',
      validate: {
        isIn: {
          args: [['pending', 'paid', 'failed', 'refunded']],
          msg: 'Invalid payment status'
        }
      }
    },
    paymentMethod: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isIn: {
          args: [['cash', 'credit_card', 'debit_card', 'upi', 'wallet', 'net_banking', 'cod']],
          msg: 'Invalid payment method'
        }
      }
    },
    orderStatus: {
      type: DataTypes.STRING,
      defaultValue: 'processing',
      validate: {
        isIn: {
          args: [['processing', 'confirmed', 'shipped', 'delivered', 'cancelled', 'returned']],
          msg: 'Invalid order status'
        }
      }
    },
    shippingAddress: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    billingAddress: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    shippingMethod: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'standard'
    },
    expectedDeliveryDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    specialInstructions: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    cancellationReason: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: { args: [1], msg: 'Rating must be at least 1' },
        max: { args: [5], msg: 'Rating cannot exceed 5' }
      }
    },
    feedback: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    timestamps: true,
    underscored: true,
    tableName: 'orders',
    indexes: [
      {
        fields: ['customer_id', 'order_date']
      },
      {
        fields: ['order_status']
      }
    ]
  });

  // Define associations
  Order.associate = (models) => {
    Order.belongsTo(models.Customer, {
      foreignKey: 'customerId',
      as: 'customer'
    });
    
    Order.hasMany(models.OrderItem, {
      foreignKey: 'orderId',
      as: 'orderItems'
    });
  };

  return Order;
};
