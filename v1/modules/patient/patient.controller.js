const schema = require('./patient.schema')
const validator = require('../../utils/schemaValidator')
const patientService = require('./patient.service')
const tokenHelper = require('../../utils/token')
const { PasswordActionEnum } = require('../../utils/enums')

const registerPatient = async (req, res, next) => {
  try {
    const patient = await validator.validate(
      schema.patientRegitserSchema,
      req.body
    )
    const newlyAddedPatient = await patientService.addPatient(patient)

    res.status(201).json({
      message: 'Patient registration successful',
      data: {
        tokens: null,
        patient: newlyAddedPatient
      }
    })
  } catch (err) {
    next(err)
  }
}

const patientLogin = async (req, res, next) => {
  try {
    const patient = await validator.validate(
      schema.patientLoginSchema,
      req.body
    )
    const data = await patientService.validatePatientLogin(patient)
    res.status(200).json({
      message: 'Login successful',
      data: {
        tokens: data.tokens,
        patient: data.foundPatient
      }
    })
  } catch (err) {
    next(err)
  }
}

const refreshTokens = async (req, res, next) => {
  try {
    const receivedRefreshToken = req.headers.authorization
    if (receivedRefreshToken) {
      const refreshTokenData = await tokenHelper.verifyRefreshToken(
        receivedRefreshToken
      )
      const newTokenPair = await patientService.issueNewTokenPair(
        refreshTokenData
      )
      res.status(200).json({
        message: 'Success',
        data: {
          tokens: newTokenPair
        }
      })
    } else {
      res.status(401).send({
        error: 'Auhtnetication header not found in the request header.'
      })
    }
  } catch (err) {
    next(err)
  }
}

const passwordResetToken = async (req, res, next) => {
  try {
    const patient = await validator.validate(
      schema.passwordResetTokenSchema,
      req.body
    )
    patient.action = PasswordActionEnum.get_password_reset_token

    const token = await patientService.performPasswordAction(patient)

    res.status(200).json({
      message: 'Token generated',
      data: {
        resetToken: token
      }
    })
  } catch (err) {
    next(err)
  }
}

const patientPasswordActionHandler = async (req, res, next) => {
  try {
    const patient = await validator.validate(
      schema.patientPasswordUpdateSchema,
      req.body
    )

    // appending reset token data to patient
    if (patient.action === PasswordActionEnum.reset_password) {
      patient.email = req.patient.email
      patient.phoneNumber = req.patient.phoneNumber
      patient.suppliedValidationCode = patient.validationCode
      patient.actualValidationCode = req.patient.validationCode.toString()
    }

    const actionResult = await patientService.performPasswordAction(patient)

    switch (patient.action) {
      case PasswordActionEnum.change_password:
        res.status(200).json({
          message: actionResult,
          data: {}
        })
        break
      case PasswordActionEnum.reset_password:
        res.status(200).json({
          message: actionResult,
          data: {}
        })
    }
  } catch (err) {
    next(err)
  }
}

const patientErrorHandler = (err, req, res, next) => {
  // console.log(err)
  switch (err.name) {
    case 'DbError':
      res.status(400).json({
        error: err.message
      })
      break
    case 'InvalidUser':
      res.status(401).json({
        error: err.message
      })
      break
    default:
      next(err)
  }
}

module.exports = {
  registerPatient,
  patientLogin,
  refreshTokens,
  passwordResetToken,
  patientPasswordActionHandler,
  patientErrorHandler
}
