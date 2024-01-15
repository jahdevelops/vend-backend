const express = require("express");
const {
  getProductInventory,
  createInventory,
  editProductInventory,
  deleteProductInventory,
  getAProductInventory,
} = require("../../controller/seller/Product/inventory.controller");
const router = express.Router();

router.route("/").post(createInventory);
router.route("/product/:id").get(getProductInventory);
router
  .route("/:id/product/:productId")
  .get(getAProductInventory)
  .put(editProductInventory)
  .delete(deleteProductInventory);

module.exports = router;
