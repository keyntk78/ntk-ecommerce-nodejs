const { default: mongoose } = require('mongoose')

// Declare the Schema of the Mongo model
var shopchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'inactive'
    },
    verfify: {
      type: Boolean,
      default: false
    },
    roles: {
      type: Array,
      default: []
    }
  },
  { timestamps: true }
)

//Export the model
module.exports = mongoose.model('Shop', shopchema)
