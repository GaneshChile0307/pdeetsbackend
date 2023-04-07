const schema = require('./callback-request.schema')
const callBackRequestService = require('./callback-request.service')
const validator = require('../../utils/schemaValidator')
const { InvalidPayload } = require('../../utils/customErrors')

const getCallbackRequestReasons = async (req, res, next) => {
  try {
    const reasons = await callBackRequestService.getCallbackRequestReasons()
    res.status(200).json({
      message: 'callback request reasons',
      data: {
        reasons
      }
    })
  } catch (err) {
    next(err)
  }
}

const addCallBackRequest = async (req, res, next) => {
  try {
    const callRequestBody = await validator.validate(
      schema.callBackRequestSchema,
      req.body
    )
    callRequestBody.patientId = req.patient.id

    const callbackRequest = await callBackRequestService.addCallRequest(callRequestBody)
    res.status(201).json({
      message: 'Request of callback is sent successfully',
      data: {
        callbackRequest
      }
    })
  } catch (err) {
    next(err)
  }
}

const getAllCallBackRequests = async (req, res, next) => {
  try {
    const callbackRequest = await callBackRequestService.getAllCallRequestById(req.patient.id)
    res.status(200).json({
      message: 'callback request listing',
      data: {
        callbackRequest
      }
    })
  } catch (err) {
    next(err)
  }
}

const getAllCallBackRequestById = async (req, res, next) => {
  try {
    await validator.validate(
      schema.callBackRequestSchema,
      req.body
    )
    await callBackRequestService.getAllCallRequestById(req.patient.id)
    res.status(200).json({
      message: 'Request of callback is sent successfully'
    })
  } catch (err) {
    next(err)
  }
}

const updateAllCallBackRequestById = async (req, res, next) => {
  try {
    req.body.callbackRequestId = req.params.callbackRequestId
    const reqBody = await validator.validate(
      schema.updateCallBackRequestSchema,
      req.body
    )
    reqBody.patientId = req.patient.id
    const callbackRequest = await callBackRequestService.updateAllCallRequestById(reqBody)
    res.status(200).json({
      message: 'callback request updated',
      data: {
        callbackRequest
      }
    })
  } catch (err) {
    next(err)
  }
}

const deleteCallBackRequest = async (req, res, next) => {
  try {
    if (req.params.callbackRequestId) {
      await callBackRequestService.deleteCallBackRequest(req.params.callbackRequestId, req.patient.id)
      res.status(200).json({
        message: 'callback request deleted.',
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
const callbackRequestModuleErrorHandler = (err, req, res, next) => {
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
  getCallbackRequestReasons,
  addCallBackRequest,
  getAllCallBackRequests,
  getAllCallBackRequestById,
  updateAllCallBackRequestById,
  deleteCallBackRequest,
  callbackRequestModuleErrorHandler
}
