const { Model, DataTypes, UUIDV4 } = require('sequelize')
const { sequelize } = require('../utils/db')

const uppercaseFirst = str => `${str[0].toUpperCase()}${str.substr(1)}`

class Follow extends Model{
  getFollowable(options) {
    if (!this.followableType) return Promise.resolve(null)
    const mixinMethodName = `get${uppercaseFirst(this.followableType)}`
    return this[mixinMethodName](options)
  }
}

Follow.init({
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: UUIDV4(),
  },
  followableId: {
    type: DataTypes.UUID,
    unique: 'followed_follower',
    allowNull: false,
  },
  followableType: {
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