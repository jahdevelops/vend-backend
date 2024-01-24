"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable("carts", {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      productId: DataTypes.UUID,
      quantity: DataTypes.FLOAT,
      prices: DataTypes.FLOAT,
      inventoryId: DataTypes.UUID,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
      sellerId: {
        type: DataTypes.UUID,
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      userId: {
        type: DataTypes.UUID,
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("carts");
  },
};
