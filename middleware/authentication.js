const customError = require('../errors')

const { isValidToken } = require('../utils')

const authenticateUser = async (req, res, next) => {
  const token = req.signedCookies.token

  if (!token) {
    throw new customError.UnauthenticatedError('Authentication Invalid')
  }
  try {
    const { name, userId, role } = isValidToken({ token })
    req.user = { name, userId, role }
    next()
  } catch (error) {
    throw new customError.UnauthenticatedError('Authentication Invalid')
  }
}

const authorizePermission = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new customError.unauthorizedError(
        'unauthorized to access this route'
      )
    }
    next()
  }
}
module.exports = { authenticateUser, authorizePermission }
