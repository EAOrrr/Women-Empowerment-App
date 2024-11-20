const { DataTypes, UUIDV4 } = require('sequelize')

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable('images', {
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

      mime_type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      reference_type: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      reference_id: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
      }
    })
  },

  down: async ({ context: queryInterface }) => {
    await queryInterface.dropTable('images', {})
  }
}