const { Model, DataTypes, UUIDV4 } = require('sequelize')
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
  jumpTo: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  type: {
    type: DataTypes.ENUM(
      'global',
      'post_created',
      'comment_reply',
    ),
    allowNull: false,
  }
}, {
  sequelize,
  underscored: true,
  modelName: 'notification'
})

module.exports = Notification