const User = require('../models/User')
const { StatusCodes } = require('http-status-codes')
const customError = require('../errors')

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
  res.status(StatusCodes.OK).json({ user })
}
const showCurrentUser = async (req, res) => {
  res.send('current users')
}
const updateUser = async (req, res) => {
  res.send('update users')
}
const updateUserPassword = async (req, res) => {
  res.send('update users password')
}

module.exports = {
  getAllUsers,
  getSingleUsers,
  showCurrentUser,
  updateUser,
  updateUserPassword,
}
