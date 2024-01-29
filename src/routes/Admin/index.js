const { Router } = require("express");
const seller = require("./seller.route");
const product = require("./product.route");
const user = require("./user.route");
const order = require("./order.route");
const transaction = require("./transaction.route");

const router = Router();

router.use("/seller", seller);
router.use("/product", product);
router.use("/user", user);
router.use("/order", order);
router.use("/transaction", transaction);

module.exports = router;
