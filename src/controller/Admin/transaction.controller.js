/* eslint-disable no-unused-vars */
const db = require("../../model");
const catchAsyncErrors = require("../../middlewares/catchAsyncErrors");
const ErrorHandler = require("../../utils/errorHandler");
const Transaction = db.transaction;
const axios = require("axios");
const { paystack } = require("../../config");

exports.getAllUsersTransaction = catchAsyncErrors(async(req, res) => {
  const {
    page = 1,
    sortBy = "createdAt",
    sortOrder = "desc",
    status = "successful" || "pending" || "failed",
  } = req.query;
  const pageSize = 10;
  const offset = (page - 1) * pageSize;
  const validSortOrders = ["asc", "desc"];
  const sort = validSortOrders.includes(sortOrder) ? sortOrder : "asc";

  const transactions = await Transaction.findAndCountAll(
    { where: { status: status } },
    {
      order: [[sortBy, sort]],
      limit: pageSize,
      offset: offset,
    },
  );
  const response = {
    success: true,
    totalTransactions: transactions.count,
    message: "All transactions",
    transactions: transactions.rows,
    currentPage: page,
    totalPages: Math.ceil(transactions.count / pageSize),
  };
  return res.status(200).json(response);
})

