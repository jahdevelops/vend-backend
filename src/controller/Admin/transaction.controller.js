/* eslint-disable no-unused-vars */
const db = require("../../model");
const catchAsyncErrors = require("../../middlewares/catchAsyncErrors");
const ErrorHandler = require("../../utils/errorHandler");
const Transaction = db.transaction;
const axios = require("axios");
const { paystack } = require("../../config");

exports.getAllUsersTransaction = catchAsyncErrors(async (req, res) => {
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
});

exports.getTotalRevenue = catchAsyncErrors(async (req, res, next) => {
  await axios
    .get("https://api.paystack.co/balance", {
      headers: { Authorization: `Bearer ${paystack.secret}` },
    })
    .then((axiosResponse) => {
      if (!axiosResponse.data.status) {
        return next(ErrorHandler("Could not fetch total revenue", 400));
      }
      const nairaBalance = axiosResponse.data.data.filter(
        (i) => i.currency === "NGN",
      );
      if (nairaBalance.length === 0) {
        return next(ErrorHandler("Could not get naira balance.", 400));
      }
      const balance = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "NGN",
      }).format(nairaBalance[0].balance);

      const response = {
        success: true,
        message: "Total revenue retrieved",
        totalRevenue: balance,
      };

      return res.status(200).json(response);
    });
});
