const jwt = require('jsonwebtoken')

const creatJwt = ({ payload }) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  })
  return token
}

const isValidToken = ({ token }) => jwt.verify(token, process.env.JWT_SECRET)

module.exports = {
  creatJwt,
  isValidToken,
}
