const express = require("express");

const {
  getAllOrders,
  getOrder,
} = require("../../controller/Admin/order.controller");
const router = express.Router();

router.route("/").get(getAllOrders);
router.route("/:id").get(getOrder);

module.exports = router;
