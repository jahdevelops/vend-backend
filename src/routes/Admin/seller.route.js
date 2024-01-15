const express = require("express");

const {
  getPendingSellers,
  approveNewSeller,
  getAllSellers,
} = require("../../controller/Admin/seller.controler");
const router = express.Router();
router.route("/").get(getAllSellers);
router.route("/pending").get(getPendingSellers);
router.route("/pending/approve/:id").put(approveNewSeller);

module.exports = router;
