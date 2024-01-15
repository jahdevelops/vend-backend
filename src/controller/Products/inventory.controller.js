const { productNotFound } = require("../../messages/error.messages");
const catchAsyncErrors = require("../../middlewares/catchAsyncErrors");
const ErrorHandler = require("../../utils/errorHandler");
const db = require("../../model");
const Product = db.product;
const Inventory = db.inventory;

exports.getProductInventory = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const product = await Product.findByPk(id);
  if (!product) {
    return next(
      new ErrorHandler(productNotFound.message, productNotFound.code),
    );
  }

  const inventories = await Inventory.findAll({ where: { productId: id } });
  return res.status(200).json({
    success: true,
    message: "Product Inventories",
    inventories,
  });
});

exports.getAProductInventory = catchAsyncErrors(async (req, res, next) => {
  const { id, productId } = req.params;
  const product = await Product.findByPk(productId);
  if (!product) {
    return next(
      new ErrorHandler(productNotFound.message, productNotFound.code),
    );
  }
  const inventory = await Inventory.findByPk(id);
  if (!inventory) {
    return next(new ErrorHandler("Inventory not found", productNotFound.code));
  }
  return res.status(200).json({
    success: true,
    message: "Product Inventory Update Successfully",
    inventory,
  });
});
