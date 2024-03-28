/**
 * Discount servcice
 * 1 - Generator Discount Code [shop || admin]
 * 2 - Get discout amount [User]
 * 3 - Get all discount codes [User || shop]
 * 4 - verify discount code [user]
 * 5 - Delete discount code [shop || admin]
 * 6 - Canccess discount code [user]
 *
 */

const { BadRequestError } = require('../helpers/ErrorResponse')
const discountModel = require('../models/discount.model')
const { convertToObjectDbMongodb } = require('../utils/objectUtils')
const { findAllProducts } = require('../models/repositories/product.repo')
const {
  finalAllDiscountCodeUnSelect,
  checkDiscountExist
} = require('../models/repositories/discount.repo')
class DiscountService {
  static async createDiscountCode(body) {
    const {
      code,
      start_date,
      end_date,
      is_active,
      shop_id,
      min_order_value,
      product_ids,
      applies_to,
      name,
      description,
      type,
      value,
      users_used,
      max_value,
      max_uses,
      uses_count,
      max_uses_per_user
    } = body

    if (new Date() < new Date(start_date) || new Date() > new Date(end_date)) {
      throw new BadRequestError({ message: 'Discount code has expried' })
    }

    if (new Date(start_date) >= new Date(end_date)) {
      throw new BadRequestError({
        message: 'Start date must be before end date'
      })
    }
    //create index for discount code
    const foundDiscount = await discountModel
      .findOne({
        discount_code: code,
        discount_shopId: convertToObjectDbMongodb(shop_id)
      })
      .lean()

    if (foundDiscount && foundDiscount.discount_is_active === true) {
      throw new BadRequestError({
        message: 'Discount existed'
      })
    }

    const newDiscount = new discountModel({
      discount_code: code,
      discount_name: name,
      discount_description: description,
      discount_type: type,
      discount_value: value,
      discount_start_date: new Date(start_date),
      discount_end_date: new Date(end_date),
      discount_min_order_value: min_order_value || 0,
      discount_max_value: max_value,
      discount_max_uses: max_uses,
      discount_uses_count: uses_count,
      discount_users_used: users_used,
      discount_shopId: shop_id,
      discount_max_uses_per_user: max_uses_per_user,
      discount_is_active: is_active,
      discount_applies_to: applies_to,
      discount_product_ids: applies_to === 'all' ? [] : product_ids
    })

    return newDiscount
  }

  //   Gell all discount codes available with product
  static async getAllDiscountCodesWithProduct({
    code,
    shop_id,
    user_id,
    limit,
    page
  }) {
    const foundDiscount = await discountModel
      .findOne({
        discount_code: code,
        discount_shopId: convertToObjectDbMongodb(shop_id)
      })
      .lean()

    if (!foundDiscount || !foundDiscount.discount_is_active) {
      throw new BadRequestError({
        message: 'Discount not existed'
      })
    }

    const { discount_applies_to, discount_product_ids } = foundDiscount

    let products
    if (discount_applies_to === 'all') {
      //get all product
      products = await findAllProducts({
        filter: {
          product_shop: convertToObjectDbMongodb(shop_id),
          isPublished: true
        },
        limit: +limit,
        page: +page,
        sort: 'ctime',
        select: ['product_name']
      })
    }

    if (discount_applies_to === 'specific') {
      products = await findAllProducts({
        filter: {
          _id: { $in: discount_product_ids },
          isPublished: true
        },
        limit: +limit,
        page: +page,
        sort: 'ctime',
        select: ['product_name']
      })
    }
  }

  //Get all discount code of shop
  static async getAllDiscountCodesByShop({ limit, page, shop_id }) {
    const discount = finalAllDiscountCodeUnSelect({
      limit: +limit,
      page: +page,
      filter: {
        discount_shopId: convertToObjectDbMongodb(shop_id),
        discount_is_active: true
      },
      unSelect: ['_v', 'discount_shopId'],
      model: discount
    })

    return discount
  }

  static async getDiscountAmount({ codeId, user_id, shop_id, products }) {
    const foundDiscount = await checkDiscountExist({
      model: discount,
      filter: {
        discount_code: codeId,
        discount_shopId: convertToObjectDbMongodb(shop_id)
      }
    })

    if (!foundDiscount) {
      throw new BadRequestError({ message: 'Discount not existed!' })
    }
    const {
      discount_is_active,
      discount_max_uses,
      discount_start_date,
      discount_end_date,
      discount_min_order_value,
      discount_max_uses_per_user,
      discount_users_used,
      discount_type,
      discount_value
    } = foundDiscount
    if (!discount_is_active) {
      throw new BadRequestError({ message: 'Discount expried!' })
    }
    if (!discount_max_uses) {
      throw new BadRequestError({ message: 'Discount are out!' })
    }

    if (
      new Date() < new Date(discount_start_date) ||
      new Date() > new Date(discount_end_date)
    ) {
      throw new BadRequestError({ message: 'Discount expried!' })
    }

    //check giá trị tối thiểu
    let totalOrder = 0
    if (discount_min_order_value > 0) {
      totalOrder = products.reduce(
        acc,
        (product) => {
          return acc + product.quantity * product.price
        },
        0
      )

      if (totalOrder < discount_min_order_value) {
        throw new BadRequestError({
          message: `Discount require a minium order value of ${discount_min_order_value}!`
        })
      }
    }

    if (discount_max_uses_per_user > 0) {
      const userUserDiscount = discount_users_used.find(
        (user) => (user.UserId === user.userId) === user_id
      )
      if (userUserDiscount) {
      }
    }

    //check xem discount nay là fixed amount
    const amount =
      discount_type === 'fixed_amount'
        ? discount_value
        : totalOrder * (discount_value / 100)

    return {
      totalOrder,
      discount: amount,
      totalPrice: totalOrder - amount
    }
  }

  static async deleteDiscount({ shop_id, code_id }) {
    const deleted = await discountModel.findOneAndDelete({
      discount_code: code_id,
      discount_shopId: convertToObjectDbMongodb(shop_id)
    })

    return deleted
  }

  static async cancelDiscountCode({ shop_id, code_id, user_id }) {
    const foundDiscount = await checkDiscountExist({
      model: discountModel,
      filter: {
        discount_code: code_id,
        discount_shopId: convertToObjectDbMongodb(shop_id)
      }
    })

    if (!foundDiscount) {
      throw new BadRequestError({ message: 'Discount not existed!' })
    }

    const result = await discountModel.findByIdAndUpdate(foundDiscount._id, {
      $pull: { discount_users_used: user_id },
      $inc: {
        discount_max_uses: 1,
        discount_uses_count: -1
      }
    })

    return result
  }
}

module.exports = DiscountService
