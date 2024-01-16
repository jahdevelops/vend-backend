const express = require("express");
const router = express.Router();

const {
  getCart,
  addToCart,
  removeFromCart,
  editCart,
} = require("../../controller/Order/cart.controller");

router
  .route("/")
  .get(getCart)
  .post(addToCart)
  .delete(removeFromCart)
  .put(editCart);

module.exports = router;
