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
  return Order;
};
