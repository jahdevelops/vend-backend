const catchAsyncErrors = require("../../middlewares/catchAsyncErrors");
const ErrorHandler = require("../../utils/errorHandler");
const db = require("../../model");

const Balance = db.balance;

exports.getBalance = catchAsyncErrors(async (req, res, next) => {
  const { id, walletId } = req.params;

  const balance = await Balance.findOne({
    where: { walletId: walletId, id: id, userId: req.user.id },
  });
  if (!balance) {
    return next(new ErrorHandler("Balance not found", 404));
  }
  return res.status(200).json({
    success: true,
    message: "User's balance",
    balance,
  });
});
