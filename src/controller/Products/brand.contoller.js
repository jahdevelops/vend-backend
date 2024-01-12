const mysql = require("../../db");
const { getBrand } = require("../../db/sql");
const catchAsyncErrors = require("../../middlewares/catchAsyncErrors");
const ErrorHandler = require("../../utils/errorHandler");

exports.getBrands = catchAsyncErrors(async (req, res, next) => {
  mysql.query(getBrand, (err, data) => {
    if (err) return next(new ErrorHandler(err.message, 500));
    return res.status(200).json({
      status: true,
      message: "All Brands",
      brands: data,
    });
  });
});
