const express = require("express");

const {
  getAllNotification,
  readNotification,
} = require("../controller/notification.controller");
const router = express.Router();

router.route("/").get(getAllNotification);
router.route("/:id").put(readNotification);

module.exports = router;
