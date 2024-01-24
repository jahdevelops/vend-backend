"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable("products", {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: DataTypes.STRING,
      price: DataTypes.DECIMAL(10, 2),
      main_image: DataTypes.STRING,
      sub_images: DataTypes.JSON,
      description: DataTypes.TEXT,
      product_details: DataTypes.TEXT,
      specifications: DataTypes.TEXT,
      userId: DataTypes.UUID,
      brandId: DataTypes.UUID,
      categoryId: DataTypes.UUID,
      inventory: DataTypes.STRING,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
      userId: {
        type: DataTypes.UUID,
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      brandId: {
        type: DataTypes.UUID,
        references: {
          model: "brands",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      categoryId: {
        type: DataTypes.UUID,
        references: {
          model: "categories",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("products");
  },
};
