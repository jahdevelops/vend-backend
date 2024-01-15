const express = require("express");
const router = express.Router();

const {
  getCart,
  addToCart,
  removeFromCart,
} = require("../../controller/Order/cart.controller");

router.route("/").get(getCart).post(addToCart).delete(removeFromCart);

module.exports = router;
