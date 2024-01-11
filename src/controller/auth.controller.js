const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const sendEmail = require("../utils/sendMail");
const bcrypt = require("bcryptjs");
const mysql = require("../db");
const {
  findUserByEmail,
  createUser,
  findUserById,
  createToken,
  findToken,
  deleteToken,
  deleteTokenOne,
  updateUserPassword,
  updateUserVerification,
  findUserWithPassword,
} = require("../db/sql");
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
const { jwt_secret, url } = require("../config");

exports.register = catchAsyncErrors(async (req, res, next) => {
  const { email, first_name, last_name, password } = req.body;
  if (!email || !first_name || !last_name || !password) {
    return next(new ErrorHandler(requiredField.message, requiredField.code));
  }
  mysql.query(findUserByEmail, [email], async (err, data) => {
    if (err) {
      return next(new ErrorHandler(err.message, 500));
    }
    if (data.length)
      return next(
        new ErrorHandler(alreadyExistUser.message, alreadyExistUser.code),
      );

    const passwordValidate = await validatePassword(password);
    if (!passwordValidate) {
      return next(
        new ErrorHandler(
          invalidPasswordFormat.message,
          invalidPasswordFormat.code,
        ),
      );
    }
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    const id = crypto.randomUUID();

    const values = [id, first_name, last_name, email, hash, "buyer", false];

    mysql.query(createUser, [values], (err) => {
      if (err) {
        return next(new ErrorHandler(err.message, 500));
      }
      mysql.query(findUserById, [id], async (err, data) => {
        if (err) return next(new ErrorHandler(err.message, 500));
        if (data.length) {
          const verifyToken = crypto.randomBytes(32).toString("hex");
          const hash = await bcrypt.hash(verifyToken, 10);
          const id = crypto.randomUUID();

          //TODO: move this to a seperate function

          const expiresAt = new Date(Date.now() + ms("15 min"))
            .toISOString()
            .slice(0, 19)
            .replace("T", " ");
          const values = [id, data[0].id, hash, "verify_email", expiresAt];
          mysql.query(createToken, [values], async (err) => {
            if (err) {
              throw new Error(err.message);
            }

            const link = `${url.client}/email-verification?uid=${data[0].id}&verifyToken=${verifyToken}`;
            const body = `Your email Verification Token is :-\n\n ${link} (This is only available for 15 Minutes!)\n\nif you have not requested this email  then, please Ignore it`;
            await sendEmail({
              email: `${data[0].first_name} <${data[0].email}>`,
              subject: "Veritfy Account",
              html: body,
            })
              .then(() => {
                return res.status(201).json({
                  success: true,
                  message: "User created Successfully",
                  user: data[0],
                });
              })
              .catch((err) => {
                return next(new ErrorHandler(err.message, 500));
              });
          });
        }
      });
    });
  });
});

exports.login = catchAsyncErrors(async (req, res, next) => {
  const { email } = req.body;
  mysql.query(findUserByEmail, [email], async (err, data) => {
    if (err) return next(new ErrorHandler("Database error", 500));
    if (data.length === 0)
      return next(new ErrorHandler("email or password is incorrect", 400));

    const isPasswordCorrect = bcrypt.compareSync(
      req.body.password,
      data[0].password,
    );

    if (!isPasswordCorrect)
      return next(new ErrorHandler("email or password is incorrect ", 400));

    const { refreshToken, accessToken } = await generateAuthToken(
      data[0].id,
      data[0].role,
      data[0].isVerified,
    );

    // eslint-disable-next-line no-unused-vars
    const { password, ...other } = data[0];
    const expires = new Date(Date.now() + 1 * 24 * 60 * 60 * 1000);
    res.cookie("refresh", refreshToken, {
      expires,
      httpOnly: true,
    });
    return res.status(200).json({
      success: true,
      message: "User logged Successfully",
      user: other,
      token: accessToken,
    });
  });
});

