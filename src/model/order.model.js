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
    userId: {
      type: DataTypes.UUID,
      references: {
        model: "users",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    courierId: {
      type: DataTypes.UUID,
      references: {
        model: "users",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    status: {
      type: DataTypes.ENUM("pending", "processing", "shipped", "delivered"),
    },
    paymentMethod: {
      type: DataTypes.ENUM("card", "on_delievery"),
    },
    addressId: {
      type: DataTypes.UUID,
      references: {
        model: "addresses",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    transactionId: DataTypes.UUID,
    carts: DataTypes.JSON,
    productsAmount: DataTypes.INTEGER,
    delieveryAmount: DataTypes.INTEGER,
    taxAmount: DataTypes.INTEGER,
    totalAmount: DataTypes.INTEGER,
    deliveryNote: DataTypes.TEXT,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  });
  return Order;
};
