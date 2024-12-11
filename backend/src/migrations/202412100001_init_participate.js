const { DataTypes, UUIDV4 } = require('sequelize')

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable('participates', {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: UUIDV4(),
      },
      activity_id: {
        type: DataTypes.UUID,
        reference: {
          model: 'activities',
          key: 'id',
        },
        allowNull: false,
      },
      user_id: {
        type: DataTypes.UUID,
        reference: {
          model: 'users',
          key: 'id',
        },
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'pending',
        validate: {
          isIn: [['pending', 'approved', 'rejected']],
        },
      },
    })
  },

  down: async ({ context: queryInterface }) => {
    await queryInterface.dropTable('participates', {})
  }
}