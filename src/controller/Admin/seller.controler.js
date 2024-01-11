const mysql = require("../../db");
const {
  getPendingSellers,
  findUserById,
  updateBuyerToSeller,
} = require("../../db/sql");
const {
  requiredField,
  userNotFound,
} = require("../../messages/error.messages");
const catchAsyncErrors = require("../../middlewares/catchAsyncErrors");
const ErrorHandler = require("../../utils/errorHandler");
const sendEmail = require("../../utils/sendMail");

exports.getPendingSellers = catchAsyncErrors(async (req, res, next) => {
  mysql.query(getPendingSellers, (err, data) => {
    if (err) return next(new ErrorHandler(err.message, 500));

    return res
      .status(200)
      .json({ success: true, message: "Pending Sellers", users: data });
  });
});
exports.approveNewSeller = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  if (!id)
    return next(new ErrorHandler(requiredField.message, requiredField.code));
  mysql.query(findUserById, [id], (err, data) => {
    if (err) return next(new ErrorHandler(err.message, 500));
    if (!data.length)
      return next(new ErrorHandler(userNotFound.message, userNotFound.code));
    if (data[0].id_number === null)
      return next(new ErrorHandler("User is yet to update Id Number", 400));
    if (data[0].role === "seller")
      return next(new ErrorHandler("User is already a seller", 400));
    mysql.query(updateBuyerToSeller, ["seller", id], async (err) => {
      if (err) return next(new ErrorHandler(err.message, 500));
      await sendEmail({
        email: `${data[0].first_name} <${data[0].email}>`,
        subject: "Seller Approval",
        html: "Congratulations!!! You're now a seller",
      })
        .then(() => {
          return res.status(200).json({
            success: true,
            message: "User updated successfully",
          });
        })
        .catch((err) => {
          return next(new ErrorHandler(err.message, 500));
        });
    });
  });
});
