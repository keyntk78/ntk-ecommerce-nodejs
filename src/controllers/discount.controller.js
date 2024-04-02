const { CREATED, OK } = require('../helpers/SuccessResponse')
const DiscountService = require('../services/discount.service')

class DiscountController {
  createDiscountCode = async (req, res, next) => {
    new CREATED({
      message: 'Success create discount.',
      metadata: await DiscountService.createDiscountCode({
        ...req.body,
        shop_id: req.user.userId
      })
    }).send(res)
  }

  getAllDiscountCodes = async (req, res, next) => {
    new OK({
      message: 'Get all discount.',
      metadata: await DiscountService.getAllDiscountCodesByShop({
        ...req.query,
        shop_id: req.user.userId
      })
    }).send(res)
  }

  getDiscountAmout = async (req, res, next) => {
    new OK({
      message: 'Get discount amount.',
      metadata: await DiscountService.getDiscountAmount({
        ...req.body
      })
    }).send(res)
  }

  getAllDiscountCodesWithProducts = async (req, res, next) => {
    new OK({
      message: 'Get all discount with product.',
      metadata: await DiscountService.getAllDiscountCodesWithProduct({
        ...req.query
      })
    }).send(res)
  }
}

module.exports = new DiscountController()
