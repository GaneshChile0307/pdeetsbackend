const patientModule = require('../modules/patient')
const appointmentModule = require('../modules/appointment')
const medicationModule = require('../modules/medication')
const callBackRquestModule = require('../modules/callback-request')
const reportsModule = require('../modules/reports')
const gloablErrorHandler = require('../middleware/error')

module.exports = (app) => {
  app.use('/v1/patient', patientModule)

  app.use('/v1/appointment', appointmentModule)

  app.use('/v1/medication', medicationModule)

  app.use('/v1/callback-request', callBackRquestModule)

  app.use('/v1/reports', reportsModule)

  app.get('/v1/', (req, res) => { res.json({ message: 'Pdeets API home', version: 'v1' }) })

  app.use(gloablErrorHandler)
}
