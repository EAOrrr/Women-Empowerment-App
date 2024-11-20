const { sequelize } = require('../utils/db')
const { DataTypes, Model, UUIDV4 } = require('sequelize')

// Image model: 储存Article的图片
// Helper function
const uppercaseFirst = str => `${str[0].toUpperCase()}${str.substr(1)}`
class Image extends Model {
  getReference(options) {
    if (!this.referenceType) return Promise.resolve(null);
    const mixinMethodName = `get${uppercaseFirst(this.commentableType)}`;
    return this[mixinMethodName](options);
  }
}

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
  referenceType: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  referenceId: {
    type: DataTypes.UUID,
    allowNull: true,
  },
}, {
  sequelize,
  underscored: true,
  modelName: 'image'
})

module.exports = Image

