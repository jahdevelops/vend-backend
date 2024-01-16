const express = require("express");
const router = express.Router();
const {
  createOrder,
  editOrder,
  getAllOrder,
  deleteOrder,
} = require("../../controller/Order/order.controller");

router.route("/").post(createOrder).get(getAllOrder);
router.route("/:id").put(editOrder).delete(deleteOrder);

module.exports = router;
