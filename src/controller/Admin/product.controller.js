/* eslint-disable no-unused-vars */
const { productNotFound } = require("../../messages/error.messages");
const catchAsyncErrors = require("../../middlewares/catchAsyncErrors");
const ErrorHandler = require("../../utils/errorHandler");
const db = require("../../model");
const Product = db.product;

exports.getAllProducts = catchAsyncErrors(async (req, res, next) => {
  const { page = 1, sortBy = "createdAt", sortOrder = "desc" } = req.query;
  const pageSize = 10;
  const offset = (page - 1) * pageSize;
  const validSortOrders = ["asc", "desc"];
  const sort = validSortOrders.includes(sortOrder) ? sortOrder : "asc";
  const products = await Product.findAndCountAll({
    order: [[sortBy, sort]],
    limit: pageSize,
    offset: offset,
  });
  const response = {
    success: true,
    totalProducts: products.count,
    message: "All products",
    products: products.rows,
    currentPage: page,
    totalPages: Math.ceil(products.count / pageSize),
  };

  return res.status(200).json(response);
});

exports.getProduct = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const product = await Product.findOne({
    where: {
      id: id,
    },
  });
  if (!product) {
    return next(
      new ErrorHandler(productNotFound.message, productNotFound.code),
    );
  }
  return res.status(200).json({
    success: true,
    message: "product retrieved successfully",
    product,
  });
});
