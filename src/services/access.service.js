const shopModel = require('../models/shop.model')
const bcrypt = require('bcrypt')
const { RoleShop } = require('../utils/contant')
const { createTokenPair, verifyJWT } = require('../middlewares/jwt')
const KeyTokenService = require('./keyToken.service')
const { generateRandomHex } = require('../utils/stringUtils')
const { getInfoData } = require('../utils/objectUtils')
const shopService = require('./shop.service')
const {
  BadRequestError,
  ConflictResquestError,
  ForbiddenError,
  AuthFailureError
} = require('../helpers/ErrorResponse')

class AccessService {
  // Signup
  static signup = async ({ name, email, password }) => {
    // step 1: check email existed??
    const hodelShop = await shopModel.findOne({ email: email }).lean()
    if (hodelShop) {
      throw new BadRequestError({
        message: 'Shop already register'
      })
    }
    //Step 2: Add shop
    const passwordHash = await bcrypt.hash(password, 10)
    const newShop = await shopModel.create({
      email,
      password: passwordHash,
      name,
      roles: [RoleShop.SHOP]
    })
    if (newShop) {
      //STEP 3: Create ACCESS_TOKEN AND REFRESH_TOKEN
      //RSA
      const privateKey = generateRandomHex()
      const publicKey = generateRandomHex()
      //genarate token
      const tokens = await createTokenPair(
        {
          userId: newShop._id,
          email,
          roles: newShop.roles
        },
        publicKey,
        privateKey
      )
      // 5. save token in dbs
      await KeyTokenService.createKeyToken({
        userId: newShop._id,
        email,
        refreshToken: tokens.refreshToken,
        privateKey,
        publicKey
      })
      return {
        shop: getInfoData({
          fileds: ['_id', 'name', 'email'],
          object: newShop
        }),
        tokens
      }
    }
    throw new BadRequestError({
      message: 'Register failed'
    })
  }
  /*
      1. check email in dbs
      2. match password
      3. create AT và RT and save
      4. genarate token
      5. save token in dbs
      6. get data return login

   */
  static login = async ({ email, password, refreshToken = null }) => {
    // 1. check email in dbs
    const foundShop = await shopService.findByEmail({ email })
    if (!foundShop)
      throw new BadRequestError({
        message: 'Account or password is incorrect'
      })

    // 2. match password
    const match = await bcrypt.compare(password, foundShop.password)
    if (!match)
      throw new BadRequestError({
        message: 'Account or password is incorrect'
      })

    //3. create AT và RT and save
    const privateKey = generateRandomHex()
    const publicKey = generateRandomHex()

    //4. genarate token
    const tokens = await createTokenPair(
      {
        userId: foundShop._id,
        email,
        roles: foundShop.roles
      },
      publicKey,
      privateKey
    )
    // 5. save token in dbs
    await KeyTokenService.createKeyToken({
      userId: foundShop._id,
      email,
      refreshToken: tokens.refreshToken,
      privateKey,
      publicKey
    })

    //6. get data return login
    return {
      shop: getInfoData({
        fileds: ['_id', 'name', 'email'],
        object: foundShop
      }),
      tokens
    }
  }

  /**
   *logout
   * @param {*} keyStore
   */
  static logout = async (keyStore) => {
    const delKey = await KeyTokenService.removeTokenById(keyStore._id)
    return delKey
  }

  //hanlde refresh token
  static handleRefreshToken = async (refreshToken) => {
    const foundToken = await KeyTokenService.findByRefreshTokenUsed(
      refreshToken
    )
    if (foundToken) {
      //ĐÃ SỬ DỤNG RT RỒI NÊN CẦN XÓA XEM AI ĐÃ ĐĂNG NHẬP ĐỂ ĐƯA VÀO LIST NGUY VẤN
      const { userId, email } = await verifyJWT(refreshToken, foundToken)
      console.log(userId, email)
      //xóa
      await KeyTokenService.deleteTokenByUserId(userId)
      throw new ForbiddenError(
        'Something went wrong happend !! Please  relogin'
      )
    }

    // chưa sử dụng
    const holderToken = await KeyTokenService.findByRefreshToken(refreshToken)
    if (!holderToken) throw new AuthFailureError('Shop not registered')

    const { userId, email } = await verifyJWT(
      refreshToken,
      holderToken.privateKey
    )
    //verify token
    const foundShop = await shopService.findByEmail({ email })
    if (!foundShop) throw new AuthFailureError('Shop not registered')

    //create tokens
    const tokens = await createTokenPair(
      {
        userId,
        email,
        roles: foundShop.roles
      },
      holderToken.publicKey,
      holderToken.privateKey
    )

    //update token
    await holderToken.updateOne({
      $set: { refreshToken: tokens.refreshToken },
      $addToSet: { refreshTokensUsed: refreshToken }
    })

    return { user: email, tokens }
  }

  static handleRefreshToken2 = async ({ refreshToken, user, keyStore }) => {
    const { userId, email } = user

    if (keyStore.refreshTokensUsed.includes(refreshToken)) {
      await KeyTokenService.deleteTokenByUserId(userId)
      throw new ForbiddenError(
        'Something went wrong happend !! Please  relogin'
      )
    }

    if (keyStore.refreshToken !== refreshToken) {
      throw new AuthFailureError('Shop not registered')
    }

    const foundShop = await shopService.findByEmail({ email })
    if (!foundShop) throw new AuthFailureError('Shop not registered')

    //create tokens
    const tokens = await createTokenPair(
      {
        userId,
        email,
        roles: foundShop.roles
      },
      keyStore.publicKey,
      keyStore.privateKey
    )

    const holderToken = await KeyTokenService.findByRefreshToken(
      keyStore.refreshToken
    )
    if (!holderToken) throw new AuthFailureError('Shop not registered')

    //update token
    await holderToken.updateOne({
      $set: { refreshToken: tokens.refreshToken },
      $addToSet: { refreshTokensUsed: refreshToken }
    })

    return { user, tokens }
  }
}

module.exports = AccessService
