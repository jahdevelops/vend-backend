/* eslint-disable no-unused-vars */
const db = require("../../model");
const Cart = db.cart;
const catchAsyncErrors = require("../../middlewares/catchAsyncErrors");
const ErrorHandler = require("../../utils/errorHandler");
const { requiredField } = require("../../messages/error.messages");

exports.getCart = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.user;
  const cart = await Cart.findOne({ where: { userId: id } });
  return res
    .status(200)
    .json({ success: true, message: "User's cart", cart: cart ? cart : {} });
});

exports.addToCart = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.user;
  const { productId, price, quantity } = req.body;

  if (!productId || !price || !quantity) {
    return next(new ErrorHandler(requiredField.message, requiredField.code));
  }

  let cart = await Cart.findOrCreate({ where: { userId: id } });

  if (!cart[0]) {
    cart = await Cart.create({
      userId: id,
      products: [],
      quantities: [],
      prices: [],
    });
  }

  const cartInstance = cart[0];

  // Update arrays in the cart instance
  cartInstance.products.push(productId);
  cartInstance.quantities.push(quantity);
  cartInstance.prices.push(price);

  // Save the changes to the cart instance
  await cartInstance.save();

  return res.status(200).json({
    success: true,
    message: "Product added successfully",
    cartInstance,
  });
});

exports.removeFromCart = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.user;
  const { productId } = req.body;

  if (!productId) {
    return next(new ErrorHandler(requiredField.message, requiredField.code));
  }

  let cart = await Cart.findOne({ where: { userId: id } });

  if (!cart) {
    return next(new ErrorHandler("User's cart not found", 404));
  }

  const productIndex = cart.products.indexOf(productId);

  if (productIndex !== -1) {
    // Remove the product, quantity, and price at the specified index
    cart.products.splice(productIndex, 1);
    cart.quantities.splice(productIndex, 1);
    cart.prices.splice(productIndex, 1);

    await cart.save();
  }

  return res.status(200).json({
    success: true,
    message: "Product removed successfully from the cart",
  });
});
