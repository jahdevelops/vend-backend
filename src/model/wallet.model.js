/* eslint-disable no-dupe-keys */
/* eslint-disable no-unused-vars */
// migrations/xxxxxx-create-transactions.js
"use strict";

module.exports = (sequelize, DataTypes) => {
  const Wallet = sequelize.define("wallets", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: DataTypes.UUID,
    accountBalance: DataTypes.UUID,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  });
  return Wallet;
};
