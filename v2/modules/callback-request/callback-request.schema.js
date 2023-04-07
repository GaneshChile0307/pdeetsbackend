const callBackRequestSchema = {
  type: 'object',
  properties: {
    callbackReasonId: {
      type: 'string'
    },
    preferredContactOption: {
      type: 'string',
      enum: ['phone', 'email']
    },
    preferredTime: {
      type: 'string',
      format: 'date-time'
    },
    isSevere: {
      type: 'boolean',
      default: false
    },
    remarks: {
      type: 'string'
    },
    status: {
      type: 'string',
      enum: ['pending', 'contacted', 'not_reachable']
    }
  },
  required: ['callbackReasonId', 'preferredContactOption', 'preferredTime', 'status'],
  additionalProperties: false
}

const updateCallBackRequestSchema = {
  type: 'object',
  properties: {
    callbackRequestId: {
      type: 'string'
    },
    callbackReasonId: {
      type: 'string'
    },
    preferredContactOption: {
      type: 'string',
      enum: ['phone', 'email']
    },
    preferredTime: {
      type: 'string',
      format: 'date-time'
    },
    isSevere: {
      type: 'boolean',
      default: false
    },
    remarks: {
      type: 'string'
    },
    status: {
      type: 'string',
      enum: ['pending', 'contacted', 'not_reachable']
    }
  },
  required: ['callbackRequestId'],
  additionalProperties: false
}

module.exports = {
  callBackRequestSchema,
  updateCallBackRequestSchema
}
