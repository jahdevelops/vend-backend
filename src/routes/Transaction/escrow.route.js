const express = require("express");

const {
  getUsersEscrow,
} = require("../../controller/Transaction/escrow.controller");
const router = express.Router();

router.route("/").get(getUsersEscrow);

module.exports = router;
