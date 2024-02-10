const {
  describe,
  it, 
  expect,
} = require('@jest/globals')

const { initDatabaseConnection } = require('../utils/db')
const ENV = require('../utils/env')

describe('database connection', () => {
  it('should connect to database', async () => {
    const mongodbConnectionString = `mongodb://${ENV.MONGODB_LOGIN}:${ENV.MONGODB_PASSWORD}@${ENV.MONGODB_HOST}:${ENV.MONGODB_PORT}/${ENV.MONGODB_DATABASE}`
    const connection = await initDatabaseConnection(mongodbConnectionString)

    expect(connection).toBeTruthy()
  })

  it('should not connect to database without connection string', async () => {
    await expect(initDatabaseConnection()).rejects.toThrow()
  })

  it('should not connect to database with bad login', async () => {
    const mongodbConnectionString = `mongodb://xxxx:${ENV.MONGODB_PASSWORD}@${ENV.MONGODB_HOST}:${ENV.MONGODB_PORT}/${ENV.MONGODB_DATABASE}`
    await expect(initDatabaseConnection(mongodbConnectionString)).rejects.toThrow()
  })

  it('should not connect to database with bad password', async () => {
    const mongodbConnectionString = `mongodb://${ENV.MONGODB_LOGIN}:xxxx@${ENV.MONGODB_HOST}:${ENV.MONGODB_PORT}/${ENV.MONGODB_DATABASE}`
    await expect(initDatabaseConnection(mongodbConnectionString)).rejects.toThrow()
  })

  it('should not connect to database with bad host', async () => {
    const mongodbConnectionString = `mongodb://${ENV.MONGODB_LOGIN}:${ENV.MONGODB_PASSWORD}@xxxx:${ENV.MONGODB_PORT}/${ENV.MONGODB_DATABASE}`
    const timeout = 10000
    const timeoutPromise = new Promise((resolve) => setTimeout(resolve, timeout))

    await Promise.race([
      initDatabaseConnection(mongodbConnectionString),
      timeoutPromise
    ]).catch((error) => {
      expect(error.message).toContain('Exceeded timeout')
    })
  }, 15000)

  it('should not connect to database with bad port', async () => {
    const mongodbConnectionString = `mongodb://${ENV.MONGODB_LOGIN}:${ENV.MONGODB_PASSWORD}@${ENV.MONGODB_HOST}:xxxx/${ENV.MONGODB_DATABASE}`
    const timeout = 10000
    const timeoutPromise = new Promise((resolve) => setTimeout(resolve, timeout))

    await Promise.race([
      initDatabaseConnection(mongodbConnectionString),
      timeoutPromise
    ]).catch((error) => {
      expect(error.message).toContain(`Unable to parse ${ENV.MONGODB_HOST}:xxxx with URL`)
    })
  }, 15000)
  
  it('should not connect to database with bad database', async () => {
    const mongodbConnectionString = `mongodb://${ENV.MONGODB_LOGIN}:${ENV.MONGODB_PASSWORD}@${ENV.MONGODB_HOST}:${ENV.MONGODB_PORT}/xxxx`
    await expect(initDatabaseConnection(mongodbConnectionString)).rejects.toThrow()
  })
})