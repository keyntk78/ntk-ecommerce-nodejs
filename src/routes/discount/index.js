const express = require('express')
const discountController = require('../../controllers/discount.controller')
const { asyncHander } = require('../../helpers/asyncHander')
const { verifyAccessToken2 } = require('../../middlewares/jwt')
const router = express.Router()

//verifyAccessToken
router.use(verifyAccessToken2)
router.post('', asyncHander(discountController.createDiscountCode))

module.exports = router
