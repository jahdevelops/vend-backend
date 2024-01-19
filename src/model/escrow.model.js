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
    walletId: DataTypes.UUID,
    userId: DataTypes.UUID,
    amount: DataTypes.FLOAT,
    status: {
      type: DataTypes.ENUM("pending", "released"),
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  });
  return Escrow;
};
