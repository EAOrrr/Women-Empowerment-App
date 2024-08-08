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
      followedId: {
        type: DataTypes.UUID,
        unique: 'followed_follower',
        allowNull: false,
      },
      followedType: {
        type: DataTypes.STRING,
        unique: 'followed_follower',
        allowNull: false,
      },
      followerId: {
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