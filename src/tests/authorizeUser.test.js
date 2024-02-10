const {
  describe,
  it, 
  expect,
  afterAll
} = require('@jest/globals')
const request = require('supertest')
const jwt = require('jsonwebtoken')
const { app } = require('../server')
const { registerTestUser, deleteTestUser } = require('./helpers/user')

describe('GET /api/authorizeUser', () => {
  afterAll(async () => {
    expect(await deleteTestUser('validtoken@test.test')).toHaveLength(0)
  })
  it('should return 401 if Authorization header is not provided', async () => {
    const response = await request(app)
      .get('/api/authorizeUser')

    expect(response.status).toBe(401)
  })

  it('should return 401 for invalid token', async () => {
    const invalidToken = 'invalid_token'

    const response = await request(app)
      .get('/api/authorizeUser')
      .set('Authorization', `Bearer ${invalidToken}`)

    expect(response.status).toBe(401)
  })

  it('should return 200 for valid token', async () => {
    const { user } = await registerTestUser('validtoken@test.test')

    const loginResponse = await request(app)
      .post('/api/loginUser')
      .send(user)

    const token = loginResponse.body.data.token

    const response = await request(app)
      .get('/api/authorizeUser')
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(200)
  })

  it('should return 401 for failed JWT verification', async () => {
    const expiredToken = jwt.sign({ userId: 'mockUserId' }, 'wrong_secret', { expiresIn: '0s' })
  
    const response = await request(app)
      .get('/api/authorizeUser')
      .set('Authorization', `Bearer ${expiredToken}`)
  
    expect(response.status).toBe(401)
  })
})