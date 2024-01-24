/* eslint-disable no-dupe-keys */
/* eslint-disable no-unused-vars */
// migrations/xxxxxx-create-transactions.js
"use strict";

module.exports = (sequelize, DataTypes) => {
  const Transaction = sequelize.define("transactions", {
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
  return Transaction;
};
