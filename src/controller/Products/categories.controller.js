/* eslint-disable no-unused-vars */
const catchAsyncErrors = require("../../middlewares/catchAsyncErrors");
const ErrorHandler = require("../../utils/errorHandler");
const db = require("../../model");
const Category = db.category;
exports.getCategories = catchAsyncErrors(async (req, res, next) => {
  const categories = await Category.findAll();
  return res.status(200).json({
    status: true,
    message: "All Category",
    categories,
  });
});
exports.categoryInit = catchAsyncErrors(async (req, res, next) => {
  const data = [
    {
      name: "shoe",
      description: "Mostly shoes",
    },
    {
      name: "phone",
      description: "Mostly phones",
    },
    {
      name: "laptop",
      description: "Mostly Laptops",
    },
  ];
  const categories = await Category.bulkCreate(data);
  res
    .status(200)
    .json({ success: true, message: "Created in bulk", categories });
});
