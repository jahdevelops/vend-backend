const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const sendEmail = require("../utils/sendMail");
const bcrypt = require("bcryptjs");
const db = require("../model");
const { Op, literal } = require("sequelize");
const ms = require("ms");
const {
  requiredField,
  alreadyExistUser,
  userNotFound,
  alreadyVerifiedEmail,
  tokenNotFound,
  invalidPasswordFormat,
  unMatchedPassword,
} = require("../messages/error.messages");

const User = db.user;
const Token = db.token;
const { jwt_secret, url } = require("../config");
// eslint-disable-next-line no-unused-vars
const { seed } = require("./seed");

exports.register = catchAsyncErrors(async (req, res, next) => {
  const { email, first_name, last_name, password, role } = req.body;
  if (!email || !first_name || !last_name || !password) {
    return next(new ErrorHandler(requiredField.message, requiredField.code));
  };
  if (!['courier', 'admin', 'buyer', 'seller'].includes(role)) {
    return next(new ErrorHandler("Invalid role selected", requiredField.code));
  };
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);

  const isExisting = await User.findOne({ where: { email: email } });
  if (isExisting) {
    return next(
      new ErrorHandler(alreadyExistUser.message, alreadyExistUser.code),
    );
  }
  const passwordValidate = await validatePassword(password);
  if (!passwordValidate) {
    return next(
      new ErrorHandler(
        invalidPasswordFormat.message,
        invalidPasswordFormat.code,
      ),
    );
  }
  const user = await User.create({
    email: email,
    first_name: first_name,
    last_name: last_name,
    password: hash,
    role,
    isVerified: false,
  });

  const verifyToken = crypto.randomBytes(32).toString("hex");
  const tokenHash = await bcrypt.hash(verifyToken, 10);
  const expiresAt = new Date(Date.now() + ms("15 min"))
    .toISOString()
    .slice(0, 19)
    .replace("T", " ");

  await Token.create({
    userId: user.id,
    token: tokenHash,
    type: "verify_email",
    expiresAt: expiresAt,
  });
  const link = `${url.client}/email-verification?uid=${user.id}&verifyToken=${verifyToken}`;
  const body = `Your email Verification Token is :-\n\n ${link} (This is only available for 15 Minutes!)\n\nif you have not requested this email  then, please Ignore it`;
  await sendEmail({
    email: `${user.first_name} <${user.email}>`,
    subject: "Verify Account",
    html: body,
  });
  return res.status(201).json({
    success: true,
    message: "User created Successfully",
    user,
  });
});

exports.login = catchAsyncErrors(async (req, res, next) => {
  // await seed();
  const { email, role } = req.body;
  if (!email || !role) {
    return next(new ErrorHandler(requiredField.message, requiredField.code));
  };

  // Use the 'attributes' option to select specific fields
  const withPassword = await User.findOne({
    where: { email: email, role: role },
    attributes: ["password", "role"],
  });
  if (!withPassword)
    return next(new ErrorHandler("Email or password is incorrect", 400));

  const isPasswordCorrect = bcrypt.compareSync(
    req.body.password,
    withPassword.password,
  );

  if (!isPasswordCorrect)
    return next(new ErrorHandler("Email or password is incorrect", 400));
  const user = await User.findOne({
    where: { email: email },
  });
  const { refreshToken, accessToken } = await generateAuthToken(
    user.id,
    user.role,
    user.isVerified,
  );
  const expires = new Date(Date.now() + 1 * 24 * 60 * 60 * 1000);
  res.cookie("refresh", refreshToken, {
    expires,
    httpOnly: true,
  });
  return res.status(200).json({
    success: true,
    message: "User logged in successfully",
    user,
    token: accessToken,
  });
});

exports.logout = catchAsyncErrors(async (req, res, next) => {
  const { refresh } = req.cookies;
  const decoded = jwt.verify(refresh, jwt_secret);
  const { refreshToken, userId } = decoded;
  const user = await User.findOne({ where: { id: userId } });
  if (!user) {
    return next(new ErrorHandler(userNotFound.message, userNotFound.code));
  }

  const token = await Token.findAll({
    where: { userId, type: "refresh_token" },
  });
  if (!token.length) {
    return next(new ErrorHandler(tokenNotFound.message, tokenNotFound.code));
  }
  let tokenExists = false;
  for (const Rtoken of token) {
    const isValid = await bcrypt.compare(refreshToken, Rtoken.token);
    if (isValid) {
      tokenExists = true;
      await Rtoken.destroy();

      break;
    }
  }
  if (!tokenExists) {
    new ErrorHandler(tokenNotFound.message, tokenNotFound.code);
  }
  res.clearCookie("refresh");
  return res.status(200).json({
    success: true,
    message: "User Logged out successfully",
  });
});

