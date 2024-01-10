/* eslint-disable no-unused-vars */
const ErrorHandler = require("../utils/errorHandler");

module.exports = (err, req, res, next) => {
  // console.log(err);
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  //Wrong JWT error
  if (err.name === "jsonwebTokenError") {
    const message = `Json Web Token is invalid, Try again`;
    err = new ErrorHandler(message, 400);
  }
  //JWT Expire error
  if (err.name === "TokenExpiredError") {
    const message = `Json Web Token is Expired, Try again`;
    err = new ErrorHandler(message, 400);
  }
  // if (err.sql) {
  //     const message = err.sqlMessage;
  //     err = new ErrorHandler(message, 500);
  // }

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};
