const { ForbiddenError } = require('../helpers/ErrorResponse')
const { asyncHander } = require('../helpers/asyncHander')
const ApikeyService = require('../services/apikey.service')
const { HEADER } = require('../utils/contant')

const apiKey = asyncHander(async (req, res, next) => {
  const key = req.headers[HEADER.API_KEY]?.toString()

  if (!key) {
    throw new ForbiddenError('Forbidden Error')
  }
  //check object key
  const objKey = await ApikeyService.findByKey(key)
  if (!objKey) {
    throw new ForbiddenError('Forbidden Error')
  }

  req.objKey = objKey
  return next()
})

const permission = (permission) => {
  return (req, res, next) => {
    if (!req.objKey.permissions) {
      throw new ForbiddenError('Permission denined')
    }
    const validPermission = req.objKey.permissions.includes(permission)
    if (!validPermission) {
      throw new ForbiddenError('Permission denined')
    }

    return next()
  }
}

module.exports = {
  apiKey,
  permission
}
