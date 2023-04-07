const express = require('express')
const cors = require('cors')
const helmet = require('helmet')

module.exports = (app) => {
  // handles security related config
  app.use(helmet({
    contentSecurityPolicy: false
  }))

  app.use(cors())

  app.use(express.json())

  app.use(express.urlencoded({ extended: true }))

  app.use(express.static('public'))
}
