const ajv = require('ajv')
const addFormat = require('ajv-formats')

const { InvalidPayload } = require('./customErrors')

// eslint-disable-next-line new-cap
const schemaValidator = new ajv({ allErrors: true })
addFormat(schemaValidator)

schemaValidator.addKeyword({
  async: true
})

const validate = async (schema, requestBody) => {
  const validate = schemaValidator.compile(schema)
  const validationResult = await validate(requestBody)

  if (!validationResult) {
    throw new InvalidPayload(validate.errors[0].message)
  } else {
    return requestBody
  }
}

module.exports = {
  validate
}
