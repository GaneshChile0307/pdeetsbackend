// model imports
const { db, sequelize } = require('../../db')

// lib imports
const { Op, QueryTypes } = require('sequelize')

// helpers imports
const luxon = require('luxon')
const tokenHelper = require('../../utils/token')
const axios = require('axios')
const { sendPushNotification } = require('../push-notification/push-notification.service')
// custom errors
const {
  DatabaseError,
  UnknownServerError
} = require('../../utils/customErrors')

const showAppointments = async (patientId, appointmentId) => {
  try {
    const appointmentRequest = await axios.get(process.env.KIELSTEIN_API + `/patients/${patientId}/appointments`)
    let appointmentList = appointmentRequest.data
    const internalAppointmentList = await db.appointment.findAll({
      attributes: ['id', 'appointment_type', 'appointment_time', 'appointment_duration', 'questionary_answers', 'status', 'meeting_url', 'appointment_notes', 'prescription_image_url'],
      where: {
        patient_id: patientId
      },
      include: [{
        model: db.location
      }, {
        model: db.department
      }, {
        model: db.doctor
      }, {
        model: db.patient,
        attributes: ['id', 'first_name', 'last_name', 'email', 'phone_number', 'gender', 'date_of_birth', 'last_login', 'image_url']
      }]
    })

    if (appointmentList.length > 0) {
      if (appointmentId == null) {
        appointmentList = appointmentList.map((appointment) => {
          const iappointment = internalAppointmentList.filter((iappointment) => {
            return parseInt(iappointment.id) === parseInt(appointment.appointmentId)
          })
          return iappointment[0]
        })
      } else {
        appointmentList = appointmentList.map((appointment) => {
          const iappointment = internalAppointmentList.filter((iappointment) => {
            return parseInt(iappointment.id) === parseInt(appointment.appointmentId)
          })

          if (iappointment.length > 0) {
            if (parseInt(iappointment[0].id) === parseInt(appointmentId)) { return iappointment[0] } else { return null }
          } else {
            return null
          }
        })
      }
    }

    appointmentList = appointmentList.filter((appointment) => appointment != null)

    return appointmentList
  } catch (err) {
    if (!err.name === 'InvalidUser') {
      throw new UnknownServerError()
    } else {
      throw err
    }
  }
}

const sendAppointmentReminder = async () => {
  try {
    const query = `SELECT appointments.id as appointment_id, patients.first_name, patients.last_name, device_tokens.device_token FROM appointments
    LEFT JOIN patients ON patients.id = appointments.patient_id
    LEFT JOIN device_tokens ON device_tokens.patient_id = patients.id
    WHERE appointment_time >= '${luxon.DateTime.now().startOf('day').toString()}' AND appointment_time <= '${luxon.DateTime.now().endOf('day').toString()}';`

    const appointments = await sequelize.query(query, { type: QueryTypes.SELECT })

    await Promise.all(appointments.map(async (appointment) => {
      await sendPushNotification('Appointment reminder', `Hello ${appointment.first_name}, you have an appointment today.`, appointment.device_token, {
        appointmentId: appointment.appointment_id
      })
    }))
    console.log('Appointment reminder cron ran...')
  } catch (err) {
    console.log(err)
  }
}

const generateAppointmentQR = async (appointmentId, patientId) => {
  const appointments = await showAppointments(patientId)
  let isValidAppointment = false
  await Promise.all(appointments.map(async (appointment) => {
    if (parseInt(appointment.appointmentId) === parseInt(appointmentId)) {
      isValidAppointment = true
    }
  }))

  if (isValidAppointment) {
    const token = await tokenHelper.generateAppointmentQrToken({
      appointmentId,
      patientId
    })
    return {
      token
    }
  } else {
    throw new DatabaseError('Invalid appointment id.')
  }
}

const getLocations = async ({ filterBy }) => {
  try {
    const locationRequest = await axios.get(process.env.KIELSTEIN_API + '/locations')
    let locations = locationRequest.data

    const internalLocations = await db.location.findAll({ attributes: { exclude: ['createdAt', 'updatedAt'] } })
    locations = locations.map((location) => {
      const iLocation = internalLocations.filter((internalLocation) => {
        return parseInt(internalLocation.id) === parseInt(location.locationId)
      })
      return iLocation[0]
    })
    return locations
  } catch (err) {
    throw new DatabaseError(err.message)
  }
}

const getDepartments = async ({ locationId, filterBy }) => {
  try {
    let locations = []

    if (filterBy) {
      locations = await db.location.findAll({
        attributes: [],
        where: { id: locationId },
        include: [{
          model: db.department,
          attributes: ['id', 'name', 'description', 'image_url'],
          where: {
            [Op.or]: [{
              name: {
                [Op.iLike]: `%${filterBy}%`
              }
            },
            {
              description: {
                [Op.iLike]: `%${filterBy}%`
              }
            }]
          },
          through: {
            attributes: []
          }
        }]
      })
    } else {
      locations = await db.location.findAll({
        attributes: [],
        where: { id: locationId },
        include: [{
          model: db.department,
          attributes: ['id', 'name', 'description', 'image_url'],
          through: {
            attributes: []
          }
        }]
      })
    }

    return locations[0] ? locations[0] : { departments: [] }
  } catch (err) {
    throw new DatabaseError(err.message)
  }
}

