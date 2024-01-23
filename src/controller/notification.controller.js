/* eslint-disable no-unused-vars */
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const db = require("../model");
const ErrorHandler = require("../utils/errorHandler");
const Notification = db.notification;

exports.getAllNotification = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.user;
  const notifications = await Notification.findAll({
    where: { userId: id, read: false },
  });
  return res.status(200).json({
    success: true,
    message: "Notifications",
    notifications,
  });
});

exports.readNotification = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const notification = await Notification.findOne({ where: { id: id } });
  if (!notification) {
    return next(new ErrorHandler("Notification not found", 404));
  }
  await Notification.update({ read: true }, { where: { id: id } });
  return res.status(200).json({
    success: true,
    message: "Notification Updated",
  });
});
