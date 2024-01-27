/* eslint-disable no-unused-vars */
const db = require("../../model");
const catchAsyncErrors = require("../../middlewares/catchAsyncErrors");
const ErrorHandler = require("../../utils/errorHandler");
const Order = db.order;

exports.getAllOrders = catchAsyncErrors(async (req, res, next) => {
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
    { where: { status: status } },
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
  const order = await Order.findOne({ where: { id: id } });
  if (!order) {
    return next(new ErrorHandler("Order not found", 404));
  }
  return res.status(200).json({
    success: true,
    message: "Order",
    order,
  });
});
