"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable("users", {
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
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("users");
  },
};
