require("dotenv/config");
const mysql = require("mysql2");
const { database } = require("../config");

// const crypto = require("crypto");
const mysqlConnect = mysql.createConnection({
  host: database.host,
  port: database.port,
  user: database.user,
  password: database.password,
  database: database.database,
});

mysqlConnect.query("CREATE DATABASE IF NOT EXISTS vend");

mysqlConnect.connect(async (err) => {
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
    role ENUM('buyer', 'seller', 'admin'),
    isVerified BOOLEAN,
    phoneNumber VARCHAR(11),
    id_number VARCHAR(26),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)
`;

    const createTokenTable = `CREATE TABLE IF NOT EXISTS token (
    id VARCHAR(36) PRIMARY KEY,
    userId VARCHAR(255),
    token VARCHAR(255),
    type ENUM('reset_password', 'verify_email', 'refresh_token'),
    expiresAt TIMESTAMP,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,  
    FOREIGN KEY (userId) REFERENCES users(id)
)`;

    const createBrandTable = `CREATE TABLE IF NOT EXISTS brands (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)`;
    const createCategoryTable = `CREATE TABLE IF NOT EXISTS categories (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)`;
    const createStockTable = `CREATE TABLE IF NOT EXISTS stocks (
    id VARCHAR(36) PRIMARY KEY,
    productId VARCHAR(36),
    quantity INT NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
`;
    const createProductTable = `CREATE TABLE IF NOT EXISTS product (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    main_image VARCHAR(255),
    sub_images JSON,
    description TEXT,
    product_details TEXT,
    specifications TEXT,
    userId VARCHAR(36),
    brandId VARCHAR(36),
    categoryId VARCHAR(36),
    stockId VARCHAR(36),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id),
    FOREIGN KEY (brandId) REFERENCES brands(id),
    FOREIGN KEY (categoryId) REFERENCES categories(id),
    FOREIGN KEY (stockId) REFERENCES stocks(id)
)`;

    //         const createBrandTable = `CREATE TABLE IF NOT EXISTS brands (
    //     id VARCHAR(36) PRIMARY KEY,
    //     name VARCHAR(255) NOT NULL,
    //     description TEXT NOT NULL,
    //     createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    //     updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    // )`;
    //         const createCategoryTable = `CREATE TABLE IF NOT EXISTS categories (
    //     id VARCHAR(36) PRIMARY KEY,
    //     name VARCHAR(255) NOT NULL,
    //     createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    //     updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    // )`;
    //         const createStockTable = `CREATE TABLE IF NOT EXISTS stocks (
    //     id VARCHAR(36) PRIMARY KEY,
    //     productId VARCHAR(36),
    //     quantity INT NOT NULL,
    //     createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    //     updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    //      FOREIGN KEY (productId) REFERENCES product(id)
    // );
    // `;

    // const insertBrandData = `
    //         INSERT INTO brands(id, name, description) VALUES('${ crypto.randomUUID() }', 'HP', 'Hawelt Packard'),
    //             ('${ crypto.randomUUID() }', 'iPhone', 'apple'),
    //             ('${ crypto.randomUUID() }', 'MacBook', 'apple')
    //         `;

    // const insertCategoryData = `
    //         INSERT INTO categories(id, name) VALUES('${ crypto.randomUUID() }', 'phone'),
    //             ('${ crypto.randomUUID() }', 'laptop'),
    //             ('${ crypto.randomUUID() }', 'food')
    //         `;
    mysqlConnect.query(createUsersTable, (err) => {
      if (err) return console.error("Error creating table", err);
    });
    mysqlConnect.query(createTokenTable, (err) => {
      if (err) return console.error("Error creating table", err);
    });
    mysqlConnect.query(createProductTable, (err) => {
      if (err) return console.error("Error creating table", err);
    });
    mysqlConnect.query(createBrandTable, (err) => {
      if (err) return console.error("Error creating table", err);
      // mysqlConnect.query(insertBrandData, (err) => {
      //     if (err)
      //         return console.error(
      //             "Error inserting data into categories table",
      //             err
      //         );
      //     console.log("Data inserted into categories table");
      // });
    });
    mysqlConnect.query(createCategoryTable, (err) => {
      if (err) return console.error("Error creating table", err);
      // mysqlConnect.query(insertCategoryData, (err) => {
      //     if (err)
      //         return console.error(
      //             "Error inserting data into categories table",
      //             err
      //         );
      //     console.log("Data inserted into categories table");
      // });
    });
    mysqlConnect.query(createStockTable, (err) => {
      if (err) return console.error("Error creating table", err);
    });
  });
} catch (error) {
  console.error("Error connecting to the database:", error);
}

module.exports = mysqlConnect;
