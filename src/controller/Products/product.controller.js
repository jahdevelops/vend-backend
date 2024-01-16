/* eslint-disable no-unused-vars */
const { productNotFound } = require("../../messages/error.messages");
const catchAsyncErrors = require("../../middlewares/catchAsyncErrors");
const ErrorHandler = require("../../utils/errorHandler");
const db = require("../../model");
const Product = db.product;
exports.indexProducts = catchAsyncErrors(async (req, res, next) => {
  const { page = 1 } = req.query;
  const pageSize = 10;
  const offset = (page - 1) * pageSize;

  const order = [db.sequelize.literal("RAND()")];

  const products = await Product.findAndCountAll({
    order: order,
    limit: pageSize,
    offset: offset,
  });

  const response = {
    success: true,
    message: "Products",
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
    message: "Product retrieved successfully",
    product: product,
  });
});
