const bcrypt = require('bcryptjs')
const userModel = require('./user.model')
const { createResponse } = require('../../utils/response')

exports.registerUser = async (req, res, next) => {
  const { email, password } = req.body

  try {
    if(!email){
      res.status(400).json(createResponse({
        code: 'REGISTER_001',
        type: 'ERROR',
        message: 'Email was not provided',
      }))
      return
    }

    if(!password){
      res.status(400).json(createResponse({
        code: 'REGISTER_002',
        type: 'ERROR',
        message: 'Password was not provided',
      }))
      return
    }

    if (await userModel.findOne({email: email})) { 
      res.status(409).json(createResponse({
        code: 'REGISTER_003',
        type: 'ERROR',
        message: 'User with that email already exists',
      }))
      return
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const newUser = new userModel({
      email,
      password: hashedPassword
    })

    await newUser.save()
  
    res.status(201).json(createResponse({
      code: 'REGISTER_004',
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
      code: 'REGISTER_005',
      type: 'ERROR',
      message: 'Unexpected error',
      data: {
        error
      }
    }))
  }
}