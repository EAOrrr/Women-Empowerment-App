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
      content: {
        type: DataTypes.TEXT,
        allowNull:false,
      },
      author: {
        type: DataTypes.STRING,
        defaultValue: null
      },
      type: {
        type: DataTypes.ENUM(
          'activity',
          'policy',
          'law',
        ),
        allowNull: false,
      },
      cover: {
        type: DataTypes.BLOB,
        defaultValue: null
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
      }
    })

    await queryInterface.createTable('comments', {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: UUIDV4(),
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
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
    })

    await queryInterface.createTable('jobs', {
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
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    })

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
          'done',
        ),
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

    await queryInterface.createTable('recruitments', {
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
      province: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      city: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      district: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      street: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false
      }
    })

    await queryInterface.createTable('users', {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: UUIDV4(),
      },
      openid: {
        type: DataTypes.STRING,
      },
      phone: {
        type: DataTypes.STRING
      },
      avatar: {
        type: DataTypes.BLOB,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        defaultValue: null,
      },
      role: {
        type: DataTypes.ENUM('admin', 'user'),
        defaultValue: 'user',
        allowNull: false,
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

    await queryInterface.createTable('notifications', {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: UUIDV4(),
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      read: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
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
    await queryInterface.dropTable('articles', {})
    await queryInterface.dropTable('comments', {})
    await queryInterface.dropTable('jobs', {})
    await queryInterface.dropTable('posts', {})
    await queryInterface.dropTable('recruitments', {})
    await queryInterface.dropTable('users', {})
    await queryInterface.dropTable('notifications', {})
  }
}