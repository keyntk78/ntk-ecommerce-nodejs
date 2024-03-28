const { default: mongoose, Schema } = require('mongoose')

// Declare the Schema of the Mongo model
var inventorychema = new mongoose.Schema(
  {
    inven_productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product'
    },
    inven_location: {
      type: String,
      default: 'unKnow'
    },
    inven_stock: {
      type: Number,
      required: true
    },
    inven_shopId: {
      type: Schema.Types.ObjectId,
      ref: 'Shop'
    },
    inven_reservations: {
      type: Array,
      default: []
    }
  },
  { timestamps: true }
)

//Export the model
module.exports = mongoose.model('Inventory', inventorychema)
