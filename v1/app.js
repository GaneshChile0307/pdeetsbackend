const express = require('express')

const middleware = require('./middleware')
const routes = require('./routes')
const crons = require('./crons')
const docs = require('./docs')

const app = express()

crons()

middleware(app)

docs(app)

routes(app)

module.exports = app
