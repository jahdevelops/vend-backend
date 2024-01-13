const db = require("../../model");
const User = db.user;
const { requiredField } = require("../../messages/error.messages");
const catchAsyncErrors = require("../../middlewares/catchAsyncErrors");
const ErrorHandler = require("../../utils/errorHandler");

exports.becomeASeller = catchAsyncErrors(async (req, res, next) => {
  const { id, role } = req.user;
  const { id_number } = req.body;
  if (!id_number) {
    return next(new ErrorHandler(requiredField.message, requiredField.code));
  }
  if (role === "seller") {
    return next(new ErrorHandler("Already a seller", 400));
  }
  await User.update(
    { id_number: id_number },
    {
      where: { id: id },
    },
  );
  return res
    .status(200)
    .json({ success: true, message: "Please wait for admin approval" });
});
