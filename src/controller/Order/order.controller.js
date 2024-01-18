/* eslint-disable no-unused-vars */
const catchAsyncErrors = require("../../middlewares/catchAsyncErrors");
const ErrorHandler = require("../../utils/errorHandler");
const db = require("../../model");
const Product = db.product;
const Order = db.order;
// const Transaction = db.transaction;
const Inventory = db.inventory;
const Cart = db.cart;

exports.createOrder = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.user;
  let productsAmount = 0;

  const cart = await Cart.findAll({ where: { userId: id } });

  if (!cart.length) {
    return next(new ErrorHandler("No Item in Cart", 400));
  }
  for (const product of cart) {
    const productExist = await Product.findByPk(product.productId);
    if (!productExist) {
      return next(
        new ErrorHandler(
          `The product with id:${product.productId} is not found`,
          404,
        ),
      );
    }
    const inventory = await Inventory.findOne({
      where: {
        id: product.inventoryId,
        productId: product.productId,
      },
    });

    if (!inventory) {
      return next(
        new ErrorHandler(
          `Product's ${product.productId}  inventory  ${product.inventoryId} not found`,
          404,
        ),
      );
    }
    if (Number(product.quantity) > inventory.quantity) {
      return next(
        new ErrorHandler(
          `This Product ${product.productId}  does not have up to this amount in stock`,
          400,
        ),
      );
    }
    productsAmount += product.prices;
  }
  const order = await Order.create({
    userId: id,
    status: "pending",
    carts: cart,
    productsAmount: productsAmount,
    taxAmount: productsAmount * 0.08,
    delieveryAmount:
      productsAmount <= 1000
        ? 300
        : productsAmount > 1000 && productsAmount < 4000
          ? 500
          : productsAmount > 4000 && productsAmount < 10000
            ? 1000
            : productsAmount * 0.09,
    totalAmount:
      productsAmount +
      productsAmount * 0.08 +
      (productsAmount <= 1000
        ? 300
        : productsAmount > 1000 && productsAmount < 4000
          ? 500
          : productsAmount > 4000 && productsAmount < 10000
            ? 1000
            : productsAmount * 0.09),
  });
  for (const carts of cart) {
    await carts.destroy();
  }
  return res.status(201).json({
    success: true,
    message: "Order created successfully",
    order,
  });
});
exports.editOrder = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  if (!req.body.deliveryNote && !req.body.addressId) {
    return next(
      new ErrorHandler("You can only edit Delivery Note or Address Id", 400),
    );
  }
  const order = await Order.findOne({ where: { id: id, userId: req.user.id } });
  if (!order) {
    return next(new ErrorHandler("Order not found", 404));
  }
  await Order.update(req.body, { where: { id: id, userId: req.user.id } });
  return res.status(200).json({
    success: true,
    message: "Order Updated successfully",
  });
});

exports.getAllOrder = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.user;
  const {
    page = 1,
    sortBy = "createdAt",
    sortOrder = "desc",
    status = "pending" || "processing" || "shipped" || "delivered",
  } = req.query;
  const pageSize = 10;
  const offset = (page - 1) * pageSize;
  const validSortOrders = ["asc", "desc"];
  const sort = validSortOrders.includes(sortOrder) ? sortOrder : "asc";
  const orders = await Order.findAndCountAll(
    { where: { userId: id, status: status } },
    {
      order: [[sortBy, sort]],
      limit: pageSize,
      offset: offset,
    },
  );
  const response = {
    success: true,
    totalOrders: orders.count,
    message: "All orders",
    orders: orders.rows,
    currentPage: page,
    totalPages: Math.ceil(orders.count / pageSize),
  };
  return res.status(200).json(response);
});
exports.getOrder = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const order = await Order.findOne({ where: { userId: req.user.id, id: id } });
  return res.status(200).json({
    success: true,
    message: "Order",
    order,
  });
});
exports.deleteOrder = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const order = await Order.findOne({ where: { id: id, userId: req.user.id } });
  if (!order) {
    return next(new ErrorHandler("Order not found", 404));
  }
  await order.destroy();
  res.status(204).end();
});
