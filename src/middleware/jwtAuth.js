const jwt = require('jsonwebtoken')
const ENV = require('../utils/env')
const { createResponse } = require('../utils/response')

module.exports = (req, res, next) => {
  const token = req.get('Authorization')?.split(' ')[1]

  if (!token) {
    return res.status(401).json(createResponse({
      code: 'JWT_TOKEN_NOT_FOUND',
      type: 'ERROR',
      message: 'JWT token not found',
    }))
  }

  try {
    const decoded = jwt.verify(token, ENV.JWT_SECRET)
    if (!decoded) {
      return res.status(401).json(createResponse({
        code: 'JWT_NO_AUTH',
        type: 'ERROR',
        message: 'Not authorized',
      }))
    }
    next()
  } catch (error) {
    return res.status(401).json(createResponse({
      code: 'JWT_VERIFICATION_FAILED',
      type: 'ERROR',
      message: 'JWT verification failed',
    }))
  }
}