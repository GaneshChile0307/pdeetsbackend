
const path = require('path')
const { getRandomReview } = require('./review')
const encrypter = require('../../utils/encryption')

const importPatients = async (sequelize, modelList) => {
  try {
    // importing patients
    const patientsImportFile = path.join(__dirname, '/patients.js')
    const patient = require(patientsImportFile)

    patient.password = await encrypter.makeHash(patient.password)
    await modelList.patient.create(patient)
    console.log('Imported default patient...')
  } catch (err) {
    console.log(err)
  }
}

const importDepartments = async (sequelize, modelList) => {
  try {
    // importing departments
    const departmentsImportFile = path.join(__dirname, '/departments.js')
    const departmentList = require(departmentsImportFile)

    await modelList.department.bulkCreate(departmentList)
    console.log('Imported departments...')
  } catch (err) {
    console.log(err)
  }
}

const importLocations = async (sequelize, modelList) => {
  try {
    // importing locations
    const locationsImportFile = path.join(__dirname, '/locations.js')
    const locationList = require(locationsImportFile)

    await modelList.location.bulkCreate(locationList)
    console.log('Imported locations...')
  } catch (err) {
    console.log(err)
  }
}

const importDoctors = async (sequelize, modelList) => {
  try {
    // importing doctors
    const doctorsImportFile = path.join(__dirname, '/doctors.js')
    const doctorList = require(doctorsImportFile)

    await modelList.doctor.bulkCreate(doctorList)
    console.log('Imported doctors...')
  } catch (err) {
    console.log(err)
  }
}

const importLocationHasDepartments = async (sequelize, modelList) => {
  try {
    // Filling up location_has_departments
    const locations = await modelList.location.findAll()
    const departments = await modelList.department.findAll()

    // location_has_departments
    await Promise.all(locations.map(async (location) => {
      await Promise.all(departments.map(async (department) => {
        await modelList.location_has_department.create({
          location_id: location.id,
          department_id: department.id
        })
      }))
    }))
    console.log('location_has_department imported...')
  } catch (err) {
    console.log(err)
  }
}

const importDepartmentHasDoctor = async (sequelize, modelList) => {
  try {
    // department_has_doctor
    const doctors = await modelList.doctor.findAll()
    const locationDepartment = await modelList.location_has_department.findAll()

    await Promise.all(locationDepartment.map(async (locationDepartment) => {
      await Promise.all(doctors.map(async (doctor) => {
        try {
          await modelList.department_has_doctor.create({
            location_department_id: locationDepartment.location_department_id,
            doctor_id: doctor.id
          })
        } catch (err) {
          console.log(err)
        }
      }))
    }))
    console.log('department_has_doctor imported...')
  } catch (err) {
    console.log(err)
  }
}

const importDoctorSchedule = async (sequelize, modelList) => {
  try {
    const doctors = await modelList.doctor.findAll()
    await Promise.all(doctors.map(async (doctor) => {
      await modelList.doctor_schedule.create({
        doctor_id: doctor.id,
        start_time: '09:00:00',
        end_time: '17:00:00',
        appointment_duration: 30
      })
    }))
    console.log('Doctor schedule imported...')
  } catch (err) {
    console.log(err)
  }
}

const importQuestionnaire = async (sequelize, modelList) => {
  try {
    const questionsImportFile = path.join(__dirname, '/questionnaire.js')
    const questionList = require(questionsImportFile)

    await Promise.all(questionList.map(async (question) => {
      // adding question
      const createdQuestion = await modelList.question.create({
        question: question.text
      })

      // adding options
      await Promise.all(question.options.map(async (option) => {
        await modelList.question_option.create({
          question_id: createdQuestion.id,
          option
        })
      }))
    }))
    console.log('imported questions and related options....')
  } catch (err) {
    console.log(err)
  }
}

const randomBoolean = () => {
  return Math.random() >= 0.5
}

const importDoctorReviews = async (sequelize, modelList) => {
  try {
    const doctors = await modelList.doctor.findAll()
    const patients = await modelList.patient.findAll({ limit: 5 })

    await Promise.all(patients.map(async (patient) => {
      await Promise.all(doctors.map(async (doctor) => {
        const isAllowed = randomBoolean()
        if (isAllowed) {
          const randomReview = await getRandomReview()
          await modelList.review.create({
            patient_id: patient.id,
            doctor_id: doctor.id,
            number_of_stars: randomReview.reviewStars,
            review_text: randomReview.reviewText
          })
        }
      }))
    }))
    console.log('imported doctor reviews...')
  } catch (err) {
    console.log(err)
  }
}

const importCallbackReasons = async (sequelize, modelList) => {
  try {
    const reasonsImportFile = path.join(__dirname, '/callback_reasons.js')
    const reasonsList = require(reasonsImportFile)

    await modelList.callback_reason.bulkCreate(reasonsList)
    console.log('imported callback reasons...')
  } catch (err) {
    console.log(err)
  }
}

const truncateAllDefaultDataTables = async (sequelize, modelList) => {
  try {
    await modelList.patient.destroy({ truncate: true, cascade: true })
    console.log('patients table truncated...')
    await modelList.department.destroy({ truncate: true, cascade: true })
    console.log('departments table truncated...')
    await modelList.location.destroy({ truncate: true, cascade: true })
    console.log('locations table truncated...')
    await modelList.doctor.destroy({ truncate: true, cascade: true })
    console.log('doctors table truncated...')
    await modelList.location_has_department.destroy({ truncate: true, cascade: true })
    console.log('location_has_department table truncated...')
    await modelList.department_has_doctor.destroy({ truncate: true, cascade: true })
    console.log('department_has_doctor table truncated...')
    await modelList.doctor_schedule.destroy({ truncate: true, cascade: true })
    console.log('doctor_schedules table truncated...')
    await modelList.question.destroy({ truncate: true, cascade: true })
    console.log('question table truncated...')
    await modelList.question_option.destroy({ truncate: true, cascade: true })
    console.log('question_option table truncated...')
    await modelList.review.destroy({ truncate: true, cascade: true })
    console.log('reviews table truncated...')
    await modelList.callback_reason.destroy({ truncate: true, cascade: true })
    console.log('callback reason table truncated...')
  } catch (err) {
    console.log(err)
  }
}

module.exports = async (sequelize, modelList) => {
  await importPatients(sequelize, modelList)
  await importDepartments(sequelize, modelList)
  await importLocations(sequelize, modelList)
  await importDoctors(sequelize, modelList)
  await importLocationHasDepartments(sequelize, modelList)
  await importDepartmentHasDoctor(sequelize, modelList)
  await importDoctorSchedule(sequelize, modelList)
  await importQuestionnaire(sequelize, modelList)
  await importDoctorReviews(sequelize, modelList)
  await importCallbackReasons(sequelize, modelList)

  // uncomment below function to remove all default data from above tables
  // await truncateAllDefaultDataTables(sequelize, modelList)

  // waiting for 5 sec (for async db calls)
  console.log('Wait....cleaning up...')
  setTimeout(() => {
    console.log('Default data imported successfully...')
  }, 5000)
}
