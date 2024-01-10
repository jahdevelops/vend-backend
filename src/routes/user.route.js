const express = require("express");
const {
    isAuthenticatedUser,
    checkVerified,
} = require("../middlewares/auth.middleware");
const { getMe, updateUser } = require("../controller/user.controller");
const router = express.Router();

router
    .route("/")
    .get(isAuthenticatedUser, checkVerified, getMe)
    .put(isAuthenticatedUser, checkVerified, updateUser);

module.exports = router;