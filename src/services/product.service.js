const { BadRequestError } = require('../helpers/ErrorResponse')
const { product, electronics, clothing } = require('../models/product.model')
const { insertInvetory } = require('../models/repositories/inventory.repo')
const {
  findAllDraftForShop,
  findAllPublishForShop,
  publishProductByShop,
  unPublishProductByShop,
  searchProducts,
  findAllProducts,
  findProduct,
  updateProductById
} = require('../models/repositories/product.repo')
const {
  removeUnderfinedObject,
  updateNestedObjectPaser
} = require('../utils/objectUtils')
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

  static updateProduct = async (type, product_id, payload) => {
    const productClass = ProductFactory.productRegistry[type]
    if (!productClass)
      throw new BadRequestError({ message: 'invalid product type' })

    return new productClass(payload).updateProduct(product_id)
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

  static async getAllProducts({
    limit = 50,
    sort = 'ctime',
    page = 1,
    filter = { isPublished: true },
    select = ['product_name', 'product_price', 'product_thumb', 'product_shop']
  }) {
    return await findAllProducts({
      limit,
      sort,
      page,
      filter,
      select
    })
  }

  static async findProduct({ product_id, unSelect = ['__v'] }) {
    return await findProduct({
      product_id,
      unSelect
    })
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

  async updateProduct(product_id, bodyUpdate) {
    return await updateProductById({
      product_id,
      bodyUpdate: bodyUpdate,
      model: product
    })
  }

  async createProduct(product_id) {
    const newProduct = await product.create({ ...this, _id: product_id })
    if (newProduct) {
      await insertInvetory({
        productId: newProduct._id,
        shopId: this.product_shop,
        stock: this.product_quantity
      })
    }

    return newProduct
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

  async updateProduct(product_id) {
    //remove atri has null and undefined
    const objectParam = removeUnderfinedObject(this)
    if (objectParam.product_attributes) {
      //update child
      await updateProductById({
        product_id,
        bodyUpdate: updateNestedObjectPaser(objectParam.product_attributes),
        model: clothing
      })
    }

    const updated = await super.updateProduct(
      product_id,
      updateNestedObjectPaser(objectParam)
    )
    return updated
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
