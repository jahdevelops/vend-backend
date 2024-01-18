const catchAsyncErrors = require("../../middlewares/catchAsyncErrors");
const ErrorHandler = require("../../utils/errorHandler");
const db = require("../../model");

const Wallet = db.wallet;

exports.getWallet = catchAsyncErrors(async (req, res, next) => {
  const { id, role } = req.user;
  if (role === "buyer") {
    return next(new ErrorHandler("No wallet for the type of user"));
  }
  const wallet = await Wallet.findOne({ where: { userId: id } });
  if (!wallet) {
    return next(new ErrorHandler("Wallet not found"));
  }
  return res.status(200).json({
    success: true,
    message: "User's wallet",
    wallet,
  });
});
