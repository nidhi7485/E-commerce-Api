const User = require('../models/User')
const { StatusCodes } = require('http-status-codes')
const customError = require('../errors')
const {
  createTokenUser,
  attachCookiesToResponse,
  checkPermission,
} = require('../utils')

const getAllUsers = async (req, res) => {
  const users = await User.find().select('-password')
  res.status(StatusCodes.OK).json({ users })
}
const getSingleUsers = async (req, res) => {
  const user = await User.findOne({ _id: req.params.id }).select('-password')
  if (!user) {
    throw new customError.NotFoundError(
      `No user found with this Id:${req.params.id}`
    )
  }
  checkPermission(req.user, user._id)
  res.status(StatusCodes.OK).json({ user })
}
const showCurrentUser = async (req, res) => {
  res.status(StatusCodes.OK).json({ user: req.user })
}
const updateUser = async (req, res) => {
  const { name, email } = req.body
  if (!name || !email) {
    throw new customError.BadRequestError('please provide name or email')
  }
  const user = await User.findOneAndUpdate(
    { _id: req.user.userId },
    { email, name },
    { new: true, runValidators: true }
  )
  const tokenUser = createTokenUser(user)
  attachCookiesToResponse({ res, user: tokenUser })
  res.status(StatusCodes.OK).json({ user: tokenUser })
}
const updateUserPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body
  if (!oldPassword || !newPassword) {
    throw new customError.BadRequestError('please provide both values')
  }
  const user = await User.findOne({ _id: req.user.userId })
  const isPasswordCorrect = await user.comparePassword(oldPassword)
  if (!isPasswordCorrect) {
    throw new customError.UnauthenticatedError('invalid credential')
  }
  user.password = newPassword
  await user.save()
  res.status(StatusCodes.OK).json({ msg: 'success! password updated' })
}

module.exports = {
  getAllUsers,
  getSingleUsers,
  showCurrentUser,
  updateUser,
  updateUserPassword,
}
