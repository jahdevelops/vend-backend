/* eslint-disable no-unused-vars */
const { requiredField } = require("../messages/error.messages");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const ErrorHandler = require("../utils/errorHandler");
const db = require("../model");
const User = db.user;
exports.getMe = catchAsyncErrors(async (req, res, next) => {
  return res.status(200).json({
    success: true,
    message: "User data",
    user: req.user,
  });
});

exports.updateUser = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.user;
  const { phoneNumber } = req.body;

  if (!phoneNumber)
    return next(new ErrorHandler(requiredField.message, requiredField.code));

  await User.update(
    { phoneNumber: phoneNumber },
    {
      where: { id: id },
    },
  );
  return res
    .status(200)
    .json({ success: true, message: "Phone number updated successfully" });
});
