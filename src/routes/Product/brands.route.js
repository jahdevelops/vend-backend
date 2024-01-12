const express = require("express");
const router = express.Router();

const { getBrands } = require("../../controller/Products/brand.contoller");

router.route("/").get(getBrands);

module.exports = router;
