/* eslint-disable no-dupe-keys */
/* eslint-disable no-unused-vars */
// migrations/xxxxxx-create-transactions.js
"use strict";

module.exports = (sequelize, DataTypes) => {
  const Account = sequelize.define("accounts", {
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
    accountNumber: DataTypes.STRING,
    accountName: DataTypes.STRING,
    bankName: DataTypes.STRING,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  });
  return Account;
};
