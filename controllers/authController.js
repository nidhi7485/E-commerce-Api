const User = require('../models/User')
const { StatusCodes } = require('http-status-codes')
const {
  CustomAPIError,
  UnauthenticatedError,
  NotFoundError,
  BadRequestError,
} = require('../errors')
const { attachCookiesToResponse, createTokenUser } = require('../utils')

const register = async (req, res) => {
  const { email, name, password } = req.body
  const emailAlreayExist = await User.findOne({ email })
  if (emailAlreayExist) {
    throw new BadRequestError('email already exists')
  }
  const firstAccount = (await User.countDocuments({})) === 0
  const role = firstAccount ? 'admin' : 'user'
  const user = await User.create({ name, email, password, role })
  const userToken = createTokenUser(user)
  attachCookiesToResponse({ res, user: userToken })
  res.status(StatusCodes.CREATED).json({ user: userToken })
}

const logIn = async (req, res, next) => {
  const { email, password } = req.body
  if (!email || !password) {
    throw new BadRequestError('please provide email or password')
  }
  const user = await User.findOne({ email })
  if (!user) {
    throw new UnauthenticatedError('invalid email')
  }
  const isPasswordIsCorrect = await user.comparePassword(password)
  if (!isPasswordIsCorrect) {
    throw new UnauthenticatedError('invalid password')
  }
  const userToken = createTokenUser(user)
  attachCookiesToResponse({ res, user: userToken })
  res.status(StatusCodes.CREATED).json({ user: userToken })
}
const logOut = async (req, res) => {
  res.cookie('token', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now()),
  })
  res.status(StatusCodes.OK).json({ msg: 'user logged out!' })
}

module.exports = {
  register,
  logIn,
  logOut,
}
