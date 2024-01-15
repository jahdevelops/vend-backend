/* eslint-disable no-unused-vars */
/* eslint-disable no-dupe-keys */
// migrations/xxxxxx-create-products.js
"use strict";

module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define("products", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: DataTypes.STRING,
    price: DataTypes.DECIMAL(10, 2),
    main_image: DataTypes.STRING,
    sub_images: DataTypes.JSON,
    description: DataTypes.TEXT,
    product_details: DataTypes.TEXT,
    specifications: DataTypes.TEXT,
    userId: DataTypes.UUID,
    brandId: DataTypes.UUID,
    categoryId: DataTypes.UUID,
    inventory: DataTypes.STRING,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    userId: {
      type: DataTypes.UUID,
      references: {
        model: "users",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    brandId: {
      type: DataTypes.UUID,
      references: {
        model: "brands",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    categoryId: {
      type: DataTypes.UUID,
      references: {
        model: "categories",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
  });
  return Product;
};
