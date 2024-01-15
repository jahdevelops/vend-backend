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
    userId: DataTypes.UUID,
    products: DataTypes.JSON,
    quantities: DataTypes.JSON,
    prices: DataTypes.JSON,
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
  });
  return Cart;
};
