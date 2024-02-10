const {
  describe,
  it, 
  expect,
} = require('@jest/globals')
const request = require('supertest')
const { app } = require('../server')
const { registerTestUser, deleteTestUser } = require('./helpers/user')

describe('POST /api/loginUser', () => {
  afterAll(async () => {
    expect(await deleteTestUser('correctdatatest@test.test')).toHaveLength(0)
    expect(await deleteTestUser('wrongpasswordtest@test.test')).toHaveLength(0)
  })

  it('should login user with correct data', async () => {
    const { user } = await registerTestUser('correctdatatest@test.test')

    const login = await request(app)
      .post('/api/loginUser')
      .send(user)

    expect(login.status).toBe(200)
  })

  it('should not login user to not existing email', async () => {
    const user = {
      email: 'test@test.com',
      password: '12345678'
    }

    const response = await request(app)
      .post('/api/loginUser')
      .send(user)

    expect(response.status).toBe(404)
  })

  it('should not login user that password doesnt match', async () => {
    const { user } = await registerTestUser('wrongpasswordtest@test.test')

    const fakeUser = {
      email: user.email,
      password: 'wrongpassword'
    }

    const response = await request(app)
      .post('/api/loginUser')
      .send(fakeUser)

    expect(response.status).toBe(401)
  })

  it('should not login user without email', async () => {
    const fakeUser = {
      email: undefined,
      password: '12345678'
    }

    const response = await request(app)
      .post('/api/loginUser')
      .send(fakeUser)

    expect(response.status).toBe(400)
  })

  it('should not login user without password', async () => {
    const fakeUser = {
      email: 'test@test.com',
      password: undefined,
    }

    const response = await request(app)
      .post('/api/loginUser')
      .send(fakeUser)

    expect(response.status).toBe(400)
  })

  it('should not login with bad email', async () => {
    const fakeUser = {
      email: 'test',
      password: undefined,
    }

    const response = await request(app)
      .post('/api/loginUser')
      .send(fakeUser)

    expect(response.status).toBe(400)
  })
})