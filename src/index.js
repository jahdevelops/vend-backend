/* eslint-disable no-undef */
const app = require("./app");
require("express-async-errors");
const cloudinary = require("cloudinary");
require("dotenv").config();
const { cloudinaryConfig } = require("./config");

process.on("uncaughtException", (err) => {
    console.log(`Error: $err: ${err.message}`);
    console.log(`Shutting down the server due to uncaught Expectation`);
    process.exit(1);
});

cloudinary.config({
    cloud_name: cloudinaryConfig.name,
    api_key: cloudinaryConfig.key,
    api_secret: cloudinaryConfig.secret,
});

app.listen(process.env.port, () => {
    console.log(`Server is working on http://localhost:${process.env.PORT}`);
});

process.on("unhandledRejection", (err) => {
    console.log(`Error: $err: ${err.message}`);
    console.log(`Shutting down the server due to unhandled promise Rejection`);

    server.close(() => {
        process.exit(1);
    });
});