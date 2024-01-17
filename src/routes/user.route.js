const express = require("express");
const { getMe, updateUser } = require("../controller/user.controller");
const address = require("./address.route");
const {
  isAuthenticatedUser,
  checkVerified,
} = require("../middlewares/auth.middleware");
const router = express.Router();

router.route("/").get(getMe).put(updateUser);
router.use("/address", isAuthenticatedUser, checkVerified, address);

module.exports = router;
