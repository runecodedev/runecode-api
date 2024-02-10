const request = require('supertest')
const ENV = require('../../utils/env')
const { app } = require('../../server')
const userModel = require('../../modules/user/user.model')

exports.registerTestUser = async (email) => {
  const user = {
    email: email,
    password: ENV.TEST_PASSWORD
  }

  const response = await request(app)
      .post('/api/registerUser')
      .send(user)

  return { response, user }
}

exports.deleteTestUser = async (email) => {
  await userModel.deleteMany({ email: email })

  return await userModel.find({ email: email })
}