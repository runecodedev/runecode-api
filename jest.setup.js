const { deleteTestUsers } = require('./src/tests/helpers/deleteTestUsers')

afterAll(async () => {
  const deletedUsers = await deleteTestUsers()

  expect(deletedUsers).toHaveLength(0)
});