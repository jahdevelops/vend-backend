const mysql = require("../db");
const { findUserById, updateUserPhone } = require("../db/sql");
const { userNotFound, requiredField } = require("../messages/error.messages");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const ErrorHandler = require("../utils/errorHandler");

exports.getMe = catchAsyncErrors(async(req, res, next) => {
    const { id } = req.user;
    mysql.query(findUserById, [id], (err, data) => {
        if (err) return next(new ErrorHandler(err.message, 500));
        if (!data.length) {
            return next(new ErrorHandler(userNotFound.message, userNotFound.code));
        }
        return res.status(200).json({
            message: "User data",
            user: data[0],
        });
    });
});

exports.updateUser = catchAsyncErrors(async(req, res, next) => {
    const { id } = req.user;
    const { phoneNumber } = req.body;

    if (!phoneNumber)
        return next(new ErrorHandler(requiredField.message, requiredField.code));

    mysql.query(findUserById, [id], (err, data) => {
        if (err) return next(new ErrorHandler(err.message, 500));
        if (!data.length) {
            return next(new ErrorHandler(userNotFound.message, userNotFound.code));
        }
        mysql.query(updateUserPhone, [phoneNumber, id], (err) => {
            if (err) return next(new ErrorHandler(err.message, 500));

            return res
                .status(200)
                .json({ message: "Phone number updated successfully" });
        });
    });
});