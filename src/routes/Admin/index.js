const { Router } = require("express");
const seller = require("./seller.route");
const product = require("./product.route");
const user = require("./user.route");

const router = Router();

router.use("/seller", seller);
router.use("/product", product);
router.use("/user", user);

module.exports = router;
