const express = require("express");
const router = express.Router();
const {
  createOrder,
  editOrder,
  getAllOrder,
  deleteOrder,
  getOrder,
} = require("../../controller/Order/order.controller");

router.route("/").post(createOrder).get(getAllOrder);
router.route("/:id").put(editOrder).delete(deleteOrder).get(getOrder);

module.exports = router;
