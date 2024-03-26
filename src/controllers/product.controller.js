const productService = require('../services/product.service')
const { CREATED, OK } = require('../helpers/SuccessResponse')
class ProductController {
  createProduct = async (req, res, next) => {
    new CREATED({
      message: 'Create new product success.',
      metadata: await productService.createProduct(req.body.product_type, {
        ...req.body,
        product_shop: req.user.userId
      })
    }).send(res)
  }

  publishProductByShop = async (req, res, next) => {
    new OK({
      message: 'Publish product success.',
      metadata: await productService.publishProductByShop({
        product_shop: req.user.userId,
        product_id: req.params.id
      })
    }).send(res)
  }

  unPublishProductByShop = async (req, res, next) => {
    new OK({
      message: 'Unpublish product success.',
      metadata: await productService.unPublishProductByShop({
        product_shop: req.user.userId,
        product_id: req.params.id
      })
    }).send(res)
  }

  //Query
  getAllDraftsForShop = async (req, res, next) => {
    new OK({
      message: 'Get List draft product success.',
      metadata: await productService.findAllDraftForShop({
        product_shop: req.user.userId
      })
    }).send(res)
  }

  getAllPublishForShop = async (req, res, next) => {
    new OK({
      message: 'Get List publish product success.',
      metadata: await productService.findAllPublishForShop({
        product_shop: req.user.userId
      })
    }).send(res)
  }

  getListSearch = async (req, res, next) => {
    new OK({
      message: 'Get List search product success.',
      metadata: await productService.searchProducts(req.params)
    }).send(res)
  }

  //PUT
}

module.exports = new ProductController()
