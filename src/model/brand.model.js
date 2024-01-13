// migrations/xxxxxx-create-brands.js
"use strict";

module.exports = (sequelize, DataTypes) => {
  const Brand = sequelize.define("brands", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  });
  return Brand;
};
