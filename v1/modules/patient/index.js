const express = require('express')
const patientController = require('./patient.controller')
const authMiddleware = require('../../middleware/auth')

const router = express.Router()

router.post('/register', patientController.registerPatient)

router.post('/login', patientController.patientLogin)

router.post('/password', authMiddleware(), patientController.patientPasswordActionHandler)

router.post('/token/refresh', patientController.refreshTokens)

router.post('/token/password_reset', patientController.passwordResetToken)

router.post('/test_route', authMiddleware(), (req, res, next) => { res.send('hit') })

router.use(patientController.patientErrorHandler)

module.exports = router
