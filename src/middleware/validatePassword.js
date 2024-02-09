const { check, validationResult } = require('express-validator')
const { createResponse } = require('../utils/response')

exports.validatePasswordForRegistration = [
  check('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
  ,
  (req, res, next) => {
    const { errors } = validationResult(req);

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

    next();
  }
]