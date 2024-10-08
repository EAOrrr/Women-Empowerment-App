const { Model, DataTypes, UUIDV4 } = require('sequelize')
const { sequelize } = require('../utils/db')

class Post extends Model {}

Model.init({
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
    allowNull:false,
  },
  status: { // 状态
    type: DataTypes.ENUM(
      'in progress',  // 进行中
      'done', // 已完成
      'answered', // 已回答（但未完成）
    ),
    allowNull: false,
    defaultValue: 'in progress',
  },
  likes: { // 点赞数
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  views: { // 浏览数
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id',
    }
  },
}, {
  sequelize,
  underscored: true,
  modelName: 'post'
})

module.exports = Post