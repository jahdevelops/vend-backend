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
} = require("../controller/auth.controller");

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").delete(logout);
router.route("/email").post(verifyEmail).get(requestEmailVerification);
router.route("/password/reset").get(requestPasswordReset).put(resetPassword);
module.exports = router;
