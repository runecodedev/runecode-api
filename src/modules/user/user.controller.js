const ENV = require('../../utils/env')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const userModel = require('./user.model')
const { createResponse } = require('../../utils/response')

exports.registerUser = async (req, res, next) => {
  const { email, password } = req.body

  try {
    const hashedPassword = await bcrypt.hash(password, 12)

    const newUser = new userModel({
      email,
      password: hashedPassword
    })

    await newUser.save()
  
    res.status(201).json(createResponse({
      code: 'USER_CREATED',
      type: 'SUCCESS',
      message: 'User was successfully created',
      data: {
        user: {
          email
        }
      }
    }))
  } catch (error) {
    res.status(500).json(createResponse({
      code: 'REGISTER_UNEXPECTED_ERROR',
      type: 'ERROR',
      message: 'Unexpected error',
      data: {
        errors: [
          error
        ]
      }
    }))
  }
}

exports.loginUser = async (req, res, next) => {
  try {
    const { savedUser } = req

    const user = {
      id: savedUser._id.toString(),
      email: savedUser.email,
    }

    const token = jwt.sign(user, ENV.JWT_SECRET, { expiresIn: '1h' })

    res.status(200).json(createResponse({
      code: 'USER_LOGGED_IN',
      type: 'SUCCESS',
      message: 'User logged in',
      data: {
        token: token,
        userId: user.id
      }
    }))
  } catch (error) {
    res.status(500).json(createResponse({
      code: 'LOGIN_UNEXPECTED_ERROR',
      type: 'ERROR',
      message: 'Unexpected error',
      data: {
        errors: [
          error
        ]
      }
    }))
  }
}

exports.authorizeUser = async (req, res, next) => {
  res.status(200).json(createResponse({
    code: 'USER_AUTHORIZED',
    type: 'SUCCESS',
    message: 'User was succesfully authorized'
  }))
}