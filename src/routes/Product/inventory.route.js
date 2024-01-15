const express = require("express");
const {
  getProductInventory,
  getAProductInventory,
} = require("../../controller/Products/inventory.controller");
const router = express.Router();
router.route("/product/:id").get(getProductInventory);
router.route("/:id/product/:productId").get(getAProductInventory);

module.exports = router;
