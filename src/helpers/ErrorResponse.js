const { StatusCodes, ReasonPhrases } = require('../utils/httpStatusCode')

class ErrorResponse extends Error {
  constructor(message, status) {
    super(message)
    this.status = status
  }
}

class ConflictResquestError extends ErrorResponse {
  constructor(message = ReasonPhrases.CONFLICT, status = StatusCodes.CONFLICT) {
    super(message, status)
  }
}

class AuthFailureError extends ErrorResponse {
  constructor(
    message = ReasonPhrases.UNAUTHORIZED,
    status = StatusCodes.UNAUTHORIZED
  ) {
    super(message, status)
  }
}

class ForbiddenError extends ErrorResponse {
  constructor(
    message = ReasonPhrases.FORBIDDEN,
    status = StatusCodes.FORBIDDEN
  ) {
    super(message, status)
  }
}

class NotFoundError extends ErrorResponse {
  constructor(
    message = ReasonPhrases.NOT_FOUND,
    status = StatusCodes.NOT_FOUND
  ) {
    super(message, status)
  }
}

class BadRequestError extends ErrorResponse {
  constructor({
    message = ReasonPhrases.BAD_REQUEST,
    status = StatusCodes.BAD_REQUEST,
    langMessage
  }) {
    super(message, status)
    this.langMessage = langMessage
  }
}

class VaidateRequestError extends ErrorResponse {
  constructor(
    message = ReasonPhrases.UNPROCESSABLE_ENTITY,
    status = StatusCodes.UNPROCESSABLE_ENTITY
  ) {
    super(message, status)
  }
}

module.exports = {
  ConflictResquestError,
  BadRequestError,
  AuthFailureError,
  NotFoundError,
  VaidateRequestError,
  ForbiddenError
}
