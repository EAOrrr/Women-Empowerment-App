const { DataTypes, UUIDV4, } = require('sequelize')

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable('posts', {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: UUIDV4(),
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM(
          'in progress',
          'answered',
          'done',
        ),
        defaultValue: 'in progress',
        allowNull: false,
      },
      likes: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      views: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
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

    await queryInterface.addColumn('posts', 'user_id', {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'users', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    })
  },

  down: async ({ context: queryInterface }) => {
    await queryInterface.dropTable('posts')
  }
}