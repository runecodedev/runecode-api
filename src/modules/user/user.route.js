const { Router } = require('express')
const { registerUser } = require('./user.controller')
const { validatePasswordForRegistration } = require('../../middleware/validatePassword')
const { validateEmail } = require('../../middleware/validateEmail')
const { validateUser } = require('../../middleware/validateUser')


const userRoute = Router()

userRoute.post('/registerUser', validateEmail, validatePasswordForRegistration, validateUser, registerUser)

module.exports = userRoute