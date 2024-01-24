/* eslint-disable no-dupe-keys */
/* eslint-disable no-unused-vars */
// migrations/xxxxxx-create-transactions.js
"use strict";

module.exports = (sequelize, DataTypes) => {
  const Escrow = sequelize.define("escrows", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    walletId: {
      type: DataTypes.UUID,
      references: {
        model: "wallets",
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
    amount: DataTypes.FLOAT,
    status: {
      type: DataTypes.ENUM("pending", "released"),
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  });
  return Escrow;
};
