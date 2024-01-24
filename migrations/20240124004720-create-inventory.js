"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable("inventories", {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      quantity: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      productId: DataTypes.UUID,
      size: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      color: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      style: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      material: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      pattern: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      model: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      batchNumber: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      expirationDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      weight: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      length: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      width: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      height: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      serialNumber: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      season: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      countryOfOrigin: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      condition: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      others: {
        type: DataTypes.JSON,
        allowNull: true,
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("inventories");
  },
};
