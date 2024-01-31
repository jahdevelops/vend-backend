const { Router } = require("express");

const {
    editOrderStatus,
    getAllAssignedOrders,
    getSingleAssignedOrder
} = require('../../controller/courier/order.controller');

const router = Router();

router.route("/:id")
    .post(editOrderStatus)
    .get(getSingleAssignedOrder);
    
router.route("/").get(getAllAssignedOrders);

module.exports = router;