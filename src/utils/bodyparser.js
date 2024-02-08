const options = {

}

const bodyParser = require('body-parser').json(options)

exports.initBodyParser = (app) => app.use(bodyParser)