const { CREATED } = require('../helpers/SuccessResponse')
const DiscountService = require('../services/discount.service')

class DiscountController {
  createDiscountCode = async (req, res, next) => {
    new CREATED({
      message: 'Success create discount.',
      metadata: req.body
      //   metadata: await DiscountService.createDiscountCode({
      //     ...req.body,
      //     shop_id: req.user.userId
      //   })
    }).send(res)
  }
}

module.exports = new DiscountController()
