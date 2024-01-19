/* eslint-disable no-unused-vars */
// migrations/xxxxxx-create-users.js
"use strict";

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "user",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      first_name: DataTypes.STRING,
      last_name: DataTypes.STRING,
      email: {
        type: DataTypes.STRING,
        unique: true,
      },
      password: DataTypes.STRING,
      role: {
        type: DataTypes.ENUM("buyer", "seller", "admin"),
      },
      isVerified: DataTypes.BOOLEAN,
      phoneNumber: DataTypes.STRING(11),
      id_number: DataTypes.STRING(26),
      walletId: DataTypes.UUID,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    {
      defaultScope: {
        attributes: { exclude: ["password"] }, // Exclude password by default
      },
      scopes: {
        withPassword: {
          attributes: {}, // Include password when using the 'withPassword' scope
        },
      },
    },
  );
  return User;
};
