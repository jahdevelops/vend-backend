"use strict";
const bcrypt = require("bcryptjs");
const { v4: uuid } = require("uuid");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync("Password$1", salt);
    // Create a user
    const sellerAccount = await queryInterface.insert(null, "users", {
      id: uuid(),
      first_name: "seller",
      last_name: "seller",
      email: "seller@seller.com",
      password: hash,
      role: "seller",
      isVerified: true,
    });

    await queryInterface.insert(null, "users", {
      id: uuid(),
      first_name: "admin",
      last_name: "admin",
      email: "admin@admin.com",
      password: hash,
      role: "admin",
      isVerified: true,
    });
    await queryInterface.insert(null, "users", {
      id: uuid(),
      first_name: "leke",
      last_name: "leke",
      email: "lekejosh6wf@gmail.com",
      password: hash,
      role: "buyer",
      isVerified: true,
    });

    // Create a wallet for the user
    const wallet = await queryInterface.insert(null, "wallets", {
      userId: sellerAccount.id,
    });

    const balance = await queryInterface.insert(null, "balances", {
      walletId: wallet.id,
      userId: sellerAccount.id,
      balance: 0,
    });

    await queryInterface.update(
      "Wallet",
      "wallets",
      {
        accountBalance: balance.id,
      },
      { where: { id: wallet.id } },
    );

    await queryInterface.update(
      "User",
      "users",
      {
        id_number: "testtte",
        walletId: wallet.id,
      },
      { where: { id: sellerAccount.id } },
    );

    // Create Brand and Category
    const brand = await queryInterface.insert(null, "brands", {
      name: "Addidas",
      description: "Mostly shoes",
    });

    const category = await queryInterface.insert(null, "categories", {
      name: "shoe",
      description: "Mostly shoes",
    });

    // Create Product
    await queryInterface.insert(null, "products", {
      name: "food",
      price: 1000,
      main_image: "https://google.com",
      sub_images: [
        "https://google.com",
        "https://google.com",
        "https://google.com",
        "https://google.com",
        "https://google.com",
      ],
      description: "Seeder Product",
      product_details: "Seeded Product",
      specifications: "Seeded",
      userId: sellerAccount.id,
      brandId: brand.id,
      categoryId: category.id,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("users");
    await queryInterface.bulkDelete("wallets");
    await queryInterface.bulkDelete("balances");
    await queryInterface.bulkDelete("brands");
    await queryInterface.bulkDelete("categories");
    await queryInterface.bulkDelete("products");
  },
};