exports.refreshToken = catchAsyncErrors(async (req, res, next) => {
  const { refresh } = req.cookies;

  const decoded = jwt.verify(refresh, jwt_secret);
  let { refreshToken } = decoded;
  const { userId } = decoded;

  const user = await User.findOne({ where: { id: userId } });

  if (!user) {
    return next(new ErrorHandler(userNotFound.message, userNotFound.code));
  }
  const token = await Token.findAll({
    where: { userId, type: "refresh_token" },
  });
  if (!token.length) {
    return next(new ErrorHandler(tokenNotFound.message, tokenNotFound.code));
  }
  let tokenExists = false;
  for (const Rtoken of token) {
    const isValid = await bcrypt.compare(refreshToken, Rtoken.token);
    if (isValid) {
      tokenExists = true;
      await Rtoken.destroy();

      break;
    }
  }
  if (!tokenExists) {
    new ErrorHandler(tokenNotFound.message, tokenNotFound.code);
  }
  const accessToken = jwt.sign(
    {
      id: userId,
      role: user.role,
      isVerified: user.isVerified,
    },
    jwt_secret,
    { expiresIn: "30 min" },
  );
  refreshToken = crypto.randomBytes(32).toString("hex");
  const hash = await bcrypt.hash(refreshToken, 10);

  const refreshTokenJWTNew = jwt.sign({ userId, refreshToken }, jwt_secret, {
    expiresIn: "1 day",
  });
  const expiresAt = new Date(Date.now() + ms("1 min"))
    .toISOString()
    .slice(0, 19)
    .replace("T", " ");
  await Token.create({
    userId: user.id,
    token: hash,
    type: "refresh_token",
    expiresAt: expiresAt,
  });
  const expires = new Date(Date.now() + 1 * 24 * 60 * 60 * 1000);
  res.cookie("refresh", refreshTokenJWTNew, {
    expires,
    httpOnly: true,
  });
  return res.status(200).json({
    success: true,
    message: "New Access Token",
    token: accessToken,
  });
});

exports.verifyEmail = catchAsyncErrors(async (req, res, next) => {
  const { userId, token: verifyToken } = req.body;
  if (!userId || !verifyToken) {
    return next(new ErrorHandler(requiredField.message, requiredField.code));
  }
  const user = await User.findOne({ where: { id: userId } });

  if (!user) {
    return next(new ErrorHandler(userNotFound.message, userNotFound.code));
  }
  if (user.isVerified) {
    return next(
      new ErrorHandler(alreadyVerifiedEmail.message, alreadyVerifiedEmail.code),
    );
  }
  const token = await Token.findOne({
    where: {
      userId: userId,
      type: "verify_email",
      expiresAt: {
        [Op.gte]: literal("NOW()"),
      },
    },
  });
  if (!token) {
    return next(new ErrorHandler(tokenNotFound.message, tokenNotFound.code));
  }
  const isValid = await bcrypt.compare(verifyToken, token.token);
  if (!isValid) {
    return next(new ErrorHandler(tokenNotFound.message, tokenNotFound.code));
  }
  await user.update({ isVerified: true });
  await sendEmail({
    email: `${user.first_name} <${user.email}>`,
    subject: "Account Verified Succefully",
    html: "Your account has be verified successfully",
  }).catch((err) => {
    return next(new ErrorHandler(err.message, 500));
  });
  return res.status(200).json({
    success: true,
    message: "Email Verified Successfully",
  });
});

exports.requestEmailVerification = catchAsyncErrors(async (req, res, next) => {
  const { email } = req.query;
  if (!email) {
    return next(new ErrorHandler(requiredField.message, requiredField.code));
  }
  const user = await User.findOne({ where: { email: email } });

  if (!user) {
    return next(new ErrorHandler(userNotFound.message, userNotFound.code));
  }
  if (user.isVerified) {
    return next(
      new ErrorHandler(alreadyVerifiedEmail.message, alreadyVerifiedEmail.code),
    );
  }
  const token = await Token.findOne({
    where: {
      userId: user.id,
      type: "verify_email",
    },
  });
  if (token) {
    await token.destroy();
  }
  const verifyToken = crypto.randomBytes(32).toString("hex");
  const hash = await bcrypt.hash(verifyToken, 10);
  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + 15);
  await Token.create({
    userId: user.id,
    token: hash,
    type: "verify_email",
    expiresAt: expiresAt,
  });
  const link = `${url.clientl}/email-verification?uid=${user.id}&verifyToken=${verifyToken}`;
  const body = `Your email Verification Token is :-\n\n ${link} (This is only available for 15 Minutes!)\n\nif you have not requested this email  then, please Ignore it`;
  await sendEmail({
    email: `${user.first_name} <${user.email}>`,
    subject: "Veritfy Account",
    html: body,
  });
  return res.status(200).json({
    success: true,
    message: "Email Verification token sent",
  });
});

