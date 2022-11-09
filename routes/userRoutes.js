const express = require('express')

const router = express.Router()

const {
  getAllUsers,
  getSingleUsers,
  showCurrentUser,
  updateUser,
  updateUserPassword,
} = require('../controllers/userController')

router.route('/').get(getAllUsers)
router.route('/:id').get(getSingleUsers)
router.route('/showMe').get(showCurrentUser)
router.route('/updateUser').patch(updateUser)
router.route('/updatePassword').patch(updateUserPassword)

module.exports = router
