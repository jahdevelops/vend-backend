const mysql = require("../../db");
const { getProductStock } = require("../../db/sql");
const { requiredField } = require("../../messages/error.messages");
const catchAsyncErrors = require("../../middlewares/catchAsyncErrors");
const ErrorHandler = require("../../utils/errorHandler");

exports.getProductStock = catchAsyncErrors(async (req, res, next) => {
  const { productId, id } = req.params;
  if (!productId || !id)
    return next(new ErrorHandler(requiredField.message, requiredField.code));
  mysql.query(getProductStock, [id, productId], (err, data) => {
    if (err) return next(new ErrorHandler(err.message, 500));
    if (!data.length) {
      return next(new ErrorHandler("Stocks not found", 500));
    }
    return res
      .status(200)
      .json({ success: true, message: "Product stocks", stock: data[0] });
  });
});
