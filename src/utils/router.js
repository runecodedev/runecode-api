const { Router } = require('express')
const userModuleRoute = require('../modules/user/user.route')

const router = Router()

router.use(userModuleRoute)

exports.initRouter = (app) => app.use('/api', router)