const express = require("express");
const { becomeASeller } = require("../../controller/seller/seller.controller");
const router = express.Router();

router.route("/become").put(becomeASeller);

module.exports = router;