/* eslint-disable no-unused-vars */
// migrations/xxxxxx-create-stocks.js
"use strict";

module.exports = (sequelize, DataTypes) => {
  const Stock = sequelize.define("stocks", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    productId: DataTypes.UUID,
    quantity: DataTypes.INTEGER,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    // eslint-disable-next-line no-dupe-keys
    productId: {
      type: DataTypes.UUID,
      references: {
        model: "products",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
  });
  return Stock;
};
