const Review = require('../models/Review')
const Product = require('../models/Product')
const { StatusCodes } = require('http-status-codes')
const customError = require('../errors')
const {
  createTokenUser,
  attachCookiesToResponse,
  checkPermission,
} = require('../utils')

const createReview = async (req, res) => {
  const { product: productId } = req.body

  const isProductValid = await Product.findOne({ _id: productId })
  if (!isProductValid) {
    throw new customError.NotFoundError(`No product is with id ${productId}`)
  }
  const alreadySubmitted = await Review.findOne({
    _id: productId,
    user: req.user.userId,
  })

  if (alreadySubmitted) {
    throw new customError.BadRequestError(
      'review already submitted for this product'
    )
  }

  req.body.user = req.user.userId
  const review = await Review.create(req.body)
  res.status(StatusCodes.CREATED).json({ review })
}
const getAllReview = async (req, res) => {
  const review = await Review.find().populate({
    path: 'product',
    select: 'name company price',
  })
  res.status(StatusCodes.OK).json({ review })
}
const getSingleReview = async (req, res) => {
  const { id: reviewId } = req.params
  const review = await Review.findOne({ _id: reviewId })
  if (!review) {
    throw new customError.NotFoundError(`No review with this id ${reviewId}`)
  }
  res.status(StatusCodes.OK).json({ review })
}
const updateReview = async (req, res) => {
  const { id: reviewId } = req.params
  const { rating, title, comment } = req.body

  const review = await Review.findOne({ _id: reviewId })
  if (!review) {
    throw new customError.NotFoundError(`No review with this id ${reviewId}`)
  }
  checkPermission(req.user, review.user)
  review.rating = rating
  review.title = title
  review.comment = comment
  await review.save()
  res.status(StatusCodes.OK).json({ review })
}
const deleteReview = async (req, res) => {
  const { id: reviewId } = req.params
  const review = await Review.findOne({ _id: reviewId })
  if (!review) {
    throw new customError.NotFoundError(`No review with this id ${reviewId}`)
  }
  checkPermission(req.user, review.user)
  await review.remove()
  res.status(StatusCodes.OK).json({ msg: 'success! review removed' })
}

const getSingleProductReview = async (req, res) => {
  const { id: product_Id } = req.params
  const reviews = await Review.find({ product: product_Id })
  res.status(StatusCodes.OK).json({ reviews, count: reviews.length })
}
module.exports = {
  createReview,
  getAllReview,
  getSingleReview,
  updateReview,
  deleteReview,
  getSingleProductReview,
}
