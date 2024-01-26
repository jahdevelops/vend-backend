/* eslint-disable no-unused-vars */
const catchAsyncErrors = require("../../middlewares/catchAsyncErrors");
const ErrorHandler = require("../../utils/errorHandler");
const db = require("../../model");
const Transaction = db.transaction;
const Order = db.order;
const User = db.user;
const Product = db.product;
const Inventory = db.inventory;
const Escrow = db.escrow;
const Notification = db.notification;
const https = require("https");
const axios = require("axios");
const { paystack } = require("../../config");
const crypto = require("crypto");
const sendEmail = require("../../utils/sendMail");

exports.initialize = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const { mode } = req.query;
  const order = await Order.findOne({ where: { id: id } });
  if (!order) {
    return next(new ErrorHandler("Order not found", 404));
  }
  if (order.transactionId) {
    const transaction = await Transaction.findOne({
      where: { id: order.transactionId },
    });
    if (transaction.status === "successful") {
      return next(
        new ErrorHandler("This Order has already been paid for", 404),
      );
    }
  }
  const user = await User.findOne({ where: { id: order.userId } });
  if (!user) {
    return next(
      new ErrorHandler(
        "The User associated with this order does not exist",
        404,
      ),
    );
  }

  const transaction = await Transaction.create({
    orderId: id,
    paymentMethod:
      mode === "card" ? "card" : mode === "delievery" ? "on_delievery" : "card",
    status: "pending",
  });
  const referenceId = crypto.randomUUID();

  const params = JSON.stringify({
    email: user.email,
    amount: order.totalAmount * 100,
    currency: "NGN",
    reference: referenceId,
    callback_url: `http://localhost:4000/api/v1/transaction/post?trnId=${transaction.id}&order=${id}`,
    channels: ["card", "bank", "ussd", "qr", "mobile_money", "bank_transfer"],
  });

  const options = {
    hostname: "api.paystack.co",
    port: 443,
    path: "/transaction/initialize",
    method: "POST",
    headers: {
      Authorization: `Bearer ${paystack.secret}`,
      "Content-Type": "application/json",
    },
  };

  const requests = https
    .request(options, (response) => {
      let data = "";

      response.on("data", (chunk) => {
        data += chunk;
      });

      response.on("end", () => {
        res.json(JSON.parse(data));
      });
    })
    .on("error", (error) => {
      console.error(error);
    });

  requests.write(params);
  requests.end();
});

exports.post = catchAsyncErrors(async (req, res, next) => {
  const { order, trnId, trxref } = req.query;
  const headers = {
    Authorization: `Bearer ${paystack.secret}`,
  };
  const transaction = await Transaction.findOne({ where: { id: trnId } });
  await axios
    .get(`https://api.paystack.co/transaction/verify/${trxref}`, { headers })
    .then(async (response) => {
      if (response.data.data.status === "success") {
        transaction.getwayResponse = response.data.data;
        transaction.status = "successful";
        await transaction.save();
        const orders = await Order.findOne({ where: { id: order } });
        if (!orders) return next(new ErrorHandler("Order not found", 404));

        transaction.amount = orders.totalAmount;
        transaction.transactionType = "sale";
        await transaction.save();
        const user = await User.findOne({
          where: { id: orders.userId },
        });
        let sellers = [];
        for (const product of orders.carts) {
          const inventory = await Inventory.findOne({
            where: { id: product.inventoryId },
          });
          inventory.quantity -= Number(product.quantity);
          await inventory.save();
          const orderedProduct = await Product.findOne({
            where: { id: inventory.productId },
          });
          const sellerInfo = await User.findOne({
            where: { id: orderedProduct.userId },
          });
          await Notification.create({
            userId: sellerInfo.id,
            type: "order",
            description: `An Order for your product ${orderedProduct.name} has been placed successfully`,
            read: false,
          });
          await Escrow.create({
            userId: sellerInfo.id,
            walletId: sellerInfo.walletId,
            amount: Number(product.prices),
            status: "pending",
          });
          await Notification.create({
            userId: sellerInfo.id,
            type: "escrow",
            description: `${Number(product.prices)} NGN for ordered product ${
              orderedProduct.name
            } has been successfully deposited into your escrow... money will be released after successful delivery`,
            urlPath: "/api/v1/transaction/escrow",
            read: false,
          });
          // const sellerArray = sellers.find(orderedProduct.userId);
          // if (!sellerArray) {
          //     sellers.push(orderedProduct.userId);
          // }
          sellers.push(orderedProduct.userId);
        }

        orders.transactionId = trnId;
        orders.status = "processing";
        await orders.save();
        await Notification.create({
          userId: orders.userId,
          type: "order",
          description: `Your Order is now processing`,
          read: false,
        });
        await sendEmail({
          email: `${user.first_name} <${user.email}>`,
          subject: "Order Processing",
          html: "Your Order is processing",
        });
        for (const seller of sellers) {
          const userSeller = await User.findOne({
            where: { id: seller },
          });
          await sendEmail({
            email: `${userSeller.first_name} <${userSeller.email}>`,
            subject: "Booked Order",
            html: "A User paid for your other",
          });
        }

        return res.status(200).json({
          success: true,
          message: "Order paid successfully",
        });
      } else {
        return res
          .status(400)
          .json({ success: false, message: "Unable to process payment" });
      }
    })
    .catch(async (err) => {
      transaction.getwayResponse = err.data;
      transaction.status = "failed";
      await transaction.save();
      console.log(err);
      return next(new ErrorHandler("Server Error"));
    });
});
exports.getTransaction = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const transaction = await Transaction.findOne({ where: { id: id } });
  if (!transaction) {
    return next(new ErrorHandler("Transaction not found", 404));
  }
  return res.status(200).json({
    success: true,
    message: "Transaction",
    transaction,
  });
});

// exports.getAllUsersTransaction = catchAsyncErrors(async(req, res, next) => {

// })
