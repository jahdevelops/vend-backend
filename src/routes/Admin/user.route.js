const express = require("express");

const {
  getAllUsers,
  getUser,
} = require("../../controller/Admin/user.controller");
const router = express.Router();

router.route("/").get(getAllUsers);
router.route("/:id").get(getUser);

module.exports = router;
