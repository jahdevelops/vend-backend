/* eslint-disable no-unused-vars */
const db = require("../../model");
const Order = db.order;
const catchAsyncErrors = require("../../middlewares/catchAsyncErrors");
const ErrorHandler = require("../../utils/errorHandler");

exports.editOrderStatus = catchAsyncErrors(async (req, res, next) => {
    const {id} = req.params;
    const {status} = req.body;
    const statuses = ["pending", "processing", "shipped", "delivered"];
    if (!status || !statuses.includes(status)) {
        return next(
            new ErrorHandler("Invalid order status", 400),
        );
    };
    const order = await Order.findOne({
        where: {id},
        attributes: ['status', 'id']
    });
    if (!order) {
        return next(
            new ErrorHandler("Invalid order ID", 400),
        );
    };
    const currentOrderStatus = order.status;
    if (currentOrderStatus === status) {
        return res.status(200).json({
            success: true,
            message: 'order status remains unchanged'
        });
    };
    if (currentOrderStatus === 'delivered') {
        return next(
            new ErrorHandler("Cannot update status as the order has already been delievered", 400),
        );
    };
    order.status = status;
    await order.save();
    const response = {
        success: true,
        message: `Order status changed from ${currentOrderStatus} to ${status}`
    };
    res.status(200).json(response)
})