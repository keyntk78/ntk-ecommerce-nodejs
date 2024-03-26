const JWT = require('jsonwebtoken')
const { asyncHander } = require('../helpers/asyncHander')
const { HEADER } = require('../utils/contant')
const { AuthFailureError, NotFoundError } = require('../helpers/ErrorResponse')
const KeyTokenService = require('../services/keyToken.service')

const createTokenPair = async (payload, publishKey, priviteKey) => {
  try {
    //access token
    const accessToken = await JWT.sign(payload, publishKey, {
      expiresIn: '2d'
    })
    //refresh token
    const refreshToken = await JWT.sign(payload, priviteKey, {
      expiresIn: '7d'
    })
    return { accessToken, refreshToken }
  } catch (error) {
    return error
  }
}

const verifyAccessToken = asyncHander(async (req, res, next) => {
  /*
    1. check userId mising
    2. get accessToken
    3. verify accessToken
    4. Check keyStore with this userid
    5  ok return next
   */
  //1. check userId mising
  const userId = req.headers[HEADER.CLIENT_ID]
  if (!userId) throw new AuthFailureError('Invalid request')
  //2. get accessToken
  const keyStore = await KeyTokenService.findByUserId(userId)

  if (!keyStore) throw new NotFoundError('Not found keyStore')

  //3. verify accessToken
  const accessToken = req?.headers?.authorization
  if (!accessToken) throw new AuthFailureError('Invalid request')
  try {
    //4. Check keyStore with this userid
    const decodeUser = JWT.verify(accessToken, keyStore.publicKey)
    console.log(decodeUser)

    if (userId !== decodeUser.userId) {
      throw new AuthFailureError('Invalid userId')
    }
    //5. ok return next
    req.keyStore = keyStore
    return next()
  } catch (error) {
    throw new Error(error.message)
  }
})

const verifyAccessToken2 = asyncHander(async (req, res, next) => {
  /*
    1. check userId mising
    2. get accessToken
    3. verify accessToken
    4. Check keyStore with this userid
    5  ok return next
   */
  //1. check userId mising
  const userId = req.headers[HEADER.CLIENT_ID]
  if (!userId) throw new AuthFailureError('Invalid request')
  //2. get accessToken
  const keyStore = await KeyTokenService.findByUserId(userId)

  if (!keyStore) throw new NotFoundError('Not found keyStore')

  //
  if (req.headers[HEADER.REFRESHTOKEN]) {
    try {
      const refreshToken = req.headers[HEADER.REFRESHTOKEN]
      const decodeUser = JWT.verify(refreshToken, keyStore.privateKey)
      if (userId !== decodeUser.userId) {
        throw new AuthFailureError('Invalid userId')
      }
      req.keyStore = keyStore
      req.user = decodeUser
      req.refreshToken = refreshToken
      return next()
    } catch (error) {
      throw new Error(error)
    }
  }

  //3. verify accessToken
  const accessToken = req?.headers?.authorization
  if (!accessToken) throw new AuthFailureError('Invalid request')
  try {
    //4. Check keyStore with this userid
    const decodeUser = JWT.verify(accessToken, keyStore.publicKey)
    console.log(decodeUser)

    if (userId !== decodeUser.userId) {
      throw new AuthFailureError('Invalid userId')
    }
    //5. ok return next
    req.keyStore = keyStore
    req.user = decodeUser
    return next()
  } catch (error) {
    throw new Error(error.message)
  }
})

const verifyJWT = async (token, keySecret) => {
  return await JWT.verify(token, keySecret)
}

module.exports = {
  createTokenPair,
  verifyAccessToken,
  verifyJWT,
  verifyAccessToken2
}
