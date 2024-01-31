"use strict";
const bcrypt = require("bcryptjs");
const { Op } = require("sequelize");
const crypto = require("crypto");

const sellerId = crypto.randomUUID();
const buyerId = crypto.randomUUID();
const adminId = crypto.randomUUID();
const courierId = crypto.randomUUID();
const walletId = crypto.randomUUID();
const brandId = crypto.randomUUID();
const categoryId = crypto.randomUUID();
const productId = crypto.randomUUID();
const productId2 = crypto.randomUUID();
const productId3 = crypto.randomUUID();
const balanceId = crypto.randomUUID();
const orderId = crypto.randomUUID();
const courierId1 = crypto.randomUUID();
const courierId2 = crypto.randomUUID();
const courierId3 = crypto.randomUUID();

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync("Password$1", salt);

    // Create a user
    await queryInterface.bulkInsert("users", [
      {
        id: sellerId,
        first_name: "seller",
        last_name: "seller",
        email: "seller@seller.com",
        password: hash,
        role: "seller",
        isVerified: true,
        updatedAt: new Date()
      },
      {
        id: adminId,
        first_name: "admin",
        last_name: "admin",
        email: "admin@admin.com",
        password: hash,
        role: "admin",
        isVerified: true,
        updatedAt: new Date()
      },
      {
        id: buyerId,
        first_name: "leke",
        last_name: "leke",
        email: "lekejosh6wf@gmail.com",
        password: hash,
        role: "buyer",
        isVerified: true,
        updatedAt: new Date()
      },
      {
        id: courierId1,
        first_name: "Courier",
        last_name: "Courier",
        email: "courier@ecom.com",
        password: hash,
        role: "courier",
        isVerified: true,
        updatedAt: new Date()
      },
      {
        id: courierId2,
        first_name: "first_C",
        last_name: "first_C",
        email: "first_C@ecom.com",
        password: hash,
        role: "courier",
        isVerified: true,
        updatedAt: new Date()
      },
      {
        id: courierId3,
        first_name: "scnd_C",
        last_name: "scnd_C",
        email: "scnd_C@ecom.com",
        password: hash,
        role: "courier",
        isVerified: true,
        updatedAt: new Date()
      },
      {
        id: courierId,
        first_name: "courier",
        last_name: "courier",
        email: "courier@ecom.com",
        password: hash,
        role: "courier",
        isVerified: true,
      },
    ]);

    // Create a wallet for the user
    await queryInterface.bulkInsert("wallets", [
      {
        id: walletId,
        userId: sellerId,
      },
    ]);

    await queryInterface.bulkInsert("balances", [
      {
        id: balanceId,
        walletId,
        userId: sellerId,
        balance: 0,
      },
    ]);

    await queryInterface.bulkUpdate(
      "wallets",
      {
        accountBalance: balanceId,
      },
      {
        id: walletId,
      },
    );

    await queryInterface.bulkUpdate(
      "users",
      {
        id_number: "testtte",
        walletId,
      },
      {
        id: sellerId,
      },
    );

    // Create Brand and Category
    await queryInterface.bulkInsert("brands", [
      {
        id: brandId,
        name: "Addidas",
        description: "Mostly shoes",
      },
    ]);

    await queryInterface.bulkInsert("categories", [
      {
        id: categoryId,
        name: "shoe",
        description: "Mostly shoes",
      },
    ]);

    await queryInterface.bulkInsert("orders", [
      {
        id: crypto.randomUUID(),
        userId: buyerId,
        status: "delivered",
        paymentMethod: 'on_delievery',
        courierId: courierId1,
        updatedAt: new Date(),
        carts: JSON.stringify([
          {
            id: crypto.randomUUID(),
            productId,
            sellerId,
            userId: buyerId
          },
        ])
      },
      {
        id: crypto.randomUUID(),
        userId: buyerId,
        status: "delivered",
        paymentMethod: 'on_delievery',
        courierId: courierId2,
        updatedAt: new Date(),
        carts: JSON.stringify([
          {
            id: crypto.randomUUID(),
            productId,
            sellerId,
            userId: buyerId
          },
        ])
      },
      {
        id: crypto.randomUUID(),
        userId: buyerId,
        status: "delivered",
        paymentMethod: 'on_delievery',
        courierId: courierId3,
        updatedAt: new Date(),
        carts: JSON.stringify([
          {
            id: crypto.randomUUID(),
            productId,
            sellerId,
            userId: buyerId
          },
        ])
      },
    ]);

    // Create Product
    await queryInterface.bulkInsert("products", [
      {
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
      },
      {
        id: productId2,
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
      },
      {
        id: productId3,
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
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("users");
    await queryInterface.bulkDelete("wallets");
    await queryInterface.bulkDelete("balances");
    await queryInterface.bulkDelete("brands");
    await queryInterface.bulkDelete("categories");
    await queryInterface.bulkDelete("orders");
  },
};
