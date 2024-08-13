const { sequelize } = require('../utils/db')
const { DataTypes, Model, UUIDV4 } = require('sequelize')

// Image model: 储存Article的图片

class Image extends Model {}

Image.init({
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: UUIDV4(),
  },

  data: {
    type: DataTypes.BLOB('long'),
    allowNull: false,
  },

  mimeType: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  sequelize,
  underscored: true,
  modelName: 'image'
})

module.exports = Image

