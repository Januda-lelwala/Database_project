const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Driver = sequelize.define('Driver', {
    driver_id: {
      type: DataTypes.STRING(40),
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(120),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Name is required' }
      }
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    phone_no: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    email: {
      type: DataTypes.STRING(120),
      allowNull: true,
      unique: true
    }
  }, {
    timestamps: false,
    underscored: true,
    tableName: 'driver'
  });

  // Define associations
  Driver.associate = (models) => {
    Driver.hasMany(models.TruckSchedule, {
      foreignKey: 'driver_id',
      as: 'schedules'
    });
  };

  return Driver;
};
