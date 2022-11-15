const express = require('express')

const router = express.Router()

const {
  authenticateUser,
  authorizePermission,
} = require('../middleware/authentication')
