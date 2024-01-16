const express = require("express");

const router = express.Router();
const cart = require("./cart.route");
const order = require("./order.route");

router.use("/cart", cart);
router.use("/", order);

module.exports = router;
