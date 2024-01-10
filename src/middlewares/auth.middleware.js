const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require("jsonwebtoken");
const mysqlConnect = require("../db");
const { findUserById } = require("../db/sql");
const { jwt_secret } = require("../config");
const { userNotFound } = require("../messages/error.messages");

exports.isAuthenticatedUser = catchAsyncErrors(async(req, res, next) => {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
        return next(
            new ErrorHandler(
                "Please Login to access this resource / No Authorization token present",
                401
            )
        );
    }
    const token = authHeader.split(" ")[1];
    const decodedData = jwt.verify(token, jwt_secret);
    mysqlConnect.query(findUserById, [decodedData.id], (err, data) => {
        if (err) return next(new ErrorHandler(err.message, 500));
        if (!data.length)
            return next(new ErrorHandler(userNotFound.message, userNotFound.code));
        req.user = data[0];
        next();
    });
});
exports.authorizeRole = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(
                new ErrorHandler(
                    `Role: ${req.user.role} is not allowed to access this resource`,
                    403
                )
            );
        }
        next();
    };
};
exports.checkVerified = catchAsyncErrors(async(req, res, next) => {
    const user = req.user;
    if (!user.isVerified) {
        return res.status(403).json({
            success: false,
            message: "Account not verified, Please Verify account",
        });
    }
    next();
});