const { CREATED, OK } = require('../helpers/SuccessResponse')
const CartService = require('../services/cart.service')

class CartController {
  /**
   * @desc add to cart for user
   * @param {int} userId
   * @param {*} res
   * @param {*} next
   * @method POST
   * @url POST
   * @return {}
   */
  addToCart = async (req, res, next) => {
    new CREATED({
      message: 'Create new Cart successfully',
      metadata: await CartService.addToCart(req.body)
    }).send(res)
  }

  //update + -
  update = async (req, res, next) => {
    new OK({
      message: 'Update Cart successfully',
      metadata: await CartService.addToCartV2(req.body)
    }).send(res)
  }

  //delete
  delete = async (req, res, next) => {
    new OK({
      message: 'Delete Cart successfully',
      metadata: await CartService.deleteUserCart(req.body)
    }).send(res)
  }

  list = async (req, res, next) => {
    new OK({
      message: 'List Cart successfully',
      metadata: await CartService.getListUserCart(req.query)
    }).send(res)
  }
}

module.exports = new CartController()
