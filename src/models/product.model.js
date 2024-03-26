const { default: mongoose, Schema } = require('mongoose')
const slugify = require('slugify')
// Declare the Schema of the Mongo model
var productSchema = new mongoose.Schema(
  {
    product_name: {
      type: String,
      required: true
    },
    product_slug: {
      type: String
    },
    product_thumb: {
      type: String,
      required: true
    },
    product_description: {
      type: String
    },
    product_price: {
      type: Number,
      required: true
    },
    product_quantity: {
      type: Number,
      required: true
    },
    product_type: {
      type: String,
      required: true,
      enum: ['Electronics', 'Clothing', 'Furniture']
    },
    product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' },
    product_attributes: { type: Schema.Types.Mixed, required: true },
    product_ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be above 5.0'],
      set: (val) => Math.round(val * 10) / 10
    },
    product_variations: { type: Array, default: [] },
    isDraft: { type: Boolean, default: true, index: true, select: false },
    isPublished: { type: Boolean, default: false, index: true, select: false }
  },
  { timestamps: true }
)

//create index
productSchema.index({
  product_name: 'text',
  product_description: 'text'
})

//Document middleware
productSchema.pre('save', function (next) {
  this.product_slug = slugify(this.product_name, { lower: true })
  next()
})

//define the product type = Electronics

const electronicsSchema = new mongoose.Schema(
  {
    manufacturer: { type: String, required: true },
    model: { type: String },
    color: { type: String },
    product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' }
  },
  { timestamps: true }
)

//define the product type = Clothing

const clothingSchema = new mongoose.Schema(
  {
    brand: { type: String, required: true },
    size: { type: String },
    material: { type: String },
    product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' }
  },
  { timestamps: true }
)

const furnitureSchema = new mongoose.Schema(
  {
    brand: { type: String, required: true },
    size: { type: String },
    material: { type: String },
    product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' }
  },
  { timestamps: true }
)

module.exports = {
  product: mongoose.model('Product', productSchema),
  clothing: mongoose.model('Clothing', clothingSchema),
  furniture: mongoose.model('Furniture', furnitureSchema),

  electronics: mongoose.model('Electronic', electronicsSchema)
}
