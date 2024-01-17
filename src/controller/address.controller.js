/* eslint-disable no-unused-vars */
const { requiredField } = require("../messages/error.messages");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const ErrorHandler = require("../utils/errorHandler");
const db = require("../model");
const Address = db.address;

exports.createAddress = catchAsyncErrors(async (req, res, next) => {
  const { streetAddress, city, state, zipCode, country } = req.body;
  if (!streetAddress || !city || !state || !zipCode || !country) {
    return next(new ErrorHandler(requiredField.message, requiredField.code));
  }
  const { id } = req.user;

  const address = await Address.create({
    userId: id,
    streetAddress: streetAddress,
    city: city,
    state: state,
    zipCode: zipCode,
    country: country,
  });
  return res.status(201).json({
    success: true,
    message: "Address added successfully",
    address,
  });
});
exports.getAllAddress = catchAsyncErrors(async (req, res, next) => {
  const address = await Address.findAll({ where: { userId: req.user.id } });
  return res.status(200).json({
    success: true,
    message: "User's address",
    address,
  });
});
exports.getAddress = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const address = await Address.findOne({
    where: { userId: req.user.id, id: id },
  });
  if (!address) {
    return next(new ErrorHandler("Address not found", 404));
  }

  return res.status(200).json({
    success: true,
    message: "Address",
    address,
  });
});
exports.editAddress = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const address = await Address.findOne({
    where: { userId: req.user.id, id: id },
  });
  if (!address) {
    return next(new ErrorHandler("Address not found", 404));
  }
  await Address.update(req.body, { where: { userId: req.user.id, id: id } });
  return res.status(200).json({
    success: true,
    message: "Address edited successfully",
  });
});
exports.deleteAddress = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const address = await Address.findOne({
    where: { userId: req.user.id, id: id },
  });
  if (!address) {
    return next(new ErrorHandler("Address not found", 404));
  }
  await address.destroy();
  return res.status(204).end();
});
