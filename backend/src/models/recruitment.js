const { sequelize } = require('../utils/db')
const { DataTypes, Model, UUIDV4 } = require('sequelize')

class Recruitment extends Model {}

Recruitment.init({
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
  name: { // 名称
    type: DataTypes.STRING,
    allowNull: false,
  },
  intro: { // 简介
    type: DataTypes.TEXT,
    allowNull: false,
  },
  province: { // 省份
    type: DataTypes.STRING,
    allowNull: false,
  },
  city: { // 城市
    type: DataTypes.STRING,
    allowNull: false,
  },
  district: { // 区
    type: DataTypes.STRING,
    allowNull: false,
  },
  street: { // 街道
    type: DataTypes.STRING,
    allowNull: false,
  },
  address: { // 地址
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone: { // 电话
    type: DataTypes.STRING,
    allowNull: false,
  },
  likes: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  views: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  pictures: {
    type: DataTypes.ARRAY(DataTypes.UUID),
    defaultValue: []
  },
}, {
  sequelize,
  underscored: true,
  modelName: 'recruitment'
})

module.exports = Recruitment