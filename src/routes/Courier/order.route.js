/* eslint-disable no-unused-vars */
const { Router } = require("express");
const order = require("./order.route");

const {
  editOrderStatus,
} = require("../../controller/courier/order.controller");

const router = Router();

router.route("/:id").post(editOrderStatus);

module.exports = router;
