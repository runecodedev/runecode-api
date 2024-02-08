const options = {

}

const cors = require('cors')(options)

exports.initCors = (app) => app.use(cors)