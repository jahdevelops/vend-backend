const express = require("express");
const {
  initialize,
  post,
  getTransaction,
} = require("../../controller/Transaction/transaction.controller");
const router = express.Router();

// router.route("/").post(createInventory);
router.route("/order/:id").get(initialize);
router.route("/post").get(post);
router.route("/retrieve/:id").get(getTransaction);

module.exports = router;
