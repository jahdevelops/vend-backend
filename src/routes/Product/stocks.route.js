const express = require("express");
const {
  getProductStock,
} = require("../../controller/Products/stock.controller");
const router = express.Router();

router.route("/:id/product/:productId").get(getProductStock);

module.exports = router;
