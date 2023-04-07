const { db } = require('../setup').database
const appointmentService = require('../../modules/appointment/appointment.service')

describe('Appointment endpoint tests', () => {
  let locationsList = null
  let departmentList = null
  let doctortList = null
  let bookedAppointment = null

  beforeAll(async () => {

  })

  test('Is location listing working', async () => {
    const locations = await appointmentService.getLocations({ filterBy: null })
    locationsList = locations
    expect(locations).not.toBe(null)
    expect(locations.length > 0).toBeTruthy()
  })

  test('Is department listing working', async () => {
    const locationId = locationsList[0].id
    const departments = await appointmentService.getDepartments({ locationId, filterBy: null })
    departmentList = departments.departments
    expect(departments).not.toBe(null)
    expect(departments.departments.length > 0).toBeTruthy()
  })

  test('Is doctor listing working', async () => {
    const locationId = locationsList[0].id
    const departmentId = departmentList[0].id
    const doctors = await appointmentService.getDoctors({ locationId, departmentId, filterBy: null })
    doctortList = doctors
    expect(doctors).not.toBe(null)
    expect(doctors.length > 0).toBeTruthy()
  })

  test('Is doctor availability listing working', async () => {
    const locationId = locationsList[0].id
    const departmentId = departmentList[0].id
    const doctorId = doctortList[0].doctor_id
    const doctorAvailability = await appointmentService.getDoctorSchedule({ locationId, departmentId, doctorId })
    expect(doctorAvailability).not.toBe(null)
  })

  test('Is doctor questionnaire  listing working', async () => {
    const questionnaire = await appointmentService.getQuestionnaire()
    expect(questionnaire).not.toBe(null)
  })

  test('Is appointment booking working', async () => {
    const locationId = locationsList[0].id
    const departmentId = departmentList[0].id
    const doctorId = doctortList[0].doctor_id
    const patientId = 'a7dc8fad-52d9-4a40-9982-7afa97a0f39b'
    const appointmentTime = '2022-12-31 09:00:00+00'
    const appointmentDuration = 30
    const questionaryAnswer = "[{'sample': 'json'}]"

    bookedAppointment = await appointmentService.bookAppointment({ locationId, departmentId, doctorId, patientId, appointmentTime, appointmentDuration, questionaryAnswer })
    expect(bookedAppointment).not.toBe(null)
  })

  test('Is appointment listing working', async () => {
    const patientId = 'a7dc8fad-52d9-4a40-9982-7afa97a0f39b'

    const appointmentList = await appointmentService.showAppointments(patientId)
    expect(appointmentList).not.toBe(null)
    expect(appointmentList.length > 0).toBeTruthy()
  })

  afterAll(async () => {
    await db.appointment.destroy({
      where: {
        id: bookedAppointment.id
      }
    })
  })
})

describe('Appointment QR code tests', () => {
  let bookedAppointment = null

  beforeAll(async () => {
    const locationId = '5f2d8da4-2e96-4800-8e4b-17a8e283c319'
    const departmentId = 'e0c02666-69fd-4c05-b444-1bb8ac481539'
    const doctorId = '4953d960-963f-41e1-a905-f41b026f8760'
    const patientId = 'a7dc8fad-52d9-4a40-9982-7afa97a0f39b'
    const appointmentTime = '2022-12-31 09:00:00+00'
    const appointmentDuration = 30
    const questionaryAnswer = "[{'sample': 'json'}]"

    bookedAppointment = await appointmentService.bookAppointment({ locationId, departmentId, doctorId, patientId, appointmentTime, appointmentDuration, questionaryAnswer })
  })

  test('Is QR code token generated', async () => {
    const qrCode = await appointmentService.generateAppointmentQR(bookedAppointment.id)
    expect(qrCode).not.toBe(null)
    expect(typeof qrCode.token).toBe('string')
  })

  test('Is QR code token decode working', async () => {
    const appointment = await appointmentService.decodeAppointmentQR({ appointmentId: bookedAppointment.id, status: 'done' })
    expect(appointment).not.toBe(null)
    expect(appointment.status === 'done').toBeTruthy()
  })

  afterAll(async () => {
    await db.appointment.destroy({
      where: {
        id: bookedAppointment.id
      }
    })
  })
})
