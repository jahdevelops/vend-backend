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

    // Create a wallet for the user
    const wallet = await queryInterface.sequelize.models.Wallet.create({
      userId: user.id,
    });

    const balance = await queryInterface.sequelize.models.Balance.create({
      walletId: wallet.id,
      userId: user.id,
      balance: 0,
    });

    wallet.accountBalance = balance.id;
    await wallet.save();
    user.id_number = "testtte";
    user.walletId = wallet.id;
    await user.save();

    // Create Brand and Category
    const brand = await queryInterface.sequelize.models.Brand.create({
      name: "Addidas",
      description: "Mostly shoes",
    });

    const category = await queryInterface.sequelize.models.Category.create({
      name: "shoe",
      description: "Mostly shoes",
    });

    // Create Product
    await queryInterface.sequelize.models.Product.create({
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
      userId: user.id,
      brandId: brand.id,
      categoryId: category.id,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.models.Wallet.destroy({ where: {} });
    await queryInterface.sequelize.models.User.destroy({ where: {} });
    await queryInterface.sequelize.models.Brand.destroy({ where: {} });
    await queryInterface.sequelize.models.Category.destroy({ where: {} });
    await queryInterface.sequelize.models.Product.destroy({ where: {} });
  },
};
