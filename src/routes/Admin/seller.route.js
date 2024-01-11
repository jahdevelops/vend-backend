const express = require("express");

const {
  getPendingSellers,
  approveNewSeller,
} = require("../../controller/Admin/seller.controler");
const router = express.Router();

router.route("/pending").get(getPendingSellers);
router.route("/pending/approve/:id").put(approveNewSeller);

module.exports = router;
