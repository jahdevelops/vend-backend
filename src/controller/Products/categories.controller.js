const mysql = require("../../db");
const { getCategories } = require("../../db/sql");
const catchAsyncErrors = require("../../middlewares/catchAsyncErrors");
const ErrorHandler = require("../../utils/errorHandler");

exports.getCategories = catchAsyncErrors(async (req, res, next) => {
  mysql.query(getCategories, (err, data) => {
    if (err) return next(new ErrorHandler(err.message, 500));
    return res.status(200).json({
      status: true,
      message: "All Categories",
      categorise: data,
    });
  });
});
