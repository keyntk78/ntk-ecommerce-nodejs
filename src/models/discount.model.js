const { toNumber } = require('lodash')
const { default: mongoose, Schema } = require('mongoose')

// Declare the Schema of the Mongo model
var discountSchema = new mongoose.Schema(
  {
    discount_name: {
      type: String,
      required: true
    },
    discount_description: {
      type: String
    },
    discount_type: {
      type: String,
      default: 'fixed_amount' //percentage theo % || fixed_amount theo tiền
    },
    discount_value: {
      type: Number
    },
    discount_code: {
      type: String,
      required: true
    },
    discount_start_date: {
      type: Date,
      required: true
    }, // ngày bắt đầu
    discount_end_date: {
      type: Date,
      required: true
    }, // ngày kết thúc
    discount_max_uses: {
      type: Number,
      required: true
    }, // số lượng discount được áp dụng
    discount_uses_count: {
      type: Number,
      required: true
    }, //  discount đã sử dụng
    discount_users_used: {
      type: Array,
      default: []
    },
    discount_max_uses_per_user: {
      type: Number,
      required: true
    }, // Số lượng cho phép tối đa được sử dụng mỗi user
    discount_min_order_value: {
      type: Number,
      required: true
    },
    discount_shopId: {
      type: Schema.Types.ObjectId,
      ref: 'Shop'
    },
    discount_is_active: { type: Boolean, default: true },
    discount_applies_to: {
      type: String,
      required: true,
      enum: ['all', 'specific']
    },
    discount_product_ids: { type: Array, default: [] } // số sản phẩm được áp dụng
  },
  { timestamps: true }
)

//Export the model
module.exports = mongoose.model('Discount', discountSchema)
