const { Router } = require("express");
const auth = require("./auth.route");

const router = Router();
router.use("/api/v1/auth", auth);
router.get("/", (req, res) => {
    return res.status(200).json({ message: "You're not meant to be here :)" });
});

module.exports = router