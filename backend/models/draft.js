const { sequelize } = require('../utils/db')
const { DataTypes, Model, UUIDV4 } = require('sequelize')


/**
 * Draft model: 储存前端TIPTAP富文本编辑器的草稿
 *
 * Fields:
 * - id: A unique identifier for each draft, generated using UUIDV4.
 * - content: The content of the draft. (stored in JSON format)
 * - timestamps: The time of creation and last update of the draft.
 */

class Draft extends Model {}

Draft.init({
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: UUIDV4(),
  },

  content: {
    type: DataTypes.JSON,
    allowNull: false,
  },
}, {
  sequelize,
  underscored: true,
  modelName: 'draft'
})

module.exports = Draft