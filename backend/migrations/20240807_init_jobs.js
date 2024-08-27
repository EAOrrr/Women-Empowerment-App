const { DataTypes, UUIDV4 } = require('sequelize')

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable('jobs', {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: UUIDV4(),
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      intro: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      lower_bound: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      upper_bound: {
        type: DataTypes.INTEGER,
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
      recruitment_id: {
        type: DataTypes.UUID,
        reference: {
          model: 'recruitments',
          key: 'id',
        },
        allowNull: false,
      }
    })
  },

  down: async ({ context: queryInterface }) => {
    await queryInterface.dropTable('jobs', {})
  }
}
