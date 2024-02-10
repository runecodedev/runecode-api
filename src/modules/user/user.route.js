const { Router } = require('express')
const { registerUser, loginUser, authorizeUser } = require('./user.controller')
const { registerValidation } = require('../../middleware/registerValidation')
const { loginValidation } = require('../../middleware/loginValidation')
const jwtAuth = require('../../middleware/jwtAuth')


const userRoute = Router()

userRoute.post('/registerUser', registerValidation, registerUser)
userRoute.post('/loginUser', loginValidation, loginUser)
userRoute.get('/authorizeUser', jwtAuth, authorizeUser)

module.exports = userRoute