const express = require('express')
const appointmentController = require('./appointment.controller')
const authMiddleware = require('../../middleware/auth')
const externalAuthMiddleware = require('../../middleware/externalAuth')

const router = express.Router()

router.get('/', authMiddleware(), appointmentController.appointmentList)

router.put('/:id', authMiddleware(), appointmentController.updateAppointment)

router.post('/deleteAppointment', authMiddleware(), appointmentController.deleteAppointment)

router.post('/locations', authMiddleware(), appointmentController.locations)

router.post('/departments', authMiddleware(), appointmentController.departments)

router.post('/doctors', authMiddleware(), appointmentController.doctors)

router.post('/doctor/availability', authMiddleware(), appointmentController.doctorSchedule)

router.post('/questionnaire', authMiddleware(), appointmentController.questionnaire)

router.post('/notes', authMiddleware(), appointmentController.addNotes)

router.post('/qr/:appointmentId', authMiddleware(), appointmentController.getAppointmentQR)

router.post('/qr', externalAuthMiddleware(), appointmentController.decodeAppointmentQR)

router.post('/', authMiddleware(), appointmentController.bookAppointment)

router.use(appointmentController.locationModuleErrorHandler)

module.exports = router
