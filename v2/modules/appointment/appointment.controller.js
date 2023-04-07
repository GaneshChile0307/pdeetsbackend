const appointmentService = require('./appointment.service')
const validator = require('../../utils/schemaValidator')
const schema = require('./appointment.schema')
const { DatabaseError } = require('sequelize')

const locations = async (req, res, next) => {
  try {
    const filterBy = await validator.validate(schema.locationSchema, req.body)
    const locationList = await appointmentService.getLocations(filterBy)
    res.status(200).json({
      message: 'Successfully fetched locations',
      data: {
        locations: locationList
      }
    })
  } catch (err) {
    next(err)
  }
}

const departments = async (req, res, next) => {
  try {
    const params = await validator.validate(schema.departmentSchema, req.body)
    const departments = await appointmentService.getDepartments(params)
    res.status(200).json({
      message: 'Successfully fetched departments',
      data: departments
    })
  } catch (err) {
    next(err)
  }
}

const doctors = async (req, res, next) => {
  try {
    const params = await validator.validate(schema.doctorListSchema, req.body)
    const doctors = await appointmentService.getDoctors(params)
    res.status(200).json({
      message: 'Successfully fetched doctors',
      data: {
        doctors
      }
    })
  } catch (err) {
    next(err)
  }
}

const doctorSchedule = async (req, res, next) => {
  try {
    const params = await validator.validate(schema.doctorScheduleSchema, req.body)
    const doctorSchedule = await appointmentService.getDoctorSchedule(params)
    res.status(200).json({
      message: 'Doctor schedule fecthed successfully',
      data: {
        schedule: doctorSchedule
      }
    })
  } catch (err) {
    next(err)
  }
}

const questionnaire = async (req, res, next) => {
  try {
    const questionnaireList = await appointmentService.getQuestionnaire()
    res.status(200).json({
      message: 'Questionnaire fetched successfully',
      data: {
        questionnaire: questionnaireList
      }
    })
  } catch (err) {
    next(err)
  }
}

const bookAppointment = async (req, res, next) => {
  try {
    const params = await validator.validate(schema.appointmentBookingSchema, req.body)
    const bookedAppointment = await appointmentService.bookAppointment(params)
    res.status(200).json({
      message: 'Appointment booked.',
      data: {
        appointment: bookedAppointment
      }
    })
  } catch (err) {
    next(err)
  }
}

const appointmentList = async (req, res, next) => {
  try {
    const patientId = req.patient.id
    const appointmentId = req.query.appointmentId
    const patientAppointmentList = await appointmentService.showAppointments(patientId, appointmentId)
    res.status(200).json({
      message: 'Patient appointment list fetched successful',
      data: {
        appointments: patientAppointmentList
      }
    })
  } catch (err) {
    next(err)
  }
}

const updateAppointment = async (req, res, next) => {
  try {
    if (req.params.id) {
      const params = await validator.validate(schema.updateAppointmentSchema, req.body)
      params.appointmentId = req.params.id
      params.patientId = req.patient.id

      const updatedAppointment = await appointmentService.updateAppointment(params)
      res.status(200).json({
        message: 'Appointment updated',
        data: {
          appointment: updatedAppointment
        }
      })
    } else {
      throw new DatabaseError('Missing appointment id in request url')
    }
  } catch (err) {
    next(err)
  }
}

const addNotes = async (req, res, next) => {
  try {
    const params = await validator.validate(schema.addNotesSchema, req.body)
    params.patientId = req.patient.id
    await appointmentService.addNotes(params)
    res.status(200).json({
      messsage: 'notes added',
      data: {}
    })
  } catch (err) {
    next(err)
  }
}

const deleteAppointment = async (req, res, next) => {
  try {
    const params = await validator.validate(schema.appointmentDeleteSchema, req.body)
    await appointmentService.deleteAppointment(params)
    res.status(200).json({
      message: 'Appointment deleted'
    })
  } catch (err) {
    next(err)
  }
}

const getAppointmentQR = async (req, res, next) => {
  try {
    const appintmentId = req.params.appointmentId
    const patientId = req.patient.id
    if (appintmentId) {
      const qrCode = await appointmentService.generateAppointmentQR(appintmentId, patientId)
      res.status(200).json({
        message: 'QR code generated.',
        data: {
          qrCode
        }
      })
    } else {
      throw new DatabaseError('Invalid appointment id.')
    }
  } catch (err) {
    next(err)
  }
}

const decodeAppointmentQR = async (req, res, next) => {
  try {
    const appointment = await appointmentService.decodeAppointmentQR(req.appointmentId, req.patientId)
    res.status(200).json({
      message: 'Appointment Details',
      data: {
        appointment
      }
    })
  } catch (err) {
    next(err)
  }
}

// module level error handler
const locationModuleErrorHandler = (err, req, res, next) => {
  console.log(err)
  switch (err.name) {
    case 'DbError':
      res.status(400).json({
        error: err.message
      })
      break
    case 'SequelizeDatabaseError':
      res.status(400).json({
        error: err.message
      })
      break
    default:
      next(err)
  }
}

module.exports = {
  appointmentList,
  updateAppointment,
  addNotes,
  deleteAppointment,
  locations,
  departments,
  doctors,
  doctorSchedule,
  questionnaire,
  bookAppointment,
  getAppointmentQR,
  decodeAppointmentQR,
  locationModuleErrorHandler
}