const getDoctors = async ({ locationId, departmentId, filterBy }) => {
  try {
    const doctorsRequest = await axios.get(process.env.KIELSTEIN_API + `/doctors?locationId=${locationId}`)
    let doctorsList = doctorsRequest.data
    const internalDoctors = await db.doctor.findAll({ attributes: { exclude: ['createdAt', 'updatedAt'] } })
    doctorsList = doctorsList.map((doctor) => {
      const idoctor = internalDoctors.filter((idoctor) => {
        return parseInt(idoctor.id) === parseInt(doctor.doctorId)
      })
      return idoctor[0]
    })
    return doctorsList
  } catch (err) {
    throw new DatabaseError(err.message)
  }
}

const getDoctorSchedule = async ({ locationId, departmentId, doctorId }) => {
  try {
    const doctorSchedulRequest = await axios.get(process.env.KIELSTEIN_API + `/appointments?doctorId=${doctorId}`)
    return doctorSchedulRequest.data
  } catch (err) {
    throw new DatabaseError(err.message)
  }
}

const getDoctorUnavailableSlots = async ({ locationId, departmentId, doctorId }) => {
  try {
    const bookedAppointments = await db.appointment.findAll({
      where: {
        location_id: locationId,
        department_id: departmentId,
        doctor_id: doctorId
      },
      raw: true
    })

    const unavailableSlots = []
    bookedAppointments.forEach((appointment) => {
      unavailableSlots.push({
        date: new Date(appointment.appointment_time).toISOString().split('T')[0],
        time: new Date(appointment.appointment_time).toLocaleTimeString('en-GB'),
        duration: appointment.appointment_duration
      })
    })

    return unavailableSlots
  } catch (err) {
    throw new DatabaseError(err.message)
  }
}

const getQuestionnaire = async () => {
  try {
    const questionList = await db.question.findAll({
      attributes: ['question'],
      include: [{
        model: db.question_option,
        attributes: ['option']
      }]
    })
    return questionList
  } catch (err) {
    throw new DatabaseError(err.message)
  }
}

const bookAppointment = async ({ appointmentId, appointmentType, locationId, departmentId, doctorId, patientId, isPreliminaryCheckup, meetingUrl, appointmentNotes, appointmentTime, appointmentDuration = 30, questionaryAnswer, status = 'pending' }) => {
  try {
    // adding to kielstein db
    await axios.post(process.env.KIELSTEIN_API + '/addappointment', {
      appointmentId,
      patientId,
      isPreliminaryCheckup
    })
    // adding to local db
    const bookedAppointment = await db.appointment.create({
      id: appointmentId,
      appointment_type: appointmentType,
      location_id: locationId,
      department_id: departmentId,
      doctor_id: doctorId,
      patient_id: patientId,
      meeting_url: meetingUrl,
      appointment_time: appointmentTime,
      appointment_notes: appointmentNotes,
      status
    })
    return bookedAppointment
  } catch (err) {
    if (err instanceof axios.AxiosError) {
      throw new DatabaseError('Appointment not available')
    }
    throw new DatabaseError(err.message)
  }
}

const updateAppointment = async ({ appointmentId, patientId, ...updatedAppointmentdata }) => {
  const updatedAppointment = await db.appointment.update({
    location_id: updatedAppointmentdata.locationId,
    department_id: updatedAppointmentdata.departmentId,
    doctor_id: updatedAppointmentdata.doctorId,
    appointment_time: updatedAppointmentdata.appointmentTime,
    appointment_duration: updatedAppointmentdata.appointmentDuration,
    questionary_answers: updatedAppointmentdata.questionaryAnswers,
    status: updatedAppointmentdata.status
  }, {
    where: { id: appointmentId, patient_id: patientId },
    returning: true,
    raw: true
  })

  if (updatedAppointment.length > 0 && updatedAppointment[1]) {
    return updatedAppointment[1][0]
  } else {
    throw new DatabaseError('No appointment found with the provided id or no updated were supplied.')
  }
}

const addNotes = async ({ appointmentId, text, patientId }) => {
  await db.appointment.update({
    appointment_notes: text
  }, {
    where: { id: appointmentId, patient_id: patientId }
  })
}

const deleteAppointment = async ({ appointmentId, patientId }) => {
  try {
    // deleting from kielstein db
    const appointmentBookingRequest = await axios.post(process.env.KIELSTEIN_API + '/deleteappointment', {
      appointmentId,
      patientId
    })

    // deleting from local db
    if (appointmentBookingRequest.status === 200) {
      await db.appointment.destroy({
        where: {
          id: appointmentId,
          patient_id: patientId
        }
      })
    } else {
      throw new DatabaseError('Appointment does not exist.')
    }

    return appointmentBookingRequest.data
  } catch (err) {
    if (err instanceof axios.AxiosError) {
      throw new DatabaseError('Appointment does not exist.')
    } else {
      throw err
    }
  }
}

const decodeAppointmentQR = async (appointmentId, patientId) => {
  const appointments = await showAppointments(patientId)
  let decodedAppointment = null

  appointments.forEach((appointment) => {
    if (parseInt(appointment.appointmentId) === parseInt(appointmentId)) {
      decodedAppointment = appointment
    }
  })

  if (!decodedAppointment) { throw new DatabaseError('Invalid Qr code data') }

  return decodedAppointment
}

module.exports = {
  showAppointments,
  sendAppointmentReminder,
  generateAppointmentQR,
  decodeAppointmentQR,
  updateAppointment,
  addNotes,
  deleteAppointment,
  getLocations,
  getDepartments,
  getDoctors,
  getDoctorSchedule,
  getQuestionnaire,
  bookAppointment
}
