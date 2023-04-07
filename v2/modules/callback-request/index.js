const express = require('express')
const callbackRequestController = require('./callback-request.controlller')
const authMiddleware = require('../../middleware/auth')

const router = express.Router()

router.get('/reasons', authMiddleware(), callbackRequestController.getCallbackRequestReasons)

router.post('/', authMiddleware(), callbackRequestController.addCallBackRequest)

router.get('/', authMiddleware(), callbackRequestController.getAllCallBackRequests)

router.put('/:callbackRequestId', authMiddleware(), callbackRequestController.updateAllCallBackRequestById)

router.delete('/:callbackRequestId', authMiddleware(), callbackRequestController.deleteCallBackRequest)

// router.get('/:id', authMiddleware(), callbackRequestController.getAllCallBackRequestById)

router.use(callbackRequestController.callbackRequestModuleErrorHandler)

module.exports = router
