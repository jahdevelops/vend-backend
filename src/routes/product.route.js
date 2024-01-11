const express = require("express");
const router = express.Router();

// const {
//     isAuthenticatedUser,
//     checkVerified,
// } = require("../middlewares/auth.middleware");
const {
  indexProducts,
  getProduct,
} = require("../controller/product.controller");

router.route("/").get(indexProducts);
router.route("/:id").get(getProduct);

module.exports = router;
