const { parsed, error } = require('dotenv').config()

if(error){
  console.log('File ".env" not found, please create it from ".env.template" example and adjust variables');
  process.exit(0)
}

if (!Object.keys(parsed).every((key) => !!parsed[key])) {
  console.log('Not every environment variable has a value, please adjust them in ".env" file');
  process.exit(0)
}

module.exports = parsed