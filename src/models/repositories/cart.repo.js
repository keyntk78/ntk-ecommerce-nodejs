const cartModel = require('../cart.model')

const createUserCart = async ({ userId, product }) => {
  const query = { cart_userId: userId, cart_state: 'active' }
  const updateOrInsert = {
      $addToSet: { cart_products: product }
    },
    options = {
      upsert: true,
      new: true
    }

  return await cartModel.findOneAndUpdate(query, updateOrInsert, options)
}
const createUserCartQuantity = async ({ userId, product }) => {
  const { productId, quantity } = product

  // Tìm giỏ hàng của người dùng với sản phẩm cụ thể
  const query = {
    cart_userId: userId,
    'cart_products.productId': productId,
    cart_state: 'active'
  }

  // Tăng số lượng sản phẩm trong giỏ hàng
  const updateSet = { $inc: { 'cart_products.$.quantity': quantity } }

  // Tùy chọn cập nhật
  const options = { upsert: true, new: true }

  // Thực hiện truy vấn cập nhật
  const updated = await cartModel.findOneAndUpdate(query, updateSet, options)

  return updated
}

const deleteUserCart = async ({ userId, productId }) => {
  const query = {
      cart_userId: userId,
      cart_state: 'active'
    },
    updateSet = { $pull: { cart_products: { productId } } }

  return await cartModel.updateOne(query, updateSet)
}

module.exports = {
  createUserCart,
  createUserCartQuantity,
  deleteUserCart
}
