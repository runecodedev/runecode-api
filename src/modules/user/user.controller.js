const bcrypt = require('bcryptjs')
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