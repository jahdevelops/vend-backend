const { requiredField } = require("../../messages/error.messages");
const catchAsyncErrors = require("../../middlewares/catchAsyncErrors");
const ErrorHandler = require("../../utils/errorHandler");
const db = require("../../model");
const Stock = db.stock;
exports.getProductStock = catchAsyncErrors(async (req, res, next) => {
  const { productId, id } = req.params;

  if (!productId || !id) {
    return next(new ErrorHandler(requiredField.message, requiredField.code));
  }
  const stock = await Stock.findOne({
    where: {
      productId: productId,
      id: id,
    },
  });
  if (!stock) {
    return next(new ErrorHandler("Stocks not found", 404));
  }
  return res
    .status(200)
    .json({ success: true, message: "Product stocks", stock });
});
