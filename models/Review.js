const mongoose = require('mongoose')

const reviewSchema = mongoose.Schema(
  {
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, 'please provide rating'],
    },
    title: {
      type: String,
      trime: true,
      required: [true, 'please provide review title'],
      maxlength: 100,
    },
    comment: {
      type: String,
      required: [true, 'please provide review text'],
      maxlength: 100,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
    product: {
      type: mongoose.Schema.ObjectId,
      ref: 'Product',
      require: true,
    },
  },
  { timesStamps: true }
)
reviewSchema.index({ product: 1, user: 1 }, { unique: true })

module.exports = mongoose.model('Raview', reviewSchema)
