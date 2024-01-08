const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const sendToken = require("../utils/jwtToken");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const bcrypt = require("bcryptjs");
const mysql = require("../db");
const { findUserByEmail, createUser, findUserById } = require("../db/sql");

exports.register = catchAsyncErrors(async(req, res, next) => {
    const { email, first_name, last_name, password } = req.body;
    mysql.query(findUserByEmail, [email], (err, data) => {
        if (err) return next(new ErrorHandler("Database error", 500));
        if (data.length) return next(new ErrorHandler("User already exist", 409));

        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);
        const id = crypto.randomUUID();
        const values = [id, first_name, last_name, email, hash, "buyer", false];

        mysql.query(createUser, [values], (err, data) => {
            if (err) return next(new ErrorHandler("Database error", 500));
            mysql.query(findUserById, [id], (err, data) => {
                if (err) return console.error(err);
                if (data.length) {
                    return res
                        .status(201)
                        .json({ message: "User created Successfully", user: data[0] });
                }
            });
        });
    });
});

exports.login = catchAsyncErrors(async(req, res, next) => {
    const { email } = req.body;
    mysql.query(findUserByEmail, [email], (err, data) => {
        if (err) return next(new ErrorHandler("Database error", 500));
        if (data.length === 0)
            return next(new ErrorHandler("email or password is incorrect", 400));

        const isPasswordCorrect = bcrypt.compareSync(req.body.password, data[0].password);

        if (!isPasswordCorrect)
            return next(new ErrorHandler("email or password is incorrect ", 400));

        const token = jwt.sign({ id: data[0].id, isVerified: data[0].isVerified },
            process.env.jwt_secret
        );

        const { password, ...other } = data[0];

        return res
            .status(200)
            .json({ message: "User logged Successfully", user: other, token });
    });
});