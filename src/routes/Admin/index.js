const { Router } = require("express");
const seller = require("./seller.route");

const router = Router();

router.use("/seller", seller);

module.exports = router;
