// model imports
const { DateTime } = require('luxon')
const { db } = require('../../db')

// lib imports
const { Op } = require('sequelize')
const luxon = require('luxon')
const { sendPushNotification } = require('../push-notification/push-notification.service')

// helpers imports
// custom errors
const redis = require('../../db/redis')
const {
  DatabaseError,
  UnknownServerError
} = require('../../utils/customErrors')

const addMedicationReminder = async ({ patientId, medicineName, dosageQty, dosageUnit = null, dosageInterval, dosageIntervalUnit, medicationTime, reminderTime, reminderTimeUnit, startDate, specialRemarks = null }) => {
  try {
    const reminders = await Promise.all(medicineName.map(async (medicine) => {
      return db.medication_reminder.create({
        patient_id: patientId,
        medicine_name: medicine,
        dosage_qty: dosageQty,
        dosage_unit: dosageUnit,
        dosage_interval: dosageInterval,
        dosage_interval_unit: dosageIntervalUnit,
        medication_time: medicationTime,
        reminder_time: reminderTime,
        reminder_unit: reminderTimeUnit,
        start_date: startDate,
        end_date: getEndDate(startDate, reminderTimeUnit, reminderTime),
        special_remarks: specialRemarks
      })
    }))
    await loadMedicationRemindersForTheDay()
    return reminders
  } catch (err) {
    console.log(err)
    throw new UnknownServerError(err.message)
  }
}

const getEndDate = (startDate, reminderTimeUnit, reminderTime) => {
  if (startDate && reminderTimeUnit && reminderTime) {
    const plusObj = {}
    if (reminderTimeUnit === 'day') {
      plusObj.days = reminderTime
    } else if (reminderTimeUnit === 'week') {
      plusObj.weeks = reminderTime
    } else if (reminderTimeUnit === 'month') {
      plusObj.months = reminderTime
    }
    return DateTime.fromISO(startDate).plus(plusObj).endOf('day')
  } else {
    return undefined
  }
}

const loadMedicationRemindersForTheDay = async () => {
  try {
    const reminders = await db.medication_reminder.findAll({
      where: {
        start_date: {
          [Op.lte]: luxon.DateTime.now().endOf('day').toString()
        },
        end_date: {
          [Op.gte]: luxon.DateTime.now().endOf('day').toString()
        }
      },
      raw: true
    })

    console.log(reminders)
    // clearning entries
    await redis.flushDb()

    // populating cache
    for (const reminder of reminders) {
      for (const medication of reminder.medication_time) {
        let data = await redis.get(medication.time)
        if (data) {
          data = JSON.parse(data)
          if (data.records[reminder.patient_id] && data.records[reminder.patient_id].reminders) {
            data.records[reminder.patient_id].reminders.push(reminder)
            await redis.set(medication.time, JSON.stringify(data))
          } else {
            data.records[reminder.patient_id] = {}
            data.records[reminder.patient_id].devices = await db.device_token.findAll({ where: { patient_id: reminder.patient_id }, raw: true })
            data.records[reminder.patient_id].reminders = [reminder]
            await redis.set(medication.time, JSON.stringify(data))
          }
        } else {
          const initialData = { records: {} }
          initialData.records[reminder.patient_id] = {}
          initialData.records[reminder.patient_id].devices = await db.device_token.findAll({ where: { patient_id: reminder.patient_id }, raw: true })
          initialData.records[reminder.patient_id].reminders = [reminder]
          await redis.set(medication.time, JSON.stringify(initialData))
        }
      }
    }

    return reminders
  } catch (err) {
    console.log(err)
    throw new UnknownServerError(err.message)
  }
}

const sendMedicationReminderNotification = async ({ records }) => {
  try {
    for (const patientId in records) {
      const reminderData = records[patientId]
      for (const device of reminderData.devices) {
        await sendPushNotification('Medication Reminder', 'It\'s time for your medicines', device.device_token, {
          reminders: JSON.stringify(reminderData.reminders)
        })
      }
    }
  } catch (err) {
    console.log(err)
    throw new UnknownServerError(err.message)
  }
}

const getReminders = async ({ patientId, filterBy = null }) => {
  let reminders = []
  if (filterBy) {
    reminders = await db.medication_reminder.findAll({
      where: {
        patient_id: patientId,
        [Op.or]: [{
          medicine_name: {
            [Op.iLike]: `%${filterBy}%`
          }
        }]
      }
    })
  } else {
    reminders = await db.medication_reminder.findAll({
      where: {
        patient_id: patientId
      }
    })
  }
  return reminders
}

const updateMedicationReminder = async ({ patientId, reminderId, medicineName, dosageQty, dosageUnit = null, dosageInterval, dosageIntervalUnit, medicationTime, reminderTime, reminderTimeUnit, startDate, specialRemarks = null }) => {
  const updatedReminder = await db.medication_reminder.update({
    medicine_name: medicineName,
    dosage_qty: dosageQty,
    dosage_unit: dosageUnit,
    dosage_interval: dosageInterval,
    dosage_interval_unit: dosageIntervalUnit,
    medication_time: medicationTime,
    reminder_time: reminderTime,
    reminder_unit: reminderTimeUnit,
    start_date: startDate,
    end_date: getEndDate(startDate, reminderTimeUnit, reminderTime),
    special_remarks: specialRemarks
  }, {
    where: {
      id: reminderId,
      patient_id: patientId
    },
    returning: true,
    raw: true
  })
  await loadMedicationRemindersForTheDay()
  return updatedReminder[1][0]
}

const deleteMedicationReminder = async (reminderId, patientId) => {
  const isDeleted = await db.medication_reminder.destroy({
    where: {
      id: reminderId,
      patient_id: patientId
    }
  })

  if (!isDeleted) {
    throw new DatabaseError('No medication reminder found with the provided id.')
  }
  await loadMedicationRemindersForTheDay()
  return true
}

module.exports = {
  addMedicationReminder,
  loadMedicationRemindersForTheDay,
  sendMedicationReminderNotification,
  updateMedicationReminder,
  deleteMedicationReminder,
  getReminders
}
