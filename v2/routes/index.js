const patientModule = require('../modules/patient')
const appointmentModule = require('../modules/appointment')
const medicationModule = require('../modules/medication')
const callBackRquestModule = require('../modules/callback-request')
const reportsModule = require('../modules/reports')
const newsModule = require('../modules/news')
const gloablErrorHandler = require('../middleware/error')

module.exports = (app) => {
  app.use('/v2/patient', patientModule)

  app.use('/v2/appointment', appointmentModule)

  app.use('/v2/medication', medicationModule)

  app.use('/v2/callback-request', callBackRquestModule)

  app.use('/v2/reports', reportsModule)

  app.use('/v2/news', newsModule)

  app.get('/v2/', (req, res) => { res.json({ message: 'Pdeets API home', version: 'v2' }) })

  app.use(gloablErrorHandler)
}
