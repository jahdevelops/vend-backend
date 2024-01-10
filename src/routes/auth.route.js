const express = require("express");
const router = express.Router();

const {
  register,
  login,
  verifyEmail,
  requestEmailVerification,
  logout,
  requestPasswordReset,
  resetPassword,
  updatePassword,
  refreshToken,
} = require("../controller/auth.controller");
const {
  isAuthenticatedUser,
  checkVerified,
} = require("../middlewares/auth.middleware");

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").delete(logout);
router.route("/refresh").get(refreshToken);
router.route("/email").post(verifyEmail).get(requestEmailVerification);
router.route("/password/reset").get(requestPasswordReset).put(resetPassword);
router
  .route("/password/update")
  .put(isAuthenticatedUser, checkVerified, updatePassword);
module.exports = router;
