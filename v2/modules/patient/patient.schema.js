const patientRegitserSchema = {
  type: 'object',
  properties: {
    firstName: {
      type: 'string'
    },
    lastName: {
      type: 'string'
    },
    email: {
      type: 'string',
      format: 'email'
    },
    phoneNumber: {
      type: 'string',
      minLength: 10,
      maxLength: 15
    },
    gender: {
      type: 'string',
      enum: ['male', 'female', 'other']
    },
    dateOfBirth: {
      type: 'string',
      format: 'date-time'
    },
    password: {
      type: 'string'
    }
  },
  required: ['firstName', 'lastName', 'phoneNumber', 'password'],
  additionalProperties: false
}

const patientLoginSchema = {
  type: 'object',
  properties: {
    email: {
      type: 'string'
    },
    phoneNumber: {
      type: 'string',
      maxLength: 15
    },
    password: {
      type: 'string'
    },
    deviceToken: {
      type: 'string'
    }
  },
  required: ['email', 'phoneNumber', 'password', 'deviceToken'],
  additionalProperties: false
}

const favDoctorSchema = {
  type: 'object',
  properties: {
    doctorId: {
      type: 'number'
    },
    locationId: {
      type: 'number'
    },
    departmentId: {
      type: 'number'
    }
  },
  required: ['doctorId', 'locationId'],
  additionalProperties: false
}

const passwordResetTokenSchema = {
  type: 'object',
  properties: {
    email: {
      type: 'string',
      format: 'email'
    },
    phoneNumber: {
      type: 'string',
      minLength: 10,
      maxLength: 15
    }
  },
  oneOf: [{ required: ['email'] }, { required: ['phoneNumber'] }],
  additionalProperties: false
}

const patientPasswordUpdateSchema = {
  type: 'object',
  properties: {
    action: {
      type: 'string',
      enum: ['change_password', 'reset_password']
    },
    email: {
      type: 'string',
      format: 'email'
    },
    phoneNumber: {
      type: 'string',
      minLength: 10,
      maxLength: 15
    },
    validationCode: {
      type: 'string'
    },
    oldPassword: {
      type: 'string'
    },
    newPassword: {
      type: 'string'
    }
  },
  anyOf: [
    { required: ['action', 'email', 'oldPassword', 'newPassword'] },
    { required: ['action', 'phoneNumber', 'oldPassword', 'newPassword'] },
    { required: ['action', 'validationCode', 'newPassword'] },
    { required: ['action', 'email'] },
    { required: ['action', 'phoneNumber'] }
  ],
  additionalProperties: false
}

module.exports = {
  patientRegitserSchema,
  patientLoginSchema,
  passwordResetTokenSchema,
  patientPasswordUpdateSchema,
  favDoctorSchema
}
