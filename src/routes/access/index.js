const express = require('express')
const accessController = require('../../controllers/access.controller')
const { asyncHander } = require('../../helpers/asyncHander')
const { verifyAccessToken2 } = require('../../middlewares/jwt')
const router = express.Router()

router.post('/shop/signup', asyncHander(accessController.signup))
router.post('/shop/login', asyncHander(accessController.login))

//verifyAccessToken
router.use(verifyAccessToken2)
router.get('/shop/logout', asyncHander(accessController.logout))
router.post(
  '/shop/handleRefreshToken',
  asyncHander(accessController.handleRefreshToken)
)

module.exports = router
