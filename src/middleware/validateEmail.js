const { check, validationResult } = require('express-validator')
const { createResponse } = require('../utils/response')

exports.validateEmail = [
  check('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Provided email is not valid')
  ,
  (req, res, next) => {
    const { errors } = validationResult(req);

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

    next();
  }
]