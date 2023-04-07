
const globalErrorHandler = (err, req, res, next) => {
  // console.log(err.name)
  switch (err.name) {
    case 'InvalidPayload':
      return res.status(400).json({
        error: err.message
      })
    case 'JwtError':
      res.status(401).json({
        error: err.message
      })
      break
    case 'UnknownServerError':
      return res.status(500).json({
        error: err.message
      })
    case 'SyntaxError':
      res.status(401).json({
        error: 'Malformed json payload'
      })
      break
    default:
      return res.status(500).json({
        error: 'Something went wrong...please try again'
      })
  }
}

module.exports = globalErrorHandler
