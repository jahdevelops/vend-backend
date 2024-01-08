const app = require("./app");
// const cloudinary = require("cloudinary");
require("dotenv").config();

process.on("uncaughtException", (err) => {
    console.log(`Error: $err: ${err.message}`);
    console.log(`Shutting down the server due to uncaught Expectation`);
    process.exit(1);
});

// cloudinary.config({
//     cloud_name: process.env.CLOUDINARY_NAME,
//     api_key: process.env.CLOUDINARY_APIKEY,
//     api_secret: process.env.CLOUDINARY_SECRET,
// });

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