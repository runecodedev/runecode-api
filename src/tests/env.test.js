const {
  describe,
  it, 
  expect,
} = require('@jest/globals')

const ENV = require('../utils/env')

describe('Testing environment', () => {
  it('should have every environment variable set', () => {
    Object.keys(ENV).every((key) => {
      expect(!!ENV[key]).toBe(true)
    })
  })
})