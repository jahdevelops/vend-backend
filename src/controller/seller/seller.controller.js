const mysql = require("../../db");
const { findUserById, becomeSeller } = require("../../db/sql");
const {
  userNotFound,
  requiredField,
} = require("../../messages/error.messages");
const catchAsyncErrors = require("../../middlewares/catchAsyncErrors");
const ErrorHandler = require("../../utils/errorHandler");

exports.becomeASeller = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.user;
  const { id_number } = req.body;
  if (!id_number) {
    return next(new ErrorHandler(requiredField.message, requiredField.code));
  }
  mysql.query(findUserById, [id], (err, data) => {
    if (err) return next(new ErrorHandler(err.message, 500));
    if (!data.length) {
      return next(new ErrorHandler(userNotFound.message, userNotFound.code));
    }
    if (data[0].role === "seller") {
      return next(new ErrorHandler("Already a seller", 400));
    }
    mysql.query(becomeSeller, [id_number, id], (err) => {
      if (err) return next(new ErrorHandler(err.message, 500));
      return res
        .status(200)
        .json({ success: true, message: "Please wait for admin approval" });
    });
  });
});
