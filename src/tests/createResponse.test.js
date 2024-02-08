const {
  describe,
  it, 
  expect,
} = require('@jest/globals')

const { createResponse } = require('../utils/response')

describe('Testing creating response', () => {
  it('should create a response object with provided parameters', () => {
    const response = createResponse({ code: 'test', type: 'test', message: 'test' , data: { key: 'test' } });
    
    expect(response).toEqual({
      code: 'test',
      type: 'test',
      message: 'test',
      data: { key: 'test' }
    });
  });

  it('should throw an error if code is not defined', () => {
    expect(() => {
      createResponse({ type: 'test', message: 'test' });
    }).toThrow('Code is not defined');
  });

  it('should throw an error if type is not defined', () => {
    expect(() => {
      createResponse({ code: 'test', message: 'test' });
    }).toThrow('Type is not defined');
  });

  it('should throw an error if message is not defined', () => {
    expect(() => {
      createResponse({ code: 'test', type: 'test' });
    }).toThrow('Message is not defined');
  });

  it('should throw an error if passed no object', () => {
    expect(() => {
      createResponse();
    }).toThrow();
  });
  
  it('should throw an error if passed empty object', () => {
    expect(() => {
      createResponse({});
    }).toThrow();
  });
})