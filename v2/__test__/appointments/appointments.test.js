const appointmentService = require('../../modules/appointment/appointment.service')

describe('Appointment endpoint tests', () => {
  let bookedAppointment = null

  test('Is location listing working', async () => {
    const locations = await appointmentService.getLocations({ filterBy: null })
    expect(locations).not.toBe(null)
    expect(locations.length > 0).toBeTruthy()
  })

  test('Is doctor listing working', async () => {
    const locationId = 1
    const doctors = await appointmentService.getDoctors({ locationId, departmentId: null, filterBy: null })
    expect(doctors).not.toBe(null)
    expect(doctors.length > 0).toBeTruthy()
  })

  test('Is doctor availability listing working', async () => {
    const doctorId = 1
    const doctorAvailability = await appointmentService.getDoctorSchedule({ locationId: null, departmentId: null, doctorId })
    bookedAppointment = doctorAvailability[0]
    expect(doctorAvailability).not.toBe(null)
  })

  test('Is doctor questionnaire  listing working', async () => {
    const questionnaire = await appointmentService.getQuestionnaire()
    expect(questionnaire).not.toBe(null)
  })

  test('Is appointment booking working', async () => {
    const appointmentId = bookedAppointment.timeSlotId
    const patientId = 1
    const isPreliminaryCheckup = true
    const appointmentTime = '2022-12-31 09:00:00+00'
    const appointmentDuration = 30
    const questionaryAnswer = "[{'sample': 'json'}]"

    bookedAppointment = await appointmentService.bookAppointment({ appointmentId, locationId: null, departmentId: null, doctorId: null, isPreliminaryCheckup, patientId, appointmentTime, appointmentDuration, questionaryAnswer })
  })

  test('Is appointment listing working', async () => {
    const patientId = 1
    const appointmentList = await appointmentService.showAppointments(patientId)
    expect(appointmentList).not.toBe(null)
    expect(appointmentList.length > 0).toBeTruthy()
  })
})
