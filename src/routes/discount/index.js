const express = require('express')
const discountController = require('../../controllers/discount.controller')
const { asyncHander } = require('../../helpers/asyncHander')
const { verifyAccessToken2 } = require('../../middlewares/jwt')
const router = express.Router()

router.post('/amount', asyncHander(discountController.getDiscountAmout))
router.get(
  '/list_product_code',
  asyncHander(discountController.getAllDiscountCodesWithProducts)
)

//verifyAccessToken
router.use(verifyAccessToken2)
router.post('', asyncHander(discountController.createDiscountCode))
router.get('', asyncHander(discountController.getAllDiscountCodes))

module.exports = router
