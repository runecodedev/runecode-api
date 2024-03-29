const {
  describe,
  it, 
  expect,
  afterAll
} = require('@jest/globals')

const { app } = require('../server')
const ENV = require('../utils/env')
const request = require('supertest')
const userModel = require('../modules/user/user.model')
const bcrypt = require('bcryptjs')
const { registerUser } = require('../modules/user/user.controller')
const { 
  registerTestUser,
  deleteTestUser,
} = require('./helpers/user')

describe('POST /api/registerUser', () => {
  afterAll(async () => {
    expect(await deleteTestUser('uniquetest@unique.test')).toHaveLength(0)
    expect(await deleteTestUser('testinghashedpassword@test.com')).toHaveLength(0)
    expect(await deleteTestUser('uniquevaliduser@test.test')).toHaveLength(0)
  })

  it('should register unique user', async () => {
    const { response } = await registerTestUser('uniquevaliduser@test.test')

    expect(response.status).toBe(201)
  })

  it('should register unique user with hashed password', async () => {
    const { user } = await registerTestUser('testinghashedpassword@test.com')

    const findUserInDB = await userModel.findOne({ email: user.email })

    const passwordComparison = await bcrypt.compare(user.password, findUserInDB.password)

    expect(passwordComparison).toBe(true)
  })
  
  it('should not register user without email', async () => {
    const user = {
      email: undefined,
      password: ENV.TEST_PASSWORD
    }

    const response = await request(app)
      .post('/api/registerUser')
      .send(user)

    expect(response.status).toBe(400)
  })

  it('should not register user with bad email', async () => {
    const user = {
      email: 'email',
      password: ENV.TEST_PASSWORD
    }

    const response = await request(app)
      .post('/api/registerUser')
      .send(user)

    expect(response.status).toBe(400)
  })

  it('should not register user without password', async () => {
    const user = {
      email: `${ENV.TEST_USER}@${ENV.TEST_DOMAIN}`,
      password: undefined
    }

    const response = await request(app)
      .post('/api/registerUser')
      .send(user)

    expect(response.status).toBe(400)
  })

  it('should not register user with password length less than 8', async () => {
    const user = {
      email: `${ENV.TEST_USER}@${ENV.TEST_DOMAIN}`,
      password: 'weak'
    }

    const response = await request(app)
      .post('/api/registerUser')
      .send(user)

    expect(response.status).toBe(400)
  })

  it('should not register user with empty user object', async () => {
    const user = {}

    const response = await request(app)
      .post('/api/registerUser')
      .send(user)

    expect(response.status).toBe(400)
  })

  it('should not register user without any data', async () => {
    const response = await request(app)
      .post('/api/registerUser')
      .send()

    expect(response.status).toBe(400)
  })

  it('should not register new user when user with given email exists', async () => {
    await registerTestUser('uniquetest@unique.test')
    const { response } = await registerTestUser('uniquetest@unique.test')

    expect(response.status).toBe(409)
  })

  it('should return status 500 when userModel save method throws an error', async () => {
    const req = {
      body: {
        email: `${ENV.TEST_USER}-${(Math.random() * 100000).toFixed()}@${ENV.TEST_DOMAIN}`,
        password: ENV.TEST_PASSWORD
      }
    }
    const res = {
      status: jest.fn(() => res),
      json: jest.fn()
    }

    jest.spyOn(userModel.prototype, 'save').mockRejectedValue(new Error('Test error'))

    await registerUser(req, res)

    expect(res.status).toHaveBeenCalledWith(500)
  })
})