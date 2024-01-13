const express = require("express");
const router = express.Router();

const {
  getCategories,
  categoryInit,
} = require("../../controller/Products/categories.controller");

router.route("/").get(getCategories);
router.route("/init").post(categoryInit);

module.exports = router;
