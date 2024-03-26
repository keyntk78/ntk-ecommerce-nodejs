const { default: mongoose } = require('mongoose')

// Declare the Schema of the Mongo model
var keyTokenSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Shop'
    },
    publicKey: {
      type: String,
      required: true
    },
    privateKey: {
      type: String,
      required: true
    },
    refreshTokensUsed: {
      type: Array,
      default: [] // những RT đã được sử dụng
    },
    refreshToken: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
)

//Export the model
module.exports = mongoose.model('Key', keyTokenSchema)
