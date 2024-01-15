const { productNotFound } = require("../../../messages/error.messages");
const catchAsyncErrors = require("../../../middlewares/catchAsyncErrors");
const ErrorHandler = require("../../../utils/errorHandler");
const db = require("../../../model");
const Product = db.product;
const Inventory = db.inventory;

exports.createInventory = catchAsyncErrors(async (req, res, next) => {
  const inventoryData = req.body;
  if (!Array.isArray(inventoryData)) {
    return next(
      new ErrorHandler("Invalid input data. Expected an array.", 422),
    );
  }

  const invalidEntries = inventoryData.filter(
    (entry) => !entry.productId || !entry.quantity,
  );

  if (invalidEntries.length > 0) {
    return next(
      new ErrorHandler(
        "Each inventory entry must have both productId and quantities",
        400,
      ),
    );
  }
  const inventories = await Inventory.bulkCreate(inventoryData);

  return res.status(200).json({
    success: true,
    message: "Product Inventories created successfully",
    inventories,
  });
});
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
exports.editProductInventory = catchAsyncErrors(async (req, res, next) => {
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
  await Inventory.update(req.body, { where: { id: id } });
  return res.status(200).json({
    success: true,
    message: "Product Inventory Update Successfully",
  });
});

exports.deleteProductInventory = catchAsyncErrors(async (req, res, next) => {
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
  await inventory.destroy();
  return res.status(204).end;
});
