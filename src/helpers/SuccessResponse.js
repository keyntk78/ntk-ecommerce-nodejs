const { ReasonPhrases, StatusCodes } = require('../utils/httpStatusCode')

class SuccessResponse {
  constructor({
    message,
    statusCode = StatusCodes.OK,
    reasonStatusCode = ReasonPhrases,
    metadata = {}
  }) {
    this.message = !message ? reasonStatusCode : message
    this.status = statusCode
    this.metadata = metadata
    this.success = true
  }

  send(res, headers = {}) {
    return res.status(this.status).json(this)
  }
}

class OK extends SuccessResponse {
  constructor({
    message = ReasonPhrases.OK,
    metadata = {},
    options = {},
    langMessage = null
  }) {
    super({ message, metadata })
    ;(this.options = options), (this.langMessage = langMessage)
  }
}

class CREATED extends SuccessResponse {
  constructor({
    message,
    statusCode = StatusCodes.CREATED,
    reasonStatusCode = ReasonPhrases.CREATED,
    metadata = {},
    options = {},
    langMessage = null
  }) {
    super({ message, statusCode, reasonStatusCode, metadata })
    this.options = options
    this.langMessage = langMessage
  }
}

module.exports = {
  OK,
  CREATED
}
