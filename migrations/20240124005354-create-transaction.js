"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable("transactions", {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      amount: DataTypes.INTEGER,
      transactionType: {
        type: DataTypes.ENUM("sale", "refund", "cancellation"),
      },
      paymentMethod: {
        type: DataTypes.ENUM("card", "on_delievery"),
      },
      status: {
        type: DataTypes.ENUM("successful", "pending", "failed"),
      },
      getwayResponse: DataTypes.JSON,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
      orderId: {
        type: DataTypes.UUID,
        references: {
          model: "orders",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("transactions");
  },
};
