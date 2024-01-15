const express = require("express");

const router = express.Router();
const seller = require("./seller.route");
const product = require("./product.route");
const inventory = require("./inventory.route");
const { authorizeRole } = require("../../middlewares/auth.middleware");

router.use("/", seller);
router.use("/product", authorizeRole("seller", "admin"), product);
router.use("/inventory", authorizeRole("seller", "admin"), inventory);

module.exports = router;
