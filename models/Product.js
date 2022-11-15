const mongoose = require('mongoose')

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, 'please provide product name'],
      maxlength: [100, 'Name cannot be more than 100 characters'],
    },
    price: {
      type: Number,
      required: [true, 'please provide product price'],
      default: 0,
    },
    description: {
      type: String,
      required: [true, 'please provide product description'],
      maxlength: [1000, 'description cannot be more than 1000 characters'],
    },
    image: {
      type: String,
      default: '/uploads/example.jpeg',
    },
    category: {
      type: String,
      required: [true, 'please provide product category'],
      enum: ['office', 'kitchen', 'bedroom'],
    },
    company: {
      type: String,
      required: [true, 'please provide company'],
      enum: {
        values: ['ikea', 'liddy', 'marcos'],
        message: '{VALUE} is not supported',
      },
    },
    colors: {
      type: [String],
      default: ['#222'],
      required: true,
    },
    color: {
      type: [String],
      required: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    freeShipping: {
      type: [String],
      required: true,
    },
    inventory: {
      type: Number,
      required: true,
      default: 15,
    },
    averageRateing: {
      type: Number,
      default: 0,
    },
    numberOfReview: {
      type: Number,
      default: 0,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true, toJSON: { vertuals: true }, toObject: { virtuals: true } }
)

// ProductSchema.virtual('reviews', {
//   ref: 'Review',
//   localField: '_id',
//   foreignField: 'product',
//   justOne: false,
// })

module.exports = mongoose.model('Product', ProductSchema)
