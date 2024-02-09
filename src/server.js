const ENV = require('./utils/env')
const { initCors } = require('./utils/cors')
const { initBodyParser } = require('./utils/bodyparser')
const { initRouter } = require('./utils/router')
const { initDatabaseConnection } = require('./utils/db')

const app = require('express')()
const mongodbConnectionString = `mongodb://${ENV.MONGODB_LOGIN}:${ENV.MONGODB_PASSWORD}@${ENV.MONGODB_HOST}:${ENV.MONGODB_PORT}/${ENV.MONGODB_DATABASE}`

initCors(app)
initBodyParser(app)
initRouter(app)
initDatabaseConnection(mongodbConnectionString)

const PORT = process.env.NODE_ENV === 'test' ? null : ENV.SERVER_PORT

module.exports = app.listen(PORT)