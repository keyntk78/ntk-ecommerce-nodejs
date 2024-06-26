const { Types } = require('mongoose')
const {
  product,
  clothing,
  furniture,
  electronics
} = require('../product.model')
const {
  getSelectData,
  unGetSelectData,
  convertToObjectDbMongodb
} = require('../../utils/objectUtils')

const findAllDraftForShop = async ({ query, limit, skip }) => {
  return await queryProduct({ query, limit, skip })
}

const findAllPublishForShop = async ({ query, limit, skip }) => {
  return await queryProduct({ query, limit, skip })
}

const searchProducts = async ({ keySearch }) => {
  const regexSearch = new RegExp('Iphone 14')
  // const results = await product.find(
  //   { $text: { $search: regexSearch } }
  //   // { score: { $meta: 'textScore' } }
  // )
  // // .sort({ score: { $meta: 'textScore' } })
  // // .lean()
  const results = await product
    .find({
      $and: [
        {
          $or: [
            { product_name: { $regex: keySearch, $options: 'i' } },
            { product_description: { $regex: keySearch, $options: 'i' } }
          ]
        },
        { isDraft: false }
      ]
    })
    .lean()
  return results
}

const queryProduct = async ({ query, limit, skip }) => {
  return await product
    .find(query)
    .populate('product_shop', 'name email _id')
    .sort({ updateAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean()
    .exec()
}

const publishProductByShop = async ({ product_shop, product_id }) => {
  const foundShop = await product.findOne({
    product_shop: new Types.ObjectId(product_shop),
    _id: new Types.ObjectId(product_id)
  })

  if (!foundShop) return null

  foundShop.isDraft = false
  foundShop.isPublished = true
  const result = await foundShop.save()
  return result ? 1 : 0
}

const unPublishProductByShop = async ({ product_shop, product_id }) => {
  const foundShop = await product.findOne({
    product_shop: new Types.ObjectId(product_shop),
    _id: new Types.ObjectId(product_id)
  })

  if (!foundShop) return null

  foundShop.isDraft = true
  foundShop.isPublished = false
  const result = await foundShop.save()
  return result ? 1 : 0
}

const findAllProducts = async ({ limit, sort, page, filter, select }) => {
  const skip = (page - 1) * limit
  const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 }
  const products = await product
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getSelectData(select))
    .lean()

  return products
}

const findProduct = async ({ product_id, unSelect }) => {
  return await product.findById(product_id).select(unGetSelectData(unSelect))
}

const updateProductById = async ({
  product_id,
  bodyUpdate,
  model,
  isNew = true
}) => {
  return await model.findByIdAndUpdate(product_id, bodyUpdate, { new: isNew })
}

const getProductId = async (productId) => {
  return await product.findOne({ _id: productId }).lean()
}

module.exports = {
  findAllDraftForShop,
  publishProductByShop,
  findAllPublishForShop,
  unPublishProductByShop,
  searchProducts,
  findAllProducts,
  findProduct,
  updateProductById,
  getProductId
}
