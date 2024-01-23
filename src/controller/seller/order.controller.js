const db = require("../../model");
const catchAsyncErrors = require("../../middlewares/catchAsyncErrors");
const ErrorHandler = require("../../utils/errorHandler");
const Order = db.order;
const { orderNotFound } = require("../../messages/error.messages");

exports.getAllOrders = catchAsyncErrors(async (req, res) => {
  const { id } = req.user;
  const { page = 1, sortBy = "createdAt", sortOrder = "desc" } = req.query;
  const pageSize = 10;
  const validSortOrders = ["asc", "desc"];
  const sort = validSortOrders.includes(sortOrder) ? sortOrder : "asc";
  const offset = (page - 1) * pageSize;

  const orders = await Order.findAndCountAll({
    offset,
    limit: pageSize,
    order: [[sortBy, sort]],
    where: {
      carts: {
        [db.Sequelize.Op.contains]: [
          {
            sellerId: id,
          },
        ],
      },
    },
  });

  const response = {
    success: true,
    message: "Orders",
    orders: orders.rows,
    currentPage: page,
    totalPages: Math.ceil(orders.count / pageSize),
  };

  return res.status(200).json(response);
});

exports.getOrder = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const order = await Order.findOne({
    where: {
      id: id,
    },
  });
  if (!order) {
    return next(new ErrorHandler(orderNotFound.message, orderNotFound.code));
  }
  return res.status(200).json({
    success: true,
    message: "Order retrieved successfully",
    order: order,
  });
});
