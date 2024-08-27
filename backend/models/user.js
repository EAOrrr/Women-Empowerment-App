const { Model, DataTypes, UUIDV4 } = require('sequelize')
const { sequelize } = require('../utils/db')

class User extends Model{
  async getFollowable(options) {
    const articles = await this.getFollowableArticles(options)
    const posts = await this.getFollowablePosts(options)
    return {
      articles,
      posts,
    }
  }
}

User.init({
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: UUIDV4(),
  },
  openid: {
    type: DataTypes.STRING,
  },
  phone: {
    type: DataTypes.STRING
  },
  avatar: {
    type: DataTypes.BLOB,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    defaultValue: null,
  },
  role: {
    type: DataTypes.ENUM('admin', 'user'),
    defaultValue: 'user',
    allowNull: false,
  }
}, {
  sequelize,
  underscored: true,
  modelName: 'user'
})

module.exports = User