const { Model, DataTypes, UUIDV4 } = require("sequelize");
const { sequelize } = require('../utils/db')

class Follow extends Model{}

Follow.init({
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: UUIDV4(),
  },
  followedId: {
    type: DataTypes.UUID,
    unique: 'followed_follower',
    allowNull: false,
  },
  followedType: {
    type: DataTypes.STRING,
    unique: 'followed_follower',
    allowNull: false,
  },
  followerId: {
    type: DataTypes.UUID,
    unique: 'followed_follower',
    allowNull: false,
  },
}, {
  sequelize,
  underscored: true,
  modelName: 'follow'
})

module.exports = Follow