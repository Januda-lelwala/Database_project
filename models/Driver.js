const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize) => {
  const Driver = sequelize.define('Driver', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Name is required' },
        len: { args: [2, 50], msg: 'Name must be between 2 and 50 characters' }
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: { msg: 'Please enter a valid email' }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: { args: [6], msg: 'Password must be at least 6 characters' }
      }
    },
    phone: {
      type: DataTypes.STRING(15),
      allowNull: false,
      validate: {
        is: { args: /^[0-9]{10}$/, msg: 'Please enter a valid 10-digit phone number' }
      }
    },
    licenseNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    licenseExpiry: {
      type: DataTypes.DATE,
      allowNull: false
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true
    },
    experience: {
      type: DataTypes.INTEGER, // in years
      allowNull: false
    },
    rating: {
      type: DataTypes.FLOAT,
      defaultValue: 0
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    currentLocationLat: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    currentLocationLng: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    profileImage: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    timestamps: true,
    underscored: true,
    tableName: 'drivers',
    hooks: {
      beforeSave: async (driver) => {
        if (driver.changed('password')) {
          const salt = await bcrypt.genSalt(12);
          driver.password = await bcrypt.hash(driver.password, salt);
        }
      }
    }
  });

  // Instance method to compare password
  Driver.prototype.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
  };

  // Define associations
  Driver.associate = (models) => {
    Driver.hasMany(models.Vehicle, {
      foreignKey: 'driverId',
      as: 'vehicles'
    });
  };

  return Driver;
};
