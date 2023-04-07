const express = require('express')
const reportController = require('./reports.controller')
const authMiddleware = require('../../middleware/auth')

const router = express.Router()

router.post('/lab', reportController.uploadReport)

router.get('/lab', authMiddleware(), reportController.getReports)

router.put('/lab/:reportId', reportController.updateReport)

router.delete('/lab/:reportId', reportController.deleteReport)

router.use(reportController.reportModuleErrorHandler)

module.exports = router
