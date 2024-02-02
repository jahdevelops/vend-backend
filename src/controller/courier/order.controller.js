/* eslint-disable no-unused-vars */
const db = require("../../model");
const Order = db.order;
const catchAsyncErrors = require("../../middlewares/catchAsyncErrors");
const ErrorHandler = require("../../utils/errorHandler");

exports.getSingleAssignedOrder = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const order = await Order.findOne({
    where: { courierId: req.user.id, id: id },
  });
  if (!order) {
    return next(
      new ErrorHandler(
        "Invalid order ID or order was not assigned to you",
        400,
      ),
    );
  }
  return res.status(200).json({
    success: true,
    message: "Order",
    order,
  });
});

exports.getAllAssignedOrders = catchAsyncErrors(async (req, res, next) => {
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
    { where: { status: status, courierId: id } },
    {
      order: [[sortBy, sort]],
      limit: pageSize,
      offset: offset,
    },
  );
  let responseMessage = `All ${status} orders`;
  if (orders.count === 0) {
    responseMessage = `You currently have no ${status} orders`;
  }
  const response = {
    success: true,
    totalOrders: orders.count,
    message: responseMessage,
    orders: orders.rows,
    currentPage: page,
    totalPages: Math.ceil(orders.count / pageSize),
  };
  return res.status(200).json(response);
});

exports.editOrderStatus = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body;
  const statuses = ["pending", "processing", "shipped", "delivered"];
  if (!status || !statuses.includes(status)) {
    return next(new ErrorHandler("Invalid order status", 400));
  }
  const order = await Order.findOne({
    where: { id, courierId: req.user.id },
    attributes: ["status", "id"],
  });
  if (!order) {
    return next(
      new ErrorHandler(
        "Invalid order ID or order was not assigned to you",
        400,
      ),
    );
  }
  const currentOrderStatus = order.status;
  if (currentOrderStatus === status) {
    return res.status(200).json({
      success: true,
      message: "order status remains unchanged",
    });
  }
  if (currentOrderStatus === "delivered") {
    return next(
      new ErrorHandler(
        "Cannot update status as the order has already been delievered",
        400,
      ),
    );
  }
  order.status = status;
  await order.save();
  const response = {
    success: true,
    message: `Order status changed from ${currentOrderStatus} to ${status}`,
  };
  res.status(200).json(response);
});
