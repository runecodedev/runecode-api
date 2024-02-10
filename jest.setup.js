const { startServer } = require('./src/server')

beforeAll(async () => {
  await startServer()
})