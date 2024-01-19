/* eslint-disable no-unused-vars */
const catchAsyncErrors = require("../../middlewares/catchAsyncErrors");
const db = require("../../model");

const Escrow = db.escrow;

exports.getUsersEscrow = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.user;
  const escrow = await Escrow.findAll({ where: { userId: id } });
  return res.status(200).json({
    success: true,
    message: "User's Escrow",
    escrow,
  });
});
