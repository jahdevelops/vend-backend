const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require("jsonwebtoken");
const { jwt_secret } = require("../config");
const { userNotFound } = require("../messages/error.messages");
const db = require("../model");
const User = db.user;
exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return next(
      new ErrorHandler(
        "Please Login to access this resource / No Authorization token present",
        401,
      ),
    );
  }
  const token = authHeader.split(" ")[1];
  const decodedData = jwt.verify(token, jwt_secret);
  const user = await User.findOne({ where: { id: decodedData.id } });
  if (!user)
    return next(new ErrorHandler(userNotFound.message, userNotFound.code));
  req.user = user;
  next();
});
exports.authorizeRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `Role: ${req.user.role} is not allowed to access this resource`,
          403,
        ),
      );
    }
    next();
  };
};
exports.checkVerified = catchAsyncErrors(async (req, res, next) => {
  const user = req.user;
  if (!user.isVerified) {
    return res.status(403).json({
      success: false,
      message: "Account not verified, Please Verify account",
    });
  }
  next();
});
