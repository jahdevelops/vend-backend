const express = require("express");
const router = express.Router();
const { getAllOrders } = require("../../controller/seller/order.controller");

router.route("/").get(getAllOrders);

module.exports = router;
