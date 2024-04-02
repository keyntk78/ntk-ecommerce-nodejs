const express = require('express')
const { asyncHander } = require('../../helpers/asyncHander')
const { verifyAccessToken2 } = require('../../middlewares/jwt')
const cartController = require('../../controllers/cart.controller')
const router = express.Router()

router.post('', asyncHander(cartController.addToCart))
router.delete('', asyncHander(cartController.delete))
router.post('/update', asyncHander(cartController.update))
router.get('', asyncHander(cartController.list))

module.exports = router
