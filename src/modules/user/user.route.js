const { Router } = require('express')
const { 
  registerUser, 
} = require('./user.controller')


const userRoute = Router()

userRoute.post('/registerUser', registerUser)

module.exports = userRoute