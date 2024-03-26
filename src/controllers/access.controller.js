const accessService = require('../services/access.service')
const { CREATED, OK } = require('../helpers/SuccessResponse')
class AccessController {
  signup = async (req, res, next) => {
    new CREATED({
      message: 'Register successfully.Please check email.',
      metadata: await accessService.signup(req.body)
    }).send(res)
  }

  login = async (req, res, next) => {
    new OK({
      message: 'Login successfully.',
      metadata: await accessService.login(req.body)
    }).send(res)
  }

  logout = async (req, res, next) => {
    new OK({
      message: 'Logout successfully.',
      metadata: await accessService.logout(req.keyStore)
    }).send(res)
  }

  handleRefreshToken = async (req, res, next) => {
    // new OK({
    //   message: 'Get token successfully.',
    //   metadata: await accessService.handleRefreshToken(req.body.refreshToken)
    // }).send(res)

    //v2
    new OK({
      message: 'Get token successfully.',
      metadata: await accessService.handleRefreshToken2({
        refreshToken: req.refreshToken,
        user: req.user,
        keyStore: req.keyStore
      })
    }).send(res)
  }
}

module.exports = new AccessController()
