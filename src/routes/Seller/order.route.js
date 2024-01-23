const express = require("express");
const router = express.Router();
const {
  getAllOrders,
  getOrder,
} = require("../../controller/seller/order.controller");

router.route("/").get(getAllOrders);
router.route("/:id").get(getOrder);

module.exports = router;
