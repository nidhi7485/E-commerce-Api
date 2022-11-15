const express = require('express')

const router = express.Router()

const {
  authenticateUser,
  authorizePermission,
} = require('../middleware/authentication')

const {
  getAllOrder,
  getSingleOrder,
  getCurrentUserOrder,
  createOrder,
  updateOrder,
} = require('../controllers/orderController')

router
  .route('/')
  .post(authenticateUser, createOrder)
  .get(authenticateUser, authorizePermission('admin'), getAllOrder)

router.route('/showAllMyOrder').get(authenticateUser, getCurrentUserOrder)

router
  .route('/:id')
  .get(authenticateUser, getSingleOrder)
  .patch(authenticateUser, updateOrder)

module.exports = router
