const fs = require('fs')
const path = require('path')
const Sequelize = require('sequelize')

// connecting with database
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: process.env.DB_DIALECT,
  benchmark: true,
  logging: false,
  define: {
    freezeTableName: true,
    underscored: true
  },
  pool: {
    max: Number(process.env.POOL_SIZE),
    min: 1
  }
})

const getModelName = (modelFile) => {
  return modelFile.split('.')[0]
}

// registering models
const modelList = {}
const modelsFolder = path.join(__dirname, '/../../models')

fs.readdirSync(modelsFolder).forEach((modelFile) => {
  const model = require(path.join(modelsFolder, modelFile))(sequelize)
  modelList[getModelName(modelFile)] = model
})

// registering relationships
for (const modelName in modelList) {
  const model = modelList[modelName]
  if (model.registerRelationships) {
    model.registerRelationships(modelList)
  }
}

// Syncing models with the actual database

// sync() - Will create new table if table does not exist. If sequelize found the table, it will do nothing.
// sync(alter: true) - will alter the tables and reflect the models into the database
// sync({force: true}) - will drop the existing table and create new as per models
;(async () => {
  try {
    console.log('test db connection made...')
    await sequelize.sync()
  } catch (error) {
    console.log('Test database sync failed...')
  }
})()

const isConnected = async () => {
  await sequelize.authenticate()
  console.log('Connected with test database...')
}

module.exports = {
  db: modelList,
  sequelize,
  isConnected
}
