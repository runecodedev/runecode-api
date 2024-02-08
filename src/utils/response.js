exports.createResponse = ({code, type, message, data = {}}) => {
  if(!code) throw new Error('Code is not defined')
  if(!type) throw new Error('Type is not defined')
  if(!message) throw new Error('Message is not defined')

  return {
    code,
    type,
    message,
    data
  }
}