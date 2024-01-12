const mysql = require("../../db");
const { findProduct, indexProduct } = require("../../db/sql");
const { productNotFound } = require("../../messages/error.messages");
const catchAsyncErrors = require("../../middlewares/catchAsyncErrors");
const ErrorHandler = require("../../utils/errorHandler");

exports.indexProducts = catchAsyncErrors(async (req, res, next) => {
  const { page = 1 } = req.query;
  const pageSize = 10;
  const offset = (page - 1) * pageSize;

  // Building the query with sorting options
  const query = `${indexProduct} LIMIT ${pageSize} OFFSET ${offset}`;

  // Query to count the total number of products without LIMIT and OFFSET
  const countQuery = `SELECT COUNT(*) AS total FROM product`;

  // Execute both queries in parallel
  mysql.query(query, (err, data) => {
    if (err) return next(new ErrorHandler(err.message, 500));

    mysql.query(countQuery, (err, countData) => {
      if (err) return next(new ErrorHandler(err.message, 500));

      const totalProducts = countData[0].total;

      const response = {
        success: true,
        message: "All Products",
        products: data,
        currentPage: page,
        totalPages: Math.ceil(totalProducts / pageSize),
      };

      return res.status(200).json(response);
    });
  });
});

exports.getProduct = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  mysql.query(findProduct, [id], (err, data) => {
    if (err) return next(new ErrorHandler(err.message, 500));
    if (!data.length)
      return next(
        new ErrorHandler(productNotFound.message, productNotFound.code),
      );
    return res.status(200).json({
      success: true,
      message: "Product retrieved successfully",
      product: data[0],
    });
  });
});
