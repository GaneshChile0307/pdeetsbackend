
const token = require('../utils/token')

module.exports = () => {
  return async (req, res, next) => {
    const receivedToken = req.headers.authorization

    try {
      if (receivedToken) {
        const decodedReceivedToken = token.decodeWithoutVerification(receivedToken)

        if (decodedReceivedToken.payload.isAppointmentQrToken) {
          const qrToken = await token.verifyQrToken(receivedToken)
          req.appointmentId = qrToken.appointmentId
          req.patientId = qrToken.patientId
        } else {
          res.status(401).json({
            error: 'Invalid token supplied'
          })
        }
        return next()
      } else {
        res.status(401).json({
          error: 'Auhtnetication header not found in the request header.'
        })
      }
    } catch (err) {
      next(err)
    }
  }
}
