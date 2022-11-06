const User = require('../models/User')
const { StatusCodes } = require('http-status-codes')
const CustomError = require('../errors')
const { creatJwt } = require('../utils')
const register = async (req, res) => {
  const { email, name, password } = req.body
  const emailAlreayExist = await User.findOne({ email })
  if (emailAlreayExist) {
    throw new CustomError.BadRequestError('email already exists')
  }
  const firstAccount = (await User.countDocuments({})) === 0
  const role = firstAccount ? 'admin' : 'user'
  const user = await User.create({ name, email, password, role })
  const userToken = { name: user.name, userId: user._id, role: user.role }
  const token = creatJwt({ payload: userToken })
  const oneDay = 1000 * 60 * 60 * 24
  res.cookie('token', token, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
  })
  res.status(StatusCodes.CREATED).json({ user: userToken })
}

const logIn = async (req, res) => {
  res.send('login')
}
const logOut = async (req, res) => {
  res.send('logout')
}

module.exports = {
  register,
  logIn,
  logOut,
}
