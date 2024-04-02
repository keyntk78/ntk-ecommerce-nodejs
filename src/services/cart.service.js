const cartModel = require('../models/cart.model')
const {
  createUserCart,
  createUserCartQuantity,
  deleteUserCart
} = require('../models/repositories/cart.repo')
const { getProductId } = require('../models/repositories/product.repo')
const { NotFoundError } = require('../helpers/ErrorResponse')

/**
 * Key features: Cart service
 * -- add product to cart [user]
 * -- reduce product quantity by one [user]
 * -- increase product quantity by one [user]
 * -- get cart [user]
 * -- Delete cart [user]
 * -- Delete item from cart [user]
 */
class CartService {
  //-- add product to cart [user]
  static async addToCart({ userId, product = {} }) {
    //check cart tồn tại
    const userCart = await cartModel.findOne({ cart_userId: userId })

    if (!userCart) {
      return await createUserCart({ userId, product })
    }

    // nếu có giỏ hàng rồi nhưng chua có sản phẩm
    if (!userCart.cart_products.length) {
      userCart.cart_products = [product]
      return await userCart.save()
    }

    // giỏ hàng tồn tại và có sản phẩm này thì update quantity
    return await createUserCartQuantity({ userId, product })
  }

  //update
  //payload
  /**
   * shop_order_ids: [
   *    shopId,
   *    item_products : [
   *        {
   *            quantity,
   *            price,
   *            shopId,
   *            old_quantity,
   *            productId
   *        }
   *    ]
   * ]
   */
  static async addToCartV2({ userId, shop_order_ids = {} }) {
    const { productId, quantity, old_quantity } =
      shop_order_ids[0]?.item_products[0]

    // //check product
    const foundProduct = await getProductId(productId)

    if (!foundProduct) throw new NotFoundError('')
    // compare
    if (foundProduct.product_shop.toString() !== shop_order_ids[0]?.shopId) {
      throw new NotFoundError('Product do not belong to shop')
    }

    if (quantity === 0) {
      //delete cart
      deleteUserCart({ userId, productId })
    }

    return await createUserCartQuantity({
      userId,
      product: { productId, quantity: quantity - old_quantity }
    })
  }

  static async deleteUserCart({ userId, productId }) {
    return await deleteUserCart({ userId, productId })
  }

  static async getListUserCart({ userId }) {
    return await cartModel.findOne({ cart_userId: +userId }).lean()
  }
}

module.exports = CartService
