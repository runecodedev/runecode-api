const { check, validationResult } = require('express-validator')
const { createResponse } = require('../utils/response')
const userModel = require('../modules/user/user.model')

const validateEmail = [
  check('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Provided email is not valid')
  ,
  (req, res, next) => {
    const { errors } = validationResult(req)

    if (errors.length) {
      res.status(400).json(createResponse({
        code: 'WRONG_EMAIL',
        type: 'ERROR',
        message: 'Errors occured in email validation',
        data: {
          errors: errors
        }
      }))
      return
    }

    next()
  }
]

const validatePassword = [
  check('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
  ,
  (req, res, next) => {
    const { errors } = validationResult(req)

    if (errors.length) {
      res.status(400).json(createResponse({
        code: 'WRONG_PASSWORD',
        type: 'ERROR',
        message: 'Errors occured in password validation',
        data: {
          errors: errors
        }
      }))
      return
    }

    next()
  }
]

const validateUser = [
  async (req, res, next) => {
    const { email } = req.body

    const user = await userModel.findOne({ email: email })

    if (user) { 
      res.status(409).json(createResponse({
        code: 'USER_EXISTS',
        type: 'ERROR',
        message: 'User with that email already exists',
      }))
      return
    }

    next()
  }
]

exports.registerValidation = [
  validateEmail,
  validatePassword,
  validateUser
]