const userModel = require('../modules/user/user.model')
const { createResponse } = require('../utils/response')

exports.validateUser = [
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

    next();
  }
]