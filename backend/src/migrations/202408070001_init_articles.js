const { DataTypes, UUIDV4 } = require('sequelize')

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable('articles', {
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
      abstract: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull:false,
      },
      author: {
        type: DataTypes.STRING,
        defaultValue: null
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isIn: [['activity', 'policy', 'law', 'guide', 'report']],
        },
      },
      tags: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: []
      },
      views: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      likes: {
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
      is_announcement: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      score: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      number_of_score: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      is_draft: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      cover: {
        type: DataTypes.UUID,
        defaultValue: null
      }
    })
  },

  down: async ({ context: queryInterface }) => {
    await queryInterface.dropTable('articles', {})
  }
}