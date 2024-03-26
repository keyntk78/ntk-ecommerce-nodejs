const { BadRequestError } = require('../helpers/ErrorResponse')
const { product, electronics, clothing } = require('../models/product.model')
const {
  findAllDraftForShop,
  findAllPublishForShop,
  publishProductByShop,
  unPublishProductByShop,
  searchProducts
} = require('../models/repositories/product.repo')
//define Factory class to create product

class ProductFactory {
  static productRegistry = {}
  static registerProductType(type, classRef) {
    ProductFactory.productRegistry[type] = classRef
  }
  static createProduct = async (type, payload) => {
    const productClass = ProductFactory.productRegistry[type]
    if (!productClass)
      throw new BadRequestError({ message: 'invalid product type' })

    return new productClass(payload).createProduct()
  }

  //Query
  //Draft
  static async findAllDraftForShop({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop: product_shop, isDraft: true }
    return await findAllDraftForShop({ query, limit, skip })
  }

  //publish
  static async findAllPublishForShop({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop: product_shop, isDraft: false }
    return await findAllPublishForShop({ query, limit, skip })
  }

  static async searchProducts({ keySearch }) {
    return await searchProducts({ keySearch })
  }

  //PUT
  static async publishProductByShop({ product_shop, product_id }) {
    return await publishProductByShop({ product_shop, product_id })
  }

  static async unPublishProductByShop({ product_shop, product_id }) {
    return await unPublishProductByShop({ product_shop, product_id })
  }
  //End PUT
}

//define base product class
class Product {
  constructor({
    product_name,
    product_thumb,
    product_description,
    product_price,
    product_type,
    product_shop,
    product_attributes,
    product_quantity
  }) {
    ;(this.product_name = product_name),
      (this.product_thumb = product_thumb),
      (this.product_description = product_description),
      (this.product_price = product_price),
      (this.product_type = product_type),
      (this.product_shop = product_shop),
      (this.product_attributes = product_attributes),
      (this.product_quantity = product_quantity)
  }

  async createProduct(product_id) {
    return await product.create({ ...this, _id: product_id })
  }
}

//define sub-class for different product type clothing
class Clothing extends Product {
  async createProduct() {
    const newClothing = await clothing.create({
      ...this.product_attributes,
      product_shop: this.product_shop
    })
    if (!newClothing)
      throw new BadRequestError({ message: 'create new clothing error' })
    const newProduct = await super.createProduct(newClothing._id)

    if (!newProduct)
      throw new BadRequestError({ message: 'create new Product error' })

    return newProduct
  }
}

class Electronics extends Product {
  async createProduct() {
    const newElectronics = await electronics.create({
      ...this.product_attributes,
      product_shop: this.product_shop
    })
    if (!newElectronics)
      throw new BadRequestError({ message: 'create new electronics error' })
    const newProduct = await super.createProduct(newElectronics._id)

    if (!newProduct)
      throw new BadRequestError({ message: 'create new Product error' })

    return newProduct
  }
}

class Furniture extends Product {
  async createProduct() {
    const newFurniture = await electronics.create({
      ...this.product_attributes,
      product_shop: this.product_shop
    })
    if (!newFurniture)
      throw new BadRequestError({ message: 'create new furniture error' })
    const newProduct = await super.createProduct(newFurniture._id)

    if (!newProduct)
      throw new BadRequestError({ message: 'create new Product error' })

    return newProduct
  }
}

//register type

ProductFactory.registerProductType('Electronics', Electronics)
ProductFactory.registerProductType('Clothing', Clothing)
ProductFactory.registerProductType('Furniture', Furniture)

module.exports = ProductFactory
