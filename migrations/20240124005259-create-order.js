"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable("orders", {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      userId: DataTypes.UUID,
      status: {
        type: DataTypes.ENUM("pending", "processing", "shipped", "delivered"),
      },
      paymentMethod: {
        type: DataTypes.ENUM("card", "on_delievery"),
      },

      carts: DataTypes.JSON,
      addressId: DataTypes.UUID,
      transactionId: DataTypes.UUID,
      productsAmount: DataTypes.INTEGER,
      delieveryAmount: DataTypes.INTEGER,
      taxAmount: DataTypes.INTEGER,
      totalAmount: DataTypes.INTEGER,
      deliveryNote: DataTypes.TEXT,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("orders");
  },
};
