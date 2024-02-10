const { check, validationResult } = require('express-validator')
const { createResponse } = require('../utils/response')
const userModel = require('../modules/user/user.model')
const bcrypt = require('bcryptjs')

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

const validateUserExistance = [
  async (req, res, next) => {
    const { email } = req.body

    const user = await userModel.findOne({ email: email })

    if (!user) { 
      res.status(404).json(createResponse({
        code: 'USER_DOESNT_EXIST',
        type: 'ERROR',
        message: 'User with that email does not exist',
      }))
      return
    }

    req.savedUser = user

    next()
  }
]

const validatePasswordMatch = [
  async (req, res, next) => {
    const { savedUser } = req
    const { password } = req.body

    const compare = await bcrypt.compare(password, savedUser.password)

    if (!compare) {
      res.status(401).json(createResponse({
        code: 'PASSWORD_DOESNT_MATCH',
        type: 'ERROR',
        message: 'Incorrect password',
      }))
      return
    }

    next()
  }
]

exports.loginValidation = [
  validateEmail,
  validatePassword,
  validateUserExistance,
  validatePasswordMatch
]