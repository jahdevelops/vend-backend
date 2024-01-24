"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable("escrows", {
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
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("escrows");
  },
};
