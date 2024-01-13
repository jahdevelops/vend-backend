const express = require("express");
const router = express.Router();

const {
  getBrands,
  brandInit,
} = require("../../controller/Products/brand.contoller");

router.route("/").get(getBrands);
router.route("/init").post(brandInit);

module.exports = router;