exports.logout = catchAsyncErrors(async (req, res, next) => {
  const { refresh } = req.cookies;
  const decoded = jwt.verify(refresh, jwt_secret);
  const { refreshToken, userId } = decoded;
  mysql.query(findUserById, [userId], async (err, data) => {
    if (err) return next(new ErrorHandler(err.message, 500));
    if (!data.length)
      return next(new ErrorHandler(userNotFound.message, userNotFound.code));
    mysql.query(
      findToken,
      [data[0].id, "refresh_token"],
      async (err, token) => {
        if (err) return next(new ErrorHandler(err.message, 500));
        if (!token.length) {
          return next(
            new ErrorHandler(tokenNotFound.message, tokenNotFound.code),
          );
        } else {
          let tokenExists = false;
          for (const Rtoken of token) {
            const isValid = await bcrypt.compare(refreshToken, Rtoken.token);
            if (isValid) {
              tokenExists = true;
              mysql.query(
                deleteTokenOne,
                [data[0].id, "refresh_token", Rtoken.id],
                (err) => {
                  if (err) return next(new ErrorHandler(err.message, 500));
                },
              );

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
        }
      },
    );
  });
});

exports.refreshToken = catchAsyncErrors(async (req, res, next) => {
  const { refresh } = req.cookies;

  const decoded = jwt.verify(refresh, jwt_secret);
  let { refreshToken } = decoded;
  const { userId } = decoded;

  mysql.query(findUserById, [userId], async (err, data) => {
    if (err) return next(new ErrorHandler(err.message, 500));
    if (!data.length) {
      return next(new ErrorHandler(userNotFound.message, userNotFound.code));
    }
    mysql.query(findToken, [userId, "refresh_token"], async (err, token) => {
      if (err) return next(new ErrorHandler(err.message));
      if (!token.length) {
        return next(
          new ErrorHandler(tokenNotFound.message, tokenNotFound.code),
        );
      }
      let tokenExists = false;
      for (const Rtoken of token) {
        const isValid = await bcrypt.compare(refreshToken, Rtoken.token);
        if (isValid) {
          tokenExists = true;
          mysql.query(
            deleteTokenOne,
            [data[0].id, "refresh_token", Rtoken.id],
            (err) => {
              if (err) return next(new ErrorHandler(err.message, 500));
            },
          );

          break;
        }
      }
      if (!tokenExists) {
        new ErrorHandler(tokenNotFound.message, tokenNotFound.code);
      }
      const accessToken = jwt.sign(
        {
          id: userId,
          role: data[0].role,
          isVerified: data[0].isVerified,
        },
        jwt_secret,
        { expiresIn: "30 min" },
      );
      refreshToken = crypto.randomBytes(32).toString("hex");
      const hash = await bcrypt.hash(refreshToken, 10);

      const refreshTokenJWTNew = jwt.sign(
        { userId, refreshToken },
        jwt_secret,
        {
          expiresIn: "1 day",
        },
      );
      const id = crypto.randomUUID();
      const expiresAt = new Date(Date.now() + ms("1 min"))
        .toISOString()
        .slice(0, 19)
        .replace("T", " ");
      const values = [id, userId, hash, "refresh_token", expiresAt];
      mysql.query(createToken, [values], (err) => {
        if (err) return next(new ErrorHandler(err.message, 500));
        const expires = new Date(Date.now() + 1 * 24 * 60 * 60 * 1000);
        res.cookie("refresh", refreshTokenJWTNew, {
          expires,
          httpOnly: true,
        });
        return res.status(200).json({
          success: true,
          message: "New Accesstoken",
          token: accessToken,
        });
      });
    });
  });
});

exports.verifyEmail = catchAsyncErrors(async (req, res, next) => {
  const { userId, token: verifyToken } = req.body;
  if (!userId || !verifyToken) {
    return next(new ErrorHandler(requiredField.message, requiredField.code));
  }

  mysql.query(findUserById, [userId], async (err, data) => {
    if (err) return next(new ErrorHandler(err.message, 500));
    if (!data.length) {
      return next(new ErrorHandler(userNotFound.message, userNotFound.code));
    }
    if (data[0].isVerified) {
      return next(
        new ErrorHandler(
          alreadyVerifiedEmail.message,
          alreadyVerifiedEmail.code,
        ),
      );
    }
    mysql.query(findToken, [data[0].id, "verify_email"], async (err, token) => {
      if (err) return next(new ErrorHandler(err.message, 500));
      if (!token.length) {
        return next(
          new ErrorHandler(tokenNotFound.message, tokenNotFound.code),
        );
      }
      const isValid = await bcrypt.compare(verifyToken, token[0].token);
      if (!isValid) {
        return next(
          new ErrorHandler(tokenNotFound.message, tokenNotFound.code),
        );
      }
      console.log(Date.now(), new Date(token[0].expiresAt).getTime());
      // if (Date.now() > new Date(token[0].expiresAt).getTime()) {
      //     return next(
      //         new ErrorHandler(tokenNotFound.message, tokenNotFound.code)
      //     );
      // }

      mysql.query(updateUserVerification, [1, data[0].id], async (err) => {
        if (err) {
          return next(new ErrorHandler(err.message, 500));
        }
        await sendEmail({
          email: `${data[0].first_name} <${data[0].email}>`,
          subject: "Account Verified Succefully",
          html: "Your account has be verified successfully",
        })
          .then(() => {
            return res.status(200).json({
              success: true,
              message: "Email Verified Successfully",
            });
          })
          .catch((err) => {
            return next(new ErrorHandler(err.message, 500));
          });
      });
    });
  });
});

exports.requestEmailVerification = catchAsyncErrors(async (req, res, next) => {
  const { email } = req.query;
  if (!email) {
    return next(new ErrorHandler(requiredField.message, requiredField.code));
  }
  mysql.query(findUserByEmail, [email], async (err, data) => {
    if (err) return { error: err };
    if (!data.length) {
      return next(new ErrorHandler(userNotFound.message, userNotFound.code));
    }
    if (data[0].isVerified) {
      return next(
        new ErrorHandler(
          alreadyVerifiedEmail.message,
          alreadyVerifiedEmail.code,
        ),
      );
    }
    mysql.query(findToken, [data[0].id, "verify_email"], async (err, token) => {
      if (err) {
        return next(new ErrorHandler(err.message, 500));
      }
      if (token.length) {
        mysql.query(deleteToken, [data[0].id, "verify_email"], (err) => {
          if (err) return next(new ErrorHandler(err.message, 500));
        });
      }
      const verifyToken = crypto.randomBytes(32).toString("hex");
      const hash = await bcrypt.hash(verifyToken, 10);
      const id = crypto.randomUUID();
      const expiresAt = new Date(Date.now() + ms("1 min"))
        .toISOString()
        .slice(0, 19)
        .replace("T", " ");
      const values = [id, data[0].id, hash, "verify_email", expiresAt];
      mysql.query(createToken, [values], async (err) => {
        if (err) {
          return next(new ErrorHandler(err.message, 500));
        } else {
          const link = `${url.clientl}/email-verification?uid=${data[0].id}&verifyToken=${verifyToken}`;
          const body = `Your email Verification Token is :-\n\n ${link} (This is only available for 15 Minutes!)\n\nif you have not requested this email  then, please Ignore it`;
          await sendEmail({
            email: `${data[0].first_name} <${data[0].email}>`,
            subject: "Veritfy Account",
            html: body,
          }).then(() => {
            return res.status(200).json({
              success: true,
              message: "Email Verification token sent",
            });
          });
        }
      });
    });
  });
});

exports.requestPasswordReset = catchAsyncErrors(async (req, res, next) => {
  const { email } = req.query;
  if (!email) {
    return next(new ErrorHandler(requiredField.message, requiredField.code));
  }
  mysql.query(findUserByEmail, [email], async (err, data) => {
    if (err) return next(new ErrorHandler(err.message, 500));
    if (!data.length) {
      return next(new ErrorHandler(userNotFound.message, userNotFound.code));
    }
    mysql.query(
      findToken,
      [data[0].id, "reset_password"],
      async (err, token) => {
        if (err) return next(new ErrorHandler(err.message, 500));

        if (token.length) {
          mysql.query(deleteToken, [data[0].id, "reset_password"], (err) => {
            if (err) return next(new ErrorHandler(err.message, 500));
          });
        }
        const resetToken = crypto.randomBytes(32).toString("hex");
        const hash = await bcrypt.hash(resetToken, 10);
        const id = crypto.randomUUID();
        const expiresAt = new Date(Date.now() + ms("15 min"))
          .toISOString()
          .slice(0, 19)
          .replace("T", " ");
        const values = [id, data[0].id, hash, "reset_password", expiresAt];
        mysql.query(createToken, [values], async (err) => {
          if (err) return next(new ErrorHandler(err.message, 500));
          const link = `${url.client}/auth/reset-password/${data[0].id}/${resetToken}`;
          const body = `Your password reset Token is :-\n\n ${link} (This is only available for 15 Minutes!)\n\nif you have not requested this email  then, please Ignore it`;
          await sendEmail({
            email: `${data[0].first_name} <${data[0].email}>`,
            subject: "Reset Password",
            html: body,
          })
            .then(() => {
              return res.status(200).json({
                success: true,
                message: "Password reset token sent",
              });
            })
            .catch((err) => {
              return next(new ErrorHandler(err.message, 500));
            });
        });
      },
    );
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

  mysql.query(findUserById, [userId], async (err, data) => {
    if (err) return next(new ErrorHandler(err.message, 500));
    if (!data.length) {
      return next(new ErrorHandler(userNotFound.message, userNotFound.code));
    }
    mysql.query(findToken, [userId, "reset_password"], async (err, token) => {
      if (err) return next(new ErrorHandler(err.message, 500));
      if (!token.length) {
        return next(
          new ErrorHandler(tokenNotFound.message, tokenNotFound.code),
        );
      }
      const isValid = await bcrypt.compare(resetToken, token[0].token);
      if (!isValid) {
        return next(
          new ErrorHandler(tokenNotFound.message, tokenNotFound.code),
        );
      }
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(newPassword, salt);
      mysql.query(updateUserPassword, [hash, userId], async (err) => {
        if (err) return next(new ErrorHandler(err.message, 500));
        mysql.query(deleteToken, [userId, "reset_password"], (err) => {
          if (err) return next(new ErrorHandler(err.message, 500));
        });
        await sendEmail({
          email: `${data[0].first_name} <${data[0].email}>`,
          subject: "Password Updated Successfully",
          html: "Your password has been updated successfully",
        })
          .then(() => {
            return res.status(200).json({
              success: true,
              message: "Password updated successfully",
            });
          })
          .catch((err) => {
            return next(new ErrorHandler(err.message, 500));
          });
      });
    });
  });
});

exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;
  const { id, email } = req.user;
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
  mysql.query(findUserWithPassword, [email], (err, data) => {
    if (err) return next(new ErrorHandler("Database error", 500));
    if (data.length === 0)
      return next(new ErrorHandler(userNotFound.message, userNotFound.code));

    const isPasswordCorrect = bcrypt.compareSync(oldPassword, data[0].password);

    if (!isPasswordCorrect) {
      return next(new ErrorHandler("Incorrect Password", 400));
    }
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(newPassword, salt);
    mysql.query(updateUserPassword, [hash, id], (err) => {
      if (err) return next(new ErrorHandler(err.message, 500));
      return res.status(200).json({
        success: true,
        message: "Password updated successfully",
      });
    });
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
  const id = crypto.randomUUID();
  const values = [id, userId, hash, "refresh_token", expiresAt];
  mysql.query(createToken, [values], (err) => {
    if (err) throw new Error("Error creating tokens");
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
