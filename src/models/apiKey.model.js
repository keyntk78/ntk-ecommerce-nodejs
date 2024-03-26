const { default: mongoose } = require('mongoose')

// Declare the Schema of the Mongo model
var apiKeySchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true
    },
    status: {
      type: Boolean,
      default: true
    },
    permissions: {
      type: [String],
      required: true,
      unique: ['0000', '1111', '2222']
    }
  },
  { timeseries: true }
)

//Export the model
module.exports = mongoose.model('ApiKey', apiKeySchema)
