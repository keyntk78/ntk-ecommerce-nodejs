const keyTokenModel = require('../models/keyToken.model')

class KeyTokenService {
  //Create token save db
  static createKeyToken = async ({
    userId,
    publicKey,
    privateKey,
    refreshToken
  }) => {
    try {
      const filter = {
          user: userId
        },
        update = {
          publicKey: publicKey,
          privateKey: privateKey,
          refreshTokensUsed: [],
          refreshToken
        },
        options = { upsert: true, new: true }
      const tokens = await keyTokenModel.findOneAndUpdate(
        filter,
        update,
        options
      )
      return tokens ? tokens.publicKey : null
    } catch (error) {
      return error
    }
  }

  static findByUserId = async (userId) => {
    return await keyTokenModel.findOne({ user: userId }).lean()
  }

  static removeTokenById = async (id) => {
    return await keyTokenModel.deleteOne({ _id: id })
  }

  static findByRefreshTokenUsed = async (refreshToken) => {
    return await keyTokenModel.findOne({ refreshTokensUsed: refreshToken })
  }

  static findByRefreshToken = async (refreshToken) => {
    return await keyTokenModel.findOne({ refreshToken })
  }

  static deleteTokenByUserId = async (userId) => {
    return await keyTokenModel.findOneAndDelete({ user: userId })
  }
}
module.exports = KeyTokenService
