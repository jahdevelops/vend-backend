require("dotenv/config");
const mysql = require("mysql2");

const mysqlConnect = mysql.createConnection({
    host: process.env.db_host,
    port: process.env.db_port,
    user: process.env.db_user,
    password: process.env.db_password,
    database: process.env.db_database,
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
    mysqlConnect.query("USE vend", (err, result) => {
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
    emailTokenExpire DATE,  -- Change TIMESTAMP to DATE
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
`;

        mysqlConnect.query(createUsersTable, (err, results, fields) => {
            if (err) {
                console.error("Error creating table", err);
                return;
            }

            console.log("Users table created");
        });
    });
} catch (error) {
    console.error("Error connecting to the database:", error);
}

module.exports = mysqlConnect;