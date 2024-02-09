const request = require('supertest')
const ENV = require('../../utils/env')
const app = require('../../server')

exports.registerRandomGeneratedUser = async () => {
  const user = {
    email: `${ENV.TEST_USER}-${(Math.random() * 100000).toFixed()}@${ENV.TEST_DOMAIN}`,
    password: '12345678'
  }

  const response = await request(app)
      .post('/api/registerUser')
      .send(user)

  return { response, user }
}