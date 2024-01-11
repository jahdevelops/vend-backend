const express = require("express");
const { getMe, updateUser } = require("../controller/user.controller");
const router = express.Router();

router.route("/").get(getMe).put(updateUser);

module.exports = router;