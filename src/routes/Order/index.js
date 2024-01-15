const express = require("express");

const router = express.Router();
const cart = require("./cart.route");

router.use("/cart", cart);

module.exports = router;
