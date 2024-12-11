const { sequelize } = require('../utils/db')
const { DataTypes, Model, UUIDV4 } = require('sequelize')

class Activity extends Model {}

Activity.init({
  id: { // id
    type: DataTypes.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: UUIDV4(),
  },
  cover: {
    type: DataTypes.UUID,
    defaultValue: null
  },
  title: { // 标题
    type: DataTypes.STRING,
    allowNull: false,
  },
  content: { // 内容
    type: DataTypes.TEXT,
    allowNull: false,
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
  score: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  numberOfScore: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
},{
  sequelize,
  modelName: 'activity',
  underscored: true,
})

module.exports = Activity