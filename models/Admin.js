const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize) => {
  const Admin = sequelize.define('Admin', {
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
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'admin',
      validate: {
        isIn: { args: [['admin', 'super_admin']], msg: 'Invalid role' }
      }
    },
    permissions: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: ['manage_bookings', 'view_reports']
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    lastLogin: {
      type: DataTypes.DATE,
      defaultValue: null
    },
    createdById: {
      type: DataTypes.UUID,
      references: {
        model: 'admins',
        key: 'id'
      },
      allowNull: true
    }
  }, {
    timestamps: true,
    underscored: true,
    tableName: 'admins',
    hooks: {
      beforeSave: async (admin) => {
        if (admin.changed('password')) {
          const salt = await bcrypt.genSalt(12);
          admin.password = await bcrypt.hash(admin.password, salt);
        }
      }
    }
  });

  // Instance method to compare password
  Admin.prototype.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
  };

  // Define associations
  Admin.associate = (models) => {
    Admin.belongsTo(models.Admin, {
      foreignKey: 'createdById',
      as: 'createdBy'
    });
  };

  return Admin;
};
