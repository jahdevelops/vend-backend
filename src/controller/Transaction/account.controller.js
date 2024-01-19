const catchAsyncErrors = require("../../middlewares/catchAsyncErrors");
const ErrorHandler = require("../../utils/errorHandler");
const db = require("../../model");

const Account = db.account;

const { requiredField } = require("../../messages/error.messages");

exports.addAccount = catchAsyncErrors(async (req, res, next) => {
  const { accountNumber, accountName, bankName } = req.body;
  if (!accountName || !accountNumber || !bankName) {
    return next(new ErrorHandler(requiredField.message, requiredField.code));
  }
  const account = await Account.create({
    userId: req.user.id,
    accountName: accountName,
    accountNumber: accountNumber,
    bankName: bankName,
  });
  return res.status(201).json({
    success: true,
    message: "User's account added successfully",
    account,
  });
});
