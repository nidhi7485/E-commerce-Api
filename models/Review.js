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

reviewSchema.statics.calculateAverageRateing = async function (productId) {
  const result = await this.aggregate([
    { $match: { product: productId } },
    {
      $group: {
        _id: null,
        averageRating: { $avg: '$rating' },
        numOfReviews: { $sum: 1 },
      },
    },
  ])
  console.log(result)
  try {
    await this.model('Product').findOneAndUpdate(
      { _id: productId },
      {
        averageRating: Math.ceil(result[0]?.averageRating || 0),
        numOfReviews: result[0]?.averageRating || 0,
      }
    )
  } catch (error) {
    console.log(error)
  }
}

reviewSchema.post('save', async function () {
  await this.constructor.calculateAverageRateing(this.product)
})
reviewSchema.post('remove', async function () {
  await this.constructor.calculateAverageRateing(this.product)
})

module.exports = mongoose.model('Raview', reviewSchema)
