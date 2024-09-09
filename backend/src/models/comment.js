const { Model, DataTypes, UUIDV4 } = require('sequelize')
const { sequelize } = require('../utils/db')

const uppercaseFirst = str => `${str[0].toUpperCase()}${str.substr(1)}`

class Comment extends Model{
  getCommentable(options) {
    if (!this.commentableType) return Promise.resolve(null)
    const mixinMethodName = `get${uppercaseFirst(this.commentableType)}`
    return this[mixinMethodName](options)
  }
}

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
  commentableType: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  commentableId: {
    type: DataTypes.UUID,
    allowNull: false
  }
}, {
  sequelize,
  underscored: true,
  modelName: 'comment'
})

module.exports = Comment