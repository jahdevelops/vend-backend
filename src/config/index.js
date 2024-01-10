/* eslint-disable no-undef */
require('dotenv').config()
exports.jwt_secret = process.env.jwt_secret;
exports.mail = {
    host: process.env.smpt_host,
    port: process.env.smpt_port,
    service: process.env.smpt_service,
    user: process.env.smpt_mail,
    pass: process.env.smpt_password,
    smpt: process.env.smpt,
};

exports.database = {
    host: process.env.db_host,
    port: process.env.db_port,
    user: process.env.db_user,
    password: process.env.db_password,
    database: process.env.db_database,
};

exports.url = {
    client: process.env.client_url || "http://localhost:3000",
};