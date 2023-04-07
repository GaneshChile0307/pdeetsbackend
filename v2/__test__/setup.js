// index.test.js file is responsible for setting up test db.
const path = require('path')

// loading .env.test file
require('dotenv').config({ path: path.join(__dirname, '/.env') })
const database = require('./db')

jest.setTimeout(20000)

// checking is NODE_ENV is set to test environment
test('Is node_env set to test environment', () => {
  expect(process.env.NODE_ENV).toBe('test')
})

// checking test db connection
test('Checking test db connection', async () => {
  await database.isConnected()
})

module.exports = {
  database
}
