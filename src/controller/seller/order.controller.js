const db = require("../../model");
const catchAsyncErrors = require("../../middlewares/catchAsyncErrors");
const Sequelize = require("sequelize");
const Order = db.order;

exports.getAllOrders = catchAsyncErrors(async (req, res) => {
  const { id } = req.user;
  const { page = 1, sortBy = "createdAt", sortOrder = "desc" } = req.query;
  const pageSize = 10;
  const validSortOrders = ["asc", "desc"];
  const sort = validSortOrders.includes(sortOrder) ? sortOrder : "asc";
  const offset = (page - 1) * pageSize;

  const orders = await Order.findAndCountAll(
    { 
      where: Sequelize.where(
        Sequelize.fn('JSON_CONTAINS', Sequelize.col('carts'), `{"sellerId": "${id}"}`),
        true
      ),
      offset,
      limit: pageSize,
      order: [[sortBy, sort]],
    }
  );
  orders.rows.forEach(order => {
    const matchedCarts = order.carts.filter(cartItem => cartItem.sellerId === id)
    order.carts = matchedCarts
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