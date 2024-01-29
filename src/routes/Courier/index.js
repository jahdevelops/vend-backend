const { Router } = require("express");
const order = require('./order.route');

const router = Router();

router.use("/order", order);

module.exports = router;