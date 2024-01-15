/* eslint-disable no-unused-vars */
const {
  requiredField,
  userNotFound,
} = require("../../messages/error.messages");
const catchAsyncErrors = require("../../middlewares/catchAsyncErrors");
const ErrorHandler = require("../../utils/errorHandler");
const sendEmail = require("../../utils/sendMail");
const db = require("../../model");
const { Op } = require("sequelize");
const User = db.user;
exports.getPendingSellers = catchAsyncErrors(async (req, res, next) => {
  const users = await User.findAll({
    where: {
      id_number: {
        [Op.not]: null,
      },
      role: "buyer",
    },
  });
  return res
    .status(200)
    .json({ success: true, message: "Pending Sellers", users });
});
exports.approveNewSeller = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  if (!id)
    return next(new ErrorHandler(requiredField.message, requiredField.code));

  const user = await User.findOne({ where: { id: id } });
  if (!user) {
    return next(new ErrorHandler(userNotFound.message, userNotFound.code));
  }
  if (user.id_number === null) {
    return next(new ErrorHandler("User is yet to update Id Number", 400));
  }
  if (user.role === "seller") {
    return next(new ErrorHandler("User is already a seller", 400));
  }
  await User.update({ role: "seller" }, { where: { id: id } });
  await sendEmail({
    email: `${user.first_name} <${user.email}>`,
    subject: "Seller Approval",
    html: "Congratulations!!! You're now a seller",
  });
  return res.status(200).json({
    success: true,
    message: "User updated successfully",
  });
});
exports.getAllSellers = catchAsyncErrors(async (req, res, next) => {
  const { page = 1, sortBy = "createdAt", sortOrder = "desc" } = req.query;
  const pageSize = 10;
  const offset = (page - 1) * pageSize;
  const validSortOrders = ["asc", "desc"];
  const sort = validSortOrders.includes(sortOrder) ? sortOrder : "asc";
  const users = await User.findAndCountAll(
    { where: { role: "seller" } },
    {
      order: [[sortBy, sort]],
      limit: pageSize,
      offset: offset,
    },
  );
  const response = {
    success: true,
    totalSellers: users.count,
    message: "All Sellers",
    sellers: users.rows,
    currentPage: page,
    totalPages: Math.ceil(users.count / pageSize),
  };

  return res.status(200).json(response);
});
