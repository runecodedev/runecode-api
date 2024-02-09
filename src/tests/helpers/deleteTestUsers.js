

const userModel = require('../../modules/user/user.model')
const ENV = require('../../utils/env')

exports.deleteTestUsers = async () => {
  await userModel.deleteMany({ email: new RegExp(ENV.TEST_USER)})

  const deletedUsers = await userModel.find({ email: new RegExp(ENV.TEST_USER) })

  return deletedUsers
}