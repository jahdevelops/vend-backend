/* eslint-disable no-unused-vars */
// migrations/xxxxxx-create-addresses.js
"use strict";

module.exports = (sequelize, DataTypes) => {
  const Notification = sequelize.define("notifications", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: DataTypes.UUID,
    type: {
      type: DataTypes.ENUM(
        "order",
        "transaction",
        "escrow",
        "product",
        "inventory",
      ),
    },
    description: DataTypes.TEXT,
    urlPath: DataTypes.STRING,
    read: DataTypes.BOOLEAN,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  });
  return Notification;
};
