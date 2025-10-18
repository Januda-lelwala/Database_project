const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Assistant = sequelize.define('Assistant', {
    assistant_id: {
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
    tableName: 'assistant'
  });

  // Define associations
  Assistant.associate = (models) => {
    Assistant.hasMany(models.TruckSchedule, {
      foreignKey: 'assistant_id',
      as: 'schedules'
    });
  };

  return Assistant;
};
