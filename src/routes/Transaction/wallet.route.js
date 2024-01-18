const express = require("express");

const { getWallet } = require("../../controller/Transaction/wallet.controller");
const router = express.Router();

router.route("/").get(getWallet);

module.exports = router;
