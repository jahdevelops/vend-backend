/* eslint-disable no-unused-vars */
const catchAsyncErrors = require("../../middlewares/catchAsyncErrors");
const ErrorHandler = require("../../utils/errorHandler");
const db = require("../../model");
const Brand = db.brand;
exports.getBrands = catchAsyncErrors(async (req, res, next) => {
  const brands = await Brand.findAll();
  return res.status(200).json({
    status: true,
    message: "All Brands",
    brands,
  });
});

exports.brandInit = catchAsyncErrors(async (req, res, next) => {
  const data = [
    {
      name: "Addidas",
      description: "Mostly shoes",
    },
    {
      name: "Apple",
      description: "Mostly phones",
    },
    {
      name: "HP",
      description: "Mostly Laptops",
    },
  ];
  const brand = await Brand.bulkCreate(data);
  res.status(200).json({ success: true, message: "Created in bulk", brand });
});
