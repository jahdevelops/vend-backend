"use strict";
const bcrypt = require("bcryptjs");
const { Op } = require("sequelize");
const crypto = require("crypto");

const sellerId = crypto.randomUUID();
const buyerId = crypto.randomUUID();
const adminId = crypto.randomUUID();
const walletId = crypto.randomUUID();
const brandId = crypto.randomUUID();
const categoryId = crypto.randomUUID();
const productId = crypto.randomUUID();
const balanceId = crypto.randomUUID();

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
