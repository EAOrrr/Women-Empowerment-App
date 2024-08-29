const Sequelize = require('sequelize')
const { Umzug, SequelizeStorage } = require('umzug')
const { DATABASE_URL } = require('./config')

const sequelize = new Sequelize(DATABASE_URL,
  {
    dialect: 'postgres',
    dialectOptions: {
      entrypt: true,
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
  //   logging: false,
  }
)

// const sequelize = new Sequelize('a-million-plan', 'AzureUser', 'A-Million-Plan', {
//   host: 'a-million-plan.postgres.database.azure.com',
//   dialect: 'postgres',
//   ssl: {
//     require: true,
//   }
// })

// const sequelize = new Sequelize('dbForDev', 'AzureUser', 'Azure@User', {
//   host: 'a-million-plan.database.windows.net',
//   dialect: 'mssql',
//   // dialect: 'postgres',
//   dialectOptions: {
//     encrypt: true
//   }
// });

const migrationConf = {
  migrations: {
    glob: 'migrations/*.js',
  },
  storage: new SequelizeStorage({ sequelize, tableName: 'migrations' }),
  context: sequelize.getQueryInterface(),
  logger: console,
}

const rollbackMigration = async () => {
  await sequelize.authenticate()
  const migrator = new Umzug(migrationConf)
  await migrator.down()
  sequelize.close()
}

const runMigrations = async () => {
  const migrator = new Umzug(migrationConf)
  // await migrator.down()
  const migrations = await migrator.up()

  console.log('Migrations up to date', {
    files: migrations.map((mig) => mig.name),
  })
}

const connectToDatabase = async () => {

  try {
    console.log('try to connect')
    await sequelize.authenticate()
    await runMigrations()
    console.log('database connected')
  } catch (err) {
    console.log('connecting database failed', err)
    return process.exit(1)
  }

  return null
}

module.exports = { connectToDatabase, sequelize, rollbackMigration }