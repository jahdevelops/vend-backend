/* eslint-disable no-dupe-keys */
/* eslint-disable no-unused-vars */
// migrations/xxxxxx-create-orders.js
"use strict";

module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define("orders", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: DataTypes.UUID,
    status: {
      type: DataTypes.ENUM("pending", "processing", "shipped", "delivered"),
    },
    totalAmount: DataTypes.INTEGER,
    paymentMethod: {
      type: DataTypes.ENUM("card", "on_delievery"),
    },
    transactionId: DataTypes.UUID,
    addressId: DataTypes.UUID,
    taxAmount: DataTypes.INTEGER,
    delieveryAmount: DataTypes.INTEGER,
    delivery_notes: DataTypes.TEXT,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    // Foreign Keys
    userId: {
      type: DataTypes.UUID,
      references: {
        model: "users",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    transactionId: {
      type: DataTypes.UUID,
      references: {
        model: "transactions",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
  });
  return Order;
};
