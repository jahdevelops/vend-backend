/* eslint-disable no-unused-vars */
const db = require("../../model");
const Cart = db.cart;
const Product = db.product;
const Inventory = db.inventory;
const catchAsyncErrors = require("../../middlewares/catchAsyncErrors");
const ErrorHandler = require("../../utils/errorHandler");
const {
  requiredField,
  productNotFound,
} = require("../../messages/error.messages");

exports.getCart = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.user;
  const cart = await Cart.findAll({ where: { userId: id } });
  return res.status(200).json({ success: true, message: "User's cart", cart });
});

exports.addToCart = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.user;
  const { productId, inventoryId, quantity } = req.body;

  if (!productId || !inventoryId || !quantity) {
    return next(new ErrorHandler(requiredField.message, requiredField.code));
  }
  const product = await Product.findByPk(productId);

  if (!product) {
    return next(
      new ErrorHandler(productNotFound.message, productNotFound.code),
    );
  }

  let existingCart = await Cart.findOne({
    where: { productId: productId, userId: id },
  });
  if (existingCart) {
    return next(new ErrorHandler("Product's cart already exist", 400));
  }
  const inventory = await Inventory.findOne({
    where: {
      id: inventoryId,
      productId: productId,
    },
  });

  if (!inventory) {
    return next(
      new ErrorHandler(
        "Product's inventory not found or inventory id is not meant for the product",
        404,
      ),
    );
  }
  if (Number(quantity) > inventory.quantity) {
    return next(
      new ErrorHandler(
        "This Product does not have up to this amount in stock",
        400,
      ),
    );
  }

  let cart = await Cart.create({
    userId: id,
    productId: productId,
    quantity: quantity,
    inventoryId: inventoryId,
    prices: Number(product.price) * quantity,
  });

  return res.status(200).json({
    success: true,
    message: "Product added successfully",
    cart,
  });
});

exports.editCart = catchAsyncErrors(async (req, res, next) => {
  const { productId, quantity } = req.body;

  if (!productId || !quantity) {
    return next(new ErrorHandler(requiredField.message, requiredField.code));
  }
  const product = await Product.findByPk(productId);

  if (!product) {
    return next(
      new ErrorHandler(productNotFound.message, productNotFound.code),
    );
  }

  let existingCart = await Cart.findOne({
    where: { productId: productId, userId: req.user.id },
  });

  if (!existingCart) {
    return next(new ErrorHandler("Product's cart not found", 404));
  }
  const inventory = await Inventory.findOne({
    where: {
      id: existingCart.inventoryId,
      productId: productId,
    },
  });

  if (!inventory) {
    return next(new ErrorHandler("Product's inventory not found", 404));
  }
  if (Number(quantity) > inventory.quantity) {
    return next(
      new ErrorHandler(
        "This Product does not have up to this amount in stock",
        400,
      ),
    );
  }
  existingCart.quantity = Number(quantity);
  existingCart.prices = Number(product.price) * existingCart.quantity;
  await existingCart.save();
  return res.status(200).json({
    success: true,
    message: "Cart Updated successfully",
    cart: existingCart,
  });
});

exports.removeFromCart = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.user;
  const { productId } = req.body;

  if (!productId) {
    return next(new ErrorHandler(requiredField.message, requiredField.code));
  }
  const product = await Product.findByPk(productId);

  if (!product) {
    return next(
      new ErrorHandler(productNotFound.message, productNotFound.code),
    );
  }

  let cart = await Cart.findOne({
    where: { productId: productId, userId: id },
  });

  if (!cart) {
    return next(new ErrorHandler("User's cart not found", 404));
  }
  await cart.destroy();

  return res.status(200).json({
    success: true,
    message: "Product removed successfully from the cart",
  });
});
