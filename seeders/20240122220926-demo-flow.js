"use strict";
const bcrypt = require("bcryptjs");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync("Password$1", salt);
    // Create a user
    const user = await queryInterface.bulkInsert("users", [
      {
        first_name: "seller",
        last_name: "seller",
        email: "seller@seller.com",
        password: hash,
        role: "seller",
        isVerified: true,
      },
      {
        first_name: "admin",
        last_name: "admin",
        email: "admin@admin.com",
        password: hash,
        role: "admin",
        isVerified: true,
      },
      {
        first_name: "leke",
        last_name: "leke",
        email: "lekejosh6wf@gmail.com",
        password: hash,
        role: "buyer",
        isVerified: true,
      },
    ]);
    console.log(user)

    // Create a wallet for the user
    const wallet = await queryInterface.insert("wallets", {
      userId: user[0].id,
    });

    const balance = await queryInterface.insert("balances", {
      walletId: wallet.id,
      userId: user.id,
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
      { where: { id: user.id } },
    );

    // Create Brand and Category
    const brand = await queryInterface.insert("brands", {
      name: "Addidas",
      description: "Mostly shoes",
    });

    const category = await queryInterface.insert("categories", {
      name: "shoe",
      description: "Mostly shoes",
    });

    // Create Product
    await queryInterface.insert("products", {
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
      userId: user[0].id,
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
    await queryInterface.bulkDelete("product");
  },
};
