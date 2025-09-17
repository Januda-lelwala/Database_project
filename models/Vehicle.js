const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Vehicle = sequelize.define('Vehicle', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    vehicleNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: { msg: 'Vehicle number is required' }
      }
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: {
          args: [['bus', 'taxi', 'auto', 'truck', 'van', 'car']],
          msg: 'Invalid vehicle type'
        }
      }
    },
    brand: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Vehicle brand is required' }
      }
    },
    model: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Vehicle model is required' }
      }
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: { args: [1], msg: 'Capacity must be at least 1' }
      }
    },
    fuelType: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: {
          args: [['petrol', 'diesel', 'cng', 'electric', 'hybrid']],
          msg: 'Invalid fuel type'
        }
      }
    },
    registrationDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    insuranceExpiry: {
      type: DataTypes.DATE,
      allowNull: false
    },
    pucExpiry: {
      type: DataTypes.DATE,
      allowNull: false
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'active',
      validate: {
        isIn: {
          args: [['active', 'maintenance', 'inactive', 'retired']],
          msg: 'Invalid status'
        }
      }
    },
    driverId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'drivers',
        key: 'id'
      }
    },
    currentLocationLat: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    currentLocationLng: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    currentLocationAddress: {
      type: DataTypes.STRING,
      allowNull: true
    },
    lastLocationUpdate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    features: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: []
    }
  }, {
    timestamps: true,
    underscored: true,
    tableName: 'vehicles'
  });

  // Define associations
  Vehicle.associate = (models) => {
    Vehicle.belongsTo(models.Driver, {
      foreignKey: 'driverId',
      as: 'driver'
    });
    
    Vehicle.belongsToMany(models.Route, {
      through: 'vehicle_routes',
      foreignKey: 'vehicle_id',
      otherKey: 'route_id',
      as: 'routes'
    });

    Vehicle.hasMany(models.Booking, {
      foreignKey: 'vehicleId',
      as: 'bookings'
    });

    // This association will be enabled when database is set up
    // Vehicle.hasMany(models.MaintenanceRecord, {
    //   foreignKey: 'vehicleId',
    //   as: 'maintenanceRecords'
    // });
  };

  return Vehicle;
};
