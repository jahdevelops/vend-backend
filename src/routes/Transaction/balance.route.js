const express = require("express");

const {
  getBalance,
} = require("../../controller/Transaction/balance.controller");
const router = express.Router();

router.route("/:id/wallet/:walletId").get(getBalance);

module.exports = router;
