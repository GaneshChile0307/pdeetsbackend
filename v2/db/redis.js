
const redis = require('redis')

const client = redis.createClient({
  socket: {
    host: `${process.env.REDIS_HOST}`,
    port: `${process.env.REDIS_PORT}`
  },
  password: `${process.env.REDIS_PASSWORD}`
})

;(async () => {
  await client.connect()
})()

client.on('ready', () => {
  console.log('Connected to redis...')
})

client.on('error', err => {
  console.log('Error ' + err)
})

module.exports = client
