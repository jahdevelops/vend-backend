require("dotenv/config");
const mysql = require("mysql2");
const { database } = require("../config");
const mysqlConnect = mysql.createConnection({
    host: database.host,
    port: database.port,
    user: database.user,
    password: database.password,
    database: database.database,
});

mysqlConnect.query("CREATE DATABASE IF NOT EXISTS vend");

mysqlConnect.connect(async(err) => {
    if (err) {
        console.error(err);
        return;
    } else {
        console.log("::>🚀Database connected");
    }
});

try {
    mysqlConnect.query("USE vend", (err) => {
        if (err) {
            console.error(err);
            return;
        }
        const createUsersTable = `CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    password VARCHAR(255),
    role VARCHAR(255),
    isVerified BOOLEAN,
    emailToken VARCHAR(255),
    emailTokenExpire TIMESTAMP,  
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
`;

        const createTokenTable = `CREATE TABLE IF NOT EXISTS token (
    id VARCHAR(36) PRIMARY KEY,
    userId VARCHAR(255),
    token VARCHAR(255),
    type ENUM('reset_password', 'verify_email', 'refresh_token'),
    expiresAt TIMESTAMP,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)`;

        mysqlConnect.query(createUsersTable, (err) => {
            if (err) return console.error("Error creating table", err);
        });
        mysqlConnect.query(createTokenTable, (err) => {
            if (err) return console.error("Error creating table", err);
        });
    });
} catch (error) {
    console.error("Error connecting to the database:", error);
}

module.exports = mysqlConnect;