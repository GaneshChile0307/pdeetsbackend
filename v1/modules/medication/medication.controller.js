const medicationService = require('./medication.service')
const validator = require('../../utils/schemaValidator')
const schema = require('./medication.schema')
const { InvalidPayload } = require('../../utils/customErrors')

const addReminder = async (req, res, next) => {
  try {
    const params = await validator.validate(schema.addMedicationReminderSchema, req.body)
    params.patientId = req.patient.id
    const addedReminders = await medicationService.addMedicationReminder(params)
    res.status(200).json({
      message: 'Reminder added',
      data: {
        reminders: addedReminders
      }
    })
  } catch (err) {
    next(err)
  }
}

const getReminders = async (req, res, next) => {
  try {
    const reminders = await medicationService.getReminders({
      patientId: req.patient.id,
      filterBy: req.query.filterBy
    })
    res.status(200).json({
      message: 'Reminder listing',
      data: {
        reminders
      }
    })
  } catch (err) {
    next(err)
  }
}

const updateReminder = async (req, res, next) => {
  try {
    if (req.params.reminderId) {
      const params = await validator.validate(schema.updateMedicationReminderSchema, req.body)
      params.reminderId = req.params.reminderId
      params.patientId = req.patient.id

      const updatedReminder = await medicationService.updateMedicationReminder(params)
      res.status(200).json({
        message: 'Reminder updated',
        data: {
          reminder: updatedReminder
        }
      })
    } else {
      next(new InvalidPayload('Missing reminder id'))
    }
  } catch (err) {
    next(err)
  }
}

const deleteReminder = async (req, res, next) => {
  try {
    if (req.params.reminderId) {
      await medicationService.deleteMedicationReminder(req.params.reminderId, req.patient.id)
      res.status(200).json({
        message: 'Reminder deleted.',
        data: {}
      })
    } else {
      next(new InvalidPayload('Missing reminder id'))
    }
  } catch (err) {
    next(err)
  }
}

// module level error handler
const medicationModuleErrorHandler = (err, req, res, next) => {
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
  addReminder,
  getReminders,
  updateReminder,
  deleteReminder,
  medicationModuleErrorHandler
}
