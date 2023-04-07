const cron = require('node-cron')
const config = require('config')
const luxon = require('luxon')
const redis = require('../db/redis')
const appointmentService = require('../modules/appointment/appointment.service')
const medicationReminderService = require('../modules/medication/medication.service')
const { DateTime } = require('luxon')

module.exports = () => {
  // appointment reminder cron: every day 5 am
  cron.schedule('0 5 * * *', async () => {
    await appointmentService.sendAppointmentReminder()
  }, {
    timezone: config.get('crons.timezone')
  })

  // medication reminder cron: runs every second
  cron.schedule('*/1 * * * * *', async () => {
    const key = luxon.DateTime.now().setLocale('fr').toLocaleString(DateTime.TIME_WITH_SECONDS)
    const reminders = await redis.get(key)
    if (reminders) {
      console.log('reminder trigged..')
      await medicationReminderService.sendMedicationReminderNotification(JSON.parse(reminders))
    }
  }, {
    timezone: config.get('crons.timezone')
  })

  // medication reminder data loading cron: mid night every day
  cron.schedule('0 0 * * *', async () => {
    await medicationReminderService.loadMedicationRemindersForTheDay()
    console.log('medication loading cron ran...')
  }, {
    timezone: config.get('crons.timezone')
  })
}
