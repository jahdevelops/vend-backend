const express = require("express");
const {
  getAllAddress,
  createAddress,
  editAddress,
  getAddress,
  deleteAddress,
} = require("../controller/address.controller");
const router = express.Router();

router.route("/").get(getAllAddress).post(createAddress);
router.route("/:id").put(editAddress).get(getAddress).delete(deleteAddress);

module.exports = router;
