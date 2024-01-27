/* eslint-disable no-undef */
require("dotenv").config();

module.exports = {
  development: {
    username: process.env.db_user,
    password: process.env.db_password,
    database: process.env.db_database,
    host: process.env.db_host,
    port: process.env.db_port,
    dialect: "mysql",
  },
  test: {
    username: "root",
    password: null,
    database: "vend",
    host: "127.0.0.1",
    dialect: "mysql",
  },
  production: {
    username: "root",
    password: null,
    database: "vend",
    host: "127.0.0.1",
    dialect: "mysql",
  },
};
