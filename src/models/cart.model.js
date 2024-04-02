const { default: mongoose, Schema } = require('mongoose')

// Declare the Schema of the Mongo model
var cartSchema = new mongoose.Schema(
  {
    cart_state: {
      type: String,
      required: true,
      enum: ['active', 'complete', 'failed', 'pending'],
      default: 'active'
    },
    cart_products: {
      type: Array,
      required: true,
      default: []
    },
    /**
     * [
     *  {
     *      productId,
     *      shopId,
     *      quantity,
     *      name,
     *      price,
     *   }
     * ]
     *
     */
    cart_count_product: {
      type: Number,
      default: 0
    },
    cart_userId: {
      type: Number,
      required: true
    }
  },
  {
    timestamps: {
      createdAt: 'createdOn',
      updatedAt: 'modifiedOn'
    }
  }
)

//Export the model
module.exports = mongoose.model('Cart', cartSchema)
