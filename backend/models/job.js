const { Model, DataTypes, UUIDV4 } = require("sequelize");
const { sequelize } = require('../utils/db')

class Job extends Model{}

Job.init({
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: UUIDV4(),
  },
  intro: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  lowerBound: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  upperBound: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  sequelize,
  underscored: true,
  modelName: 'job'
})

module.exports = Job