exports.requestPasswordReset = catchAsyncErrors(async (req, res, next) => {
  const { email } = req.query;
  if (!email) {
    return next(new ErrorHandler(requiredField.message, requiredField.code));
  }
  const user = await User.findOne({ where: { email: email } });

  if (!user) {
    return next(new ErrorHandler(userNotFound.message, userNotFound.code));
  }
  const token = await Token.findOne({
    where: {
      userId: user.id,
      type: "reset_password",
    },
  });
  if (token) {
    await token.destroy();
  }

  const resetToken = crypto.randomBytes(32).toString("hex");
  const hash = await bcrypt.hash(resetToken, 10);
  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + 15);
  await Token.create({
    userId: user.id,
    token: hash,
    type: "reset_password",
    expiresAt: expiresAt,
  });
  const link = `${url.client}/auth/reset-password/${user.id}/${resetToken}`;
  const body = `Your password reset Token is :-\n\n ${link} (This is only available for 15 Minutes!)\n\nif you have not requested this email  then, please Ignore it`;
  await sendEmail({
    email: `${user.first_name} <${user.email}>`,
    subject: "Reset Password",
    html: body,
  });
  return res.status(200).json({
    success: true,
    message: "Password reset token sent",
  });
});

exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
  const { userId, newPassword, confirmPassword, resetToken } = req.body;
  if (!newPassword || !confirmPassword || !resetToken || !userId) {
    return next(new ErrorHandler(requiredField.message, requiredField.code));
  }
  const passwordValidate = await validatePassword(newPassword);
  if (!passwordValidate) {
    return next(
      new ErrorHandler(
        invalidPasswordFormat.message,
        invalidPasswordFormat.code,
      ),
    );
  }
  if (newPassword !== confirmPassword) {
    return next(
      new ErrorHandler(unMatchedPassword.message, unMatchedPassword.code),
    );
  }

  const user = await User.findOne({ where: { id: userId } });
  if (!user) {
    return next(
      new ErrorHandler(alreadyExistUser.message, alreadyExistUser.code),
    );
  }
  const token = await Token.findOne({
    where: {
      userId: userId,
      type: "reset_password",
      expiresAt: {
        [Op.gte]: literal("NOW()"),
      },
    },
  });
  if (!token) {
    return next(new ErrorHandler(tokenNotFound.message, tokenNotFound.code));
  }

  const isValid = await bcrypt.compare(resetToken, token.token);
  if (!isValid) {
    return next(new ErrorHandler(tokenNotFound.message, tokenNotFound.code));
  }
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(newPassword, salt);

  await User.update(
    { password: hash },
    {
      where: { id: userId },
    },
  );
  await token.destroy();
  await sendEmail({
    email: `${user.first_name} <${user.email}>`,
    subject: "Password Updated Successfully",
    html: "Your password has been updated successfully",
  }).catch((err) => {
    return next(new ErrorHandler(err.message, 500));
  });
  return res.status(200).json({
    success: true,
    message: "Password updated successfully",
  });
});

exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;
  const { id } = req.user;
  if (!id || !oldPassword || !newPassword || !confirmPassword) {
    return next(new ErrorHandler(requiredField.message, requiredField.code));
  }

  if (newPassword !== confirmPassword) {
    return next(
      new ErrorHandler(unMatchedPassword.message, unMatchedPassword.code),
    );
  }
  const isValidPassword = await validatePassword(newPassword);

  if (!isValidPassword) {
    return next(
      new ErrorHandler(
        invalidPasswordFormat.message,
        invalidPasswordFormat.code,
      ),
    );
  }

  const user = await User.findOne({
    where: { id: id },
    attributes: ["password"],
  });
  if (!user)
    return next(new ErrorHandler("Email or password is incorrect", 400));
  const isPasswordCorrect = bcrypt.compareSync(oldPassword, user.password);

  if (!isPasswordCorrect) {
    return next(new ErrorHandler("Incorrect Password", 400));
  }
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(newPassword, salt);
  await User.update(
    { password: hash },
    {
      where: { id: id },
    },
  );
  return res.status(200).json({
    success: true,
    message: "Password updated successfully",
  });
});

const generateAuthToken = async (userId, role, isVerified) => {
  const accessToken = jwt.sign(
    { id: userId, role: role, isVerified: isVerified },
    jwt_secret,
    { expiresIn: "30 min" },
  );
  const refreshToken = crypto.randomBytes(32).toString("hex");
  const hash = await bcrypt.hash(refreshToken, 10);

  const refreshTokenJWT = jwt.sign({ userId, refreshToken }, jwt_secret, {
    expiresIn: "1 day",
  });
  const expiresAt = new Date(Date.now() + ms("1 day"))
    .toISOString()
    .slice(0, 19)
    .replace("T", " ");
  await Token.create({
    userId: userId,
    token: hash,
    type: "refresh_token",
    expiresAt: expiresAt,
  });
  return { accessToken, refreshToken: refreshTokenJWT };
};

const validatePassword = (password) => {
  const capitalLetterRegex = /[A-Z]/;
  const specialCharRegex = /[!@#$%^&*]/;
  const numberRegex = /[0-9]/;
  const smallLetterRegex = /[a-z]/;

  return (
    capitalLetterRegex.test(password) &&
    specialCharRegex.test(password) &&
    numberRegex.test(password) &&
    smallLetterRegex.test(password) &&
    password.length >= 8
  );
};
