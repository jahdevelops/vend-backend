"use strict";
const bcrypt = require("bcryptjs");
const { Op } = require("sequelize");
const { v4: uuid } = require("uuid");

const sellerId = "8518ee9c-7316-44d9-b11a-3ee15d01033d";
const buyerId = "2d2ddbb8-b8fc-4df3-b7d6-cabe796c92ad";
const adminId = "48ebbe82-a651-4030-9ffa-b8214026df10";
const walletId = "acde3b8d-19bc-4a2e-ae60-2f438a4f1431";
const brandId = "94fec972-de64-4a6e-b314-0b6d6239bbb6";
const categoryId = "9070ba13-d989-415c-89a2-d53f962707dc";
const productId = "13159492-1f3b-4f61-a987-bd595fa0709f";
const balanceId = "4f25b9bb-4efa-4947-8bc0-ff3fc953c05a";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync("Password$1", salt);
    
    // Create a user
    await queryInterface.bulkInsert("users", [{
      id: sellerId,
      first_name: "seller",
      last_name: "seller",
      email: "seller@seller.com",
      password: hash,
      role: "seller",
      isVerified: true,
    },
    {
      id: adminId,
      first_name: "admin",
      last_name: "admin",
      email: "admin@admin.com",
      password: hash,
      role: "admin",
      isVerified: true,
    },
    {
      id: buyerId,
      first_name: "leke",
      last_name: "leke",
      email: "lekejosh6wf@gmail.com",
      password: hash,
      role: "buyer",
      isVerified: true,
    }
    ])

    // Create a wallet for the user
    await queryInterface.bulkInsert("wallets", [{
      id: walletId,
      userId: sellerId,
    }]);

    await queryInterface.bulkInsert("balances", [{
      id: balanceId,
      walletId,
      userId: sellerId,
      balance: 0,
    }]);

    await queryInterface.bulkUpdate('wallets', {
      accountBalance: balanceId
    }, {
      id: walletId
    });

    await queryInterface.bulkUpdate('users', {
      id_number: "testtte",
      walletId,
    }, {
      id: sellerId
    });

    // Create Brand and Category
    await queryInterface.bulkInsert("brands", [{
      id: brandId,
      name: "Addidas",
      description: "Mostly shoes",
    }]);

    await queryInterface.bulkInsert("categories", [{
      id: categoryId,
      name: "shoe",
      description: "Mostly shoes",
    }]);

    // Create Product
    await queryInterface.bulkInsert("products", [{
      id: productId,
      name: "food",
      price: 1000,
      main_image: "https://google.com",
      sub_images: JSON.stringify([
        "https://google.com",
        "https://google.com",
        "https://google.com",
        "https://google.com",
        "https://google.com",
      ]),
      description: "Seeder Product",
      product_details: "Seeded Product",
      specifications: "Seeded",
      inventory: productId,
      userId: sellerId,
      brandId: brandId,
      categoryId: categoryId,
    }]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("users", {
      id: {
        [Op.in]: [sellerId, adminId, buyerId]
      }
    });
    await queryInterface.bulkDelete("wallets", {
      id: walletId
    });
    await queryInterface.bulkDelete("balances", {
      id: balanceId
    });
    await queryInterface.bulkDelete("brands", {
      id: brandId
    });
    await queryInterface.bulkDelete("categories", {
      id: categoryId
    });
  },
};
