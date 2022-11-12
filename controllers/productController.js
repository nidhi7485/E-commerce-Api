const { StatusCodes } = require('http-status-codes')
const customError = require('../errors')
const Product = require('../models/Product')
const path = require('path')
const { off } = require('process')
const createProducts = async (req, res) => {
  req.body.user = req.user.userId
  const product = await Product.create(req.body)

  res.status(StatusCodes.CREATED).json({ product })
}

const getAllProducts = async (req, res) => {
  const product = await Product.find()
  res.status(StatusCodes.OK).json({ count: product.length, product })
}

const getSingleProduct = async (req, res) => {
  const { id: productId } = req.params
  const product = await Product.findOne({ _id: productId })
  if (!product) {
    throw new customError.NotFoundError(`No product found with id ${productId}`)
  }
  res.status(StatusCodes.OK).json({ product })
}
const updateProduct = async (req, res) => {
  const { id: productId } = req.params
  const product = await Product.findOneAndUpdate({ _id: productId }, req.body, {
    new: true,
    runValidators: true,
  })
  if (!product) {
    throw new customError.NotFoundError(`No product found with id ${productId}`)
  }
  res.status(StatusCodes.OK).json({ product })
}
const deleteProduct = async (req, res) => {
  const { id: productId } = req.params
  const product = await Product.findOne({ _id: productId })
  if (!product) {
    throw new customError.NotFoundError(
      `product is not found with id ${productId}`
    )
  }
  product.remove()
  res.status(StatusCodes.OK).json({ msg: 'success! removed product' })
}
const uploadImage = async (req, res) => {
  if (!req.files) {
    throw new customError.BadRequestError('No file uploaded')
  }
  const productImage = req.files.image
  if (!productImage.mimetype.startsWith('image')) {
    throw new customError.BadRequestError('please upload image')
  }
  const maxSize = 1024 * 1024
  if (productImage.size > maxSize) {
    throw new customError.BadRequestError(
      'please upload image smaller than 1MB '
    )
  }
  const imagePath = path.join(
    __dirname,
    '../public/uploads/' + `${productImage.name}`
  )
  await productImage.mv(imagePath)
  res.status(StatusCodes.OK).json({ image: `/uploads/${productImage.name}` })
  res.send('upload image')
}

module.exports = {
  createProducts,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
}
