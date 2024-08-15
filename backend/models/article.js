const { sequelize } = require('../utils/db')
const { DataTypes, Model, UUIDV4 } = require('sequelize')

class Article extends Model {}

Article.init({
  id: { // id
    type: DataTypes.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: UUIDV4(),
  },
  title: { // 标题
    type: DataTypes.STRING,
    allowNull: false,
  },
  content: { // 内容
    type: DataTypes.TEXT,
    allowNull: false,
  },
  abstract: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  author: {
    type: DataTypes.STRING,
    defaultValue: null
  },
  type: {
    type: DataTypes.ENUM(
      'activity',
      'policy',
      'law',
    ),
    allowNull: false
  },
  cover: {
    type: DataTypes.BLOB,
    defaultValue: null
  },
  views: { // 浏览数
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  likes: { // 关注数
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  tags: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  isAnnouncement: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
}, {
  sequelize,
  underscored: true,
  modelName: 'article'
})

module.exports = Article