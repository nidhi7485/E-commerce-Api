const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,

    required: [true, 'please provide email'],

    validate: {
      validator: validator.isEmail,
      message: 'please provide a valid email',
    },
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user',
  },
})
userSchema.pre('save', async function () {
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})
userSchema.methods.comparePassword = async function (candidatePassword) {
  const isMatch = await bcrypt.compare(this.password, candidatePassword)
  return isMatch
}
module.exports = mongoose.model('User', userSchema)
