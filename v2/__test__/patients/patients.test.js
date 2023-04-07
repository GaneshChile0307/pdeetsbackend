const { db } = require('../setup').database
const patientService = require('../../modules/patient/patient.service')
const { InvalidUser } = require('../../utils/customErrors')

describe('Registration', () => {
  let patient = null
  let newlyAddedPatient = null

  beforeAll(async () => {
    patient = {
      firstName: 'test',
      lastName: 'user',
      email: 'test@user.com',
      phoneNumber: '+495262523254',
      gender: 'male',
      dateOfBirth: '1994-11-05 13:15:30+00',
      password: 'test'
    }
  })

  afterAll(async () => {
    await db.patient.destroy({
      where: {
        id: newlyAddedPatient.id
      }
    })
  })

  test('Is registration successful', async () => {
    newlyAddedPatient = await patientService.addPatient(patient)

    expect(newlyAddedPatient).toMatchObject({
      id: expect.any(Number)
    })
  })
})

describe('Login', () => {
  let patient = null
  let newlyAddedPatient = null

  beforeAll(async () => {
    patient = {
      firstName: 'test',
      lastName: 'user',
      email: 'test@user.com',
      phoneNumber: '+491245226985',
      gender: 'male',
      dateOfBirth: '1994-11-05 13:15:30+00',
      password: 'test'
    }
  })

  afterAll(async () => {
    await db.patient.destroy({
      where: {
        id: newlyAddedPatient.id
      }
    })
  })

  test('Is login successful', async () => {
    newlyAddedPatient = await patientService.addPatient(patient)
    const loginResponse = await patientService.validatePatientLogin({
      email: null,
      phoneNumber: newlyAddedPatient.phone_number,
      password: patient.password
    })

    expect(loginResponse).toMatchObject({
      tokens: {
        accessToken: expect.any(String),
        refreshToken: expect.any(String)
      },
      foundPatient: expect.any(Object)
    })
  })
})

describe('Change password', () => {
  let patient = null
  let newlyAddedPatient = null

  beforeAll(async () => {
    patient = {
      firstName: 'test',
      lastName: 'user',
      email: 'test@user.com',
      phoneNumber: '+491245226985',
      gender: 'male',
      dateOfBirth: '1994-11-05 13:15:30+00',
      password: 'test'
    }
  })

  afterAll(async () => {
    await db.patient.destroy({
      where: {
        id: newlyAddedPatient.id
      }
    })
  })

  test('Is password change successful', async () => {
    newlyAddedPatient = await patientService.addPatient(patient)
    const response = await patientService.performPasswordAction({
      action: 'change_password',
      email: newlyAddedPatient.email,
      oldPassword: 'test',
      newPassword: 'test1'
    })

    expect(typeof response).toBe('string')
    // login with new password
    const loginResponse = await patientService.validatePatientLogin({
      email: null,
      phoneNumber: newlyAddedPatient.phone_number,
      password: 'test1'
    })

    expect(loginResponse).toMatchObject({
      tokens: {
        accessToken: expect.any(String),
        refreshToken: expect.any(String)
      },
      foundPatient: expect.any(Object)
    })
    // checking old password
    ;(async () => {
      await expect(async () => {
        await patientService.validatePatientLogin({
          email: null,
          phoneNumber: newlyAddedPatient.phone_number,
          password: 'test'
        })
      }).rejects.toThrow(InvalidUser)
    })()
  })
})

// describe('Is password reset token issued', () => {
//   let patient = null
//   let newlyAddedPatient = null

//   beforeAll(async () => {
//     patient = {
//       firstName: 'test',
//       lastName: 'user',
//       email: 'shiven1703@gmail.com',
//       phoneNumber: '+491245226985',
//       gender: 'male',
//       dateOfBirth: '1994-11-05 13:15:30+00',
//       password: 'test'
//     }
//   })

//   afterAll(async () => {
//     await db.patient.destroy({
//       where: {
//         id: newlyAddedPatient.id
//       }
//     })
//   })

//   test('Is password change successful', async () => {
//     newlyAddedPatient = await patientService.addPatient(patient)
//     const response = await patientService.performPasswordAction({
//       action: 'get_password_reset_token',
//       email: newlyAddedPatient.email
//     })

//     expect(typeof response).toBe('string')
//   })
// })

describe('Reset password', () => {
  let patient = null
  let newlyAddedPatient = null

  beforeAll(async () => {
    patient = {
      firstName: 'test',
      lastName: 'user',
      email: 'test@user.com',
      phoneNumber: '+491247226985',
      gender: 'male',
      dateOfBirth: '1994-11-05 13:15:30+00',
      password: 'test'
    }
  })

  afterAll(async () => {
    await db.patient.destroy({
      where: {
        id: newlyAddedPatient.id
      }
    })
  })

  test('Is password change successful', async () => {
    newlyAddedPatient = await patientService.addPatient(patient)
    const response = await patientService.performPasswordAction({
      action: 'reset_password',
      email: newlyAddedPatient.email,
      suppliedValidationCode: '1234',
      actualValidationCode: '1234',
      newPassword: 'test1'
    })

    expect(typeof response).toBe('string')
    // login with new password
    const loginResponse = await patientService.validatePatientLogin({
      email: null,
      phoneNumber: newlyAddedPatient.phone_number,
      password: 'test1'
    })

    expect(loginResponse).toMatchObject({
      tokens: {
        accessToken: expect.any(String),
        refreshToken: expect.any(String)
      },
      foundPatient: expect.any(Object)
    })
    // checking old password
    ;(async () => {
      await expect(async () => {
        await patientService.validatePatientLogin({
          email: null,
          phoneNumber: newlyAddedPatient.phone_number,
          password: 'test'
        })
      }).rejects.toThrow(InvalidUser)
    })()
  })
})
