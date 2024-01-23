/* eslint-disable no-dupe-keys */
/* eslint-disable no-unused-vars */
"use strict";

module.exports = (sequelize, DataTypes) => {
  const Cart = sequelize.define("carts", {
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
  return Cart;
};
