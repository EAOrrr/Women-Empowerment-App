const { Model, DataTypes, UUIDV4 } = require("sequelize");
const { sequelize } = require('../utils/db')

class Comment extends Model{}

Comment.init({
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: UUIDV4(),
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  likes: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
}, {
  sequelize,
  underscored: true,
  modelName: 'comment'
})

module.exports = Comment