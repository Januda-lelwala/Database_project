const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

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
    },
    user_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: { msg: 'Username is required' }
      }
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Password is required' }
      }
    }
  }, {
    timestamps: false,
    underscored: true,
    tableName: 'assistant',
    hooks: {
      beforeCreate: async (assistant) => {
        if (assistant.password) {
          assistant.password = await bcrypt.hash(assistant.password, 12);
        }
      },
      beforeUpdate: async (assistant) => {
        if (assistant.changed('password')) {
          assistant.password = await bcrypt.hash(assistant.password, 12);
        }
      }
    }
  });

  // Instance method to compare password
  Assistant.prototype.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
  };

  // Define associations
  Assistant.associate = (models) => {
    Assistant.hasMany(models.TruckSchedule, {
      foreignKey: 'assistant_id',
      as: 'schedules'
    });
  };

  return Assistant;
};
