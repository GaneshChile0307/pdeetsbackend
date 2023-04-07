const express = require('express')
const newsController = require('./news.controller')
const authMiddleware = require('../../middleware/auth')

const router = express.Router()

router.get('/', authMiddleware(), newsController.getNews)

router.use(newsController.newsModuleErrorHandler)

module.exports = router
