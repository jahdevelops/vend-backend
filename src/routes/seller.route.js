const express = require('express')
const { isAuthenticatedUser, checkVerified } = require('../middlewares/auth.middleware')
const { becomeASeller } = require('../controller/seller.controller')
const router = express.Router()

router.route('/become').put(isAuthenticatedUser, checkVerified, becomeASeller)

module.exports = router