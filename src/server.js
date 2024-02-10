const express = require('express')
const { initCors } = require('./utils/cors')
const { initBodyParser } = require('./utils/bodyparser')
const { initRouter } = require('./utils/router')
const { initDatabaseConnection } = require('./utils/db')
const ENV = require('./utils/env')

const app = express()
const mongodbConnectionString = `mongodb://${ENV.MONGODB_LOGIN}:${ENV.MONGODB_PASSWORD}@${ENV.MONGODB_HOST}:${ENV.MONGODB_PORT}/${ENV.MONGODB_DATABASE}`
const PORT = process.env.NODE_ENV === 'test' ? null : ENV.SERVER_PORT

initCors(app)
initBodyParser(app)
initRouter(app)

const startServer = async () => {
  try {
    await initDatabaseConnection(mongodbConnectionString)
    app.listen(PORT)
  } catch (error) {
    console.error('Error starting server:', error)
  }
}

if (process.env.NODE_ENV !== 'test') {
  startServer()
}

module.exports = { app, startServer }