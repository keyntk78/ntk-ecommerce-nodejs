const InventoryModel = require('../Inventory.model')

const insertInvetory = async ({
  productId,
  shopId,
  stock,
  location = 'unKmow'
}) => {
  return await InventoryModel.create({
    inven_productId: productId,
    inven_shopId: shopId,
    inven_location: location,
    inven_stock: stock
  })
}

module.exports = {
  insertInvetory
}
