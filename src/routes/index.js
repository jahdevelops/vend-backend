const { Router } = require("express");
const auth = require("./auth.route");
const user = require("./user.route");
const seller = require('./seller.route')

const router = Router();
router.use("/api/v1/auth", auth);
router.use("/api/v1/user", user);
router.use('/api/v1/seller', seller)
router.get("/", (req, res) => {
    return res.status(200).json({ message: "You're not meant to be here :)" });
});

module.exports = router;