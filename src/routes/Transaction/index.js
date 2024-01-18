const express = require("express");
const transaction = require("./transaction.route");
const wallet = require("./wallet.route");
const balance = require("./balance.route");
const escrow = require("./escrow.route");
const {
  isAuthenticatedUser,
  checkVerified,
} = require("../../middlewares/auth.middleware");
const router = express.Router();

router.use("/", transaction);
router.use("/wallet", isAuthenticatedUser, checkVerified, wallet);
router.use("/balance", isAuthenticatedUser, checkVerified, balance);
router.use("/escrow", isAuthenticatedUser, checkVerified, escrow);

module.exports = router;
