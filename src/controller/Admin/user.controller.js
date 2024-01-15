/* eslint-disable no-unused-vars */
const { userNotFound } = require("../../messages/error.messages");
const catchAsyncErrors = require("../../middlewares/catchAsyncErrors");
const ErrorHandler = require("../../utils/errorHandler");
const db = require("../../model");
const User = db.user;

exports.getAllUsers = catchAsyncErrors(async (req, res, next) => {
  const { page = 1, sortBy = "createdAt", sortOrder = "desc" } = req.query;
  const pageSize = 10;
  const offset = (page - 1) * pageSize;
  const validSortOrders = ["asc", "desc"];
  const sort = validSortOrders.includes(sortOrder) ? sortOrder : "asc";
  const users = await User.findAndCountAll({
    order: [[sortBy, sort]],
    limit: pageSize,
    offset: offset,
  });
  const response = {
    success: true,
    totalUser: users.count,
    message: "All Users",
    users: users.rows,
    currentPage: page,
    totalPages: Math.ceil(users.count / pageSize),
  };

  return res.status(200).json(response);
});
exports.getUser = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findOne({
    where: {
      id: id,
    },
  });
  if (!user) {
    return next(new ErrorHandler(userNotFound.message, userNotFound.code));
  }
  return res.status(200).json({
    success: true,
    message: "user retrieved successfully",
    user,
  });
});
