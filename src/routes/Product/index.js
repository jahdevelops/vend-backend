const express = require("express");

const router = express.Router();
const brands = require("./brands.route");
const categories = require("./categories.route");
const product = require("./product.route");
const inventory = require("./inventory.route");

router.use("/product", product);
router.use("/brands", brands);
router.use("/categories", categories);
router.use("/inventory", inventory);

module.exports = router;
