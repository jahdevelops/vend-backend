/* eslint-disable no-unused-vars */
// migrations/xxxxxx-create-addresses.js
"use strict";

module.exports = (sequelize, DataTypes) => {
  const Address = sequelize.define("addresses", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    streetAddress: DataTypes.TEXT,
    city: DataTypes.STRING,
    state: DataTypes.STRING,
    zipCode: DataTypes.STRING,
    country: DataTypes.STRING,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    // eslint-disable-next-line no-dupe-keys
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
  return Address;
};
