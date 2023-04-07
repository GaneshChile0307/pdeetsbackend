class InvalidPayload extends Error {
  constructor (message) {
    super(message)
    this.name = 'InvalidPayload'
  }
}

class DatabaseError extends Error {
  constructor (message) {
    super(message)
    this.name = 'DbError'
  }
}

class InvalidUser extends Error {
  constructor (message) {
    super(message)
    this.name = 'InvalidUser'
  }
}

class JwtError extends Error {
  constructor (message) {
    super(message)
    this.name = 'JwtError'
  }
}

class UnknownServerError extends Error {
  constructor (message) {
    super('Something went wrong...please try again.')
    this.name = 'UnknownServerError'
  }
}

module.exports = {
  InvalidPayload,
  DatabaseError,
  InvalidUser,
  JwtError,
  UnknownServerError
}
