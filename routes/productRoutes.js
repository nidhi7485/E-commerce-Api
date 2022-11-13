const express = require('express')

const router = express.Router()

const {
  authenticateUser,
  authorizePermission,
} = require('../middleware/authentication')

const {
  createProducts,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
} = require('../controllers/productController')
const { getSingleProductReview } = require('../controllers/reviewController')
router
  .route('/')
  .post([authenticateUser, authorizePermission('admin')], createProducts)
  .get(getAllProducts)

router
  .route('/uploadImage')
  .post([authenticateUser, authorizePermission('admin'), uploadImage])

router
  .route('/:id')
  .get(getSingleProduct)
  .patch([authenticateUser, authorizePermission('admin')], updateProduct)
  .delete([authenticateUser, authorizePermission('admin'), deleteProduct])

router.route('/:id/reviews').get(getSingleProductReview)
module.exports = router
