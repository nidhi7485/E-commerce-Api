const Review = require('../models/Order')
const Product = require('../models/Product')
const { StatusCodes } = require('http-status-codes')
const customError = require('../errors')
const {
  createTokenUser,
  attachCookiesToResponse,
  checkPermission,
} = require('../utils')
const Order = require('../models/Order')

const fakeStripeAPI = async ({ amount, currency }) => {
  const client_Secret = 'someRandomValue'
  return { client_Secret, amount }
}

const getAllOrder = async (req, res) => {
  const order = await Order.find()
  res.status(StatusCodes.OK).json({ order, count: order.length })
}
const getSingleOrder = async (req, res) => {
  const { id: orderId } = req.params
  const order = await Order.findOne({ _id: orderId })
  if (!order) {
    throw new customError.NotFoundError(`no order with id ${orderId}`)
  }
  checkPermission(req.user, order.user)
  res.status(StatusCodes.OK).json({ order })
}
const getCurrentUserOrder = async (req, res) => {
  const order = await Order.find({ user: req.user.userId })
  res.status(StatusCodes.OK).json({ order })
}
const createOrder = async (req, res) => {
  const { items: cartItems, tax, shippingFee } = req.body
  if (!cartItems || cartItems.length < 1) {
    throw new customError.BadRequestError('No cart item provided')
  }
  if (!tax || !shippingFee) {
    throw new customError.BadRequestError('please provide tax and shippinf fee')
  }
  let orderItems = []
  let subTotal = 0
  for (const item of cartItems) {
    const dbProduct = await Product.findOne({ _id: item.product })
    if (!dbProduct) {
      throw new customError.NotFoundError(`No product with id ${dbProduct}`)
    }
    const { name, price, image, _id } = dbProduct
    const singleOrderItem = {
      amount: item.amount,
      name,
      price,
      image,
      product: _id,
    }
    // add item to order
    orderItems = [...orderItems, singleOrderItem]
    subTotal += item.amount * price
  }
  const total = tax + shippingFee + subTotal
  const paymentIntent = await fakeStripeAPI({
    amount: total,
    currency: 'usd',
  })
  const order = await Order.create({
    orderItems,
    total,
    subTotal,
    tax,
    shippingFee,
    clientSecret: paymentIntent.client_Secret,
    user: req.user.userId,
  })
  res
    .status(StatusCodes.CREATED)
    .json({ order, clientSecret: order.clientSecret })
}
const updateOrder = async (req, res) => {
  const { id: orderId } = req.params
  const { paymentIntentId } = req.body
  const order = await Order.findOne({ _id: orderId })
  if (!order) {
    throw new customError.NotFoundError(`no order with id ${orderId}`)
  }
  checkPermission(req.user, order.user)
  order.paymentIntentId = paymentIntentId
  order.status = 'paid'
  await order.save()
  res.status(StatusCodes.OK).json({ order })
}

module.exports = {
  getAllOrder,
  getSingleOrder,
  getCurrentUserOrder,
  createOrder,
  updateOrder,
}
