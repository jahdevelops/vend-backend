exports.userNotFound = {
  message: "User not found",
  code: 404,
};

exports.requiredField = {
  message: "Please provide all required fields",
  code: 422,
};

exports.alreadyExistUser = {
  message: "User already exists",
  code: 409,
};
exports.tokenNotFound = {
  message: "Invalid or expired token",
  code: 400,
};

exports.alreadyVerifiedEmail = {
  message: "Email already verified",
  code: 400,
};

exports.invalidPasswordFormat = {
  message:
    "Password must contain at least one capital letter, one special character, one number, one small letter, and be at least 8 characters long",
  code: 400,
};
exports.unMatchedPassword = {
  message: "Password does not match",
  code: 400,
};

//products

exports.productNotFound = {
  message: "Product not found",
  code: 404,
};

//orders
exports.orderNotFound = {
  message: "order not found",
  code: 404,
};
