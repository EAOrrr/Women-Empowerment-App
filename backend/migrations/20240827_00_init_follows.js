const { DataTypes, UUIDV4 } = require('sequelize')

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable('follows', {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: UUIDV4(),
      },
      followable_id: {
        type: DataTypes.UUID,
        unique: 'followed_follower',
        allowNull: false,
      },
      followable_type: {
        type: DataTypes.STRING,
        unique: 'followed_follower',
        allowNull: false,
      },
      follower_id: {
        type: DataTypes.UUID,
        unique: 'followed_follower',
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
    })
  },

  down: async ({ context: queryInterface }) => {
    await queryInterface.dropTable('follows', {})
  }
}