/* eslint-disable no-undef */
require("dotenv/config");
const { database } = require("../config");

module.exports = {
  host: database.host,
  port: database.port,
  username: database.user,
  password: database.password,
  database: database.database,
  dialect: "mysql",
  logging: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  // development: {
  //     host: database.host,
  //     port: database.port,
  //     username: database.user,
  //     password: database.password,
  //     database: database.database,
  //     dialect: "mysql",
  //     logging: false,
  // },
  // production: {
  //     username: process.env.DB_USERNAME,
  //     password: process.env.DB_PASSWORD,
  //     database: process.env.DB_NAME,
  //     host: process.env.DB_HOST,
  //     dialect: "mysql",
  //     logging: false,
  //     dialectOptions: {
  //         ssl: {
  //             rejectUnauthorized: false,
  //         },
  //     },
  // },
  // test: {
  //     username: "test_user",
  //     password: "test_password",
  //     database: "ecommerce_test",
  //     host: "localhost",
  //     dialect: "mysql",
  //     logging: false,
  // },
};
