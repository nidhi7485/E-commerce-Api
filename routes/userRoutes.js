const express = require('express')

const router = express.Router()

const {
  authenticateUser,
  authorizePermission,
} = require('../middleware/authentication')
const {
  getAllUsers,
  getSingleUsers,
  showCurrentUser,
  updateUser,
  updateUserPassword,
} = require('../controllers/userController')

router
  .route('/')
  .get(authenticateUser, authorizePermission('admin'), getAllUsers)

router.route('/showMe').get(authenticateUser, showCurrentUser)
router.route('/updateUser').patch(authenticateUser, updateUser)
router.route('/updatePassword').patch(authenticateUser, updateUserPassword)
router.route('/:id').get(authenticateUser, getSingleUsers)
module.exports = router
