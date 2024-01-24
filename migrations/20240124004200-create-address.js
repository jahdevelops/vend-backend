"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable("addresses", {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      userId: DataTypes.UUID,
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
  },

  async down(queryInterface) {
    await queryInterface.dropTable("addresses");
  },
};
