const { Model, DataTypes, UUIDV4 } = require("sequelize");
const { sequelize } = require('../utils/db')

class Notification extends Model {}

Notification.init({
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: UUIDV4(),
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  read: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
}, {
  sequelize,
  underscored: true,
  modelName: 'notification'
})

module.exports = Notification