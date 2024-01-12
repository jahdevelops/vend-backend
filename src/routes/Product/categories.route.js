const express = require("express");
const router = express.Router();

const {
  getCategories,
} = require("../../controller/Products/categories.controller");

router.route("/").get(getCategories);

module.exports = router;
