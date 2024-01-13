/* eslint-disable no-unused-vars */
const {
  requiredField,
  productNotFound,
} = require("../../messages/error.messages");
const catchAsyncErrors = require("../../middlewares/catchAsyncErrors");
const ErrorHandler = require("../../utils/errorHandler");
const cloudinary = require("cloudinary");
const crypto = require("crypto");
const db = require("../../model");
const Product = db.product;
const Stock = db.stock;
exports.createProduct = catchAsyncErrors(async (req, res, next) => {
  const {
    name,
    price,
    description,
    product_details,
    specifications,
    brandId,
    categoryId,
    stock,
  } = req.body;
  const { id } = req.user;
  if (
    !name ||
    !price ||
    !description ||
    !product_details ||
    !specifications ||
    !brandId ||
    !stock ||
    !categoryId ||
    !req.files.main_image ||
    !req.files.sub_image_1 ||
    !req.files.sub_image_2 ||
    !req.files.sub_image_3 ||
    !req.files.sub_image_4 ||
    !req.files.sub_image_5
  ) {
    return next(new ErrorHandler(requiredField.message, requiredField.code));
  }
  const timestamp = Date.now();
  const cloudinaryOptions = {
    folder: "product",
    crop: "fill",
    gravity: "center",
    quality: 40,
    timestamp: timestamp,
  };

  const product = await Product.create({
    name: name,
    price: price,
    main_image: (
      await cloudinary.v2.uploader.upload(req.files.main_image[0].path, {
        ...cloudinaryOptions,
        public_id: `${name}_${id}_mainImage_${Date.now()}`,
      })
    ).url,
    sub_images: [
      (
        await cloudinary.v2.uploader.upload(req.files.sub_image_1[0].path, {
          ...cloudinaryOptions,
          public_id: `${name}_${id}_subImage1_${Date.now()}`,
        })
      ).url,
      (
        await cloudinary.v2.uploader.upload(req.files.sub_image_2[0].path, {
          ...cloudinaryOptions,
          public_id: `${name}_${id}_subImage2_${Date.now()}`,
        })
      ).url,
      (
        await cloudinary.v2.uploader.upload(req.files.sub_image_3[0].path, {
          ...cloudinaryOptions,
          public_id: `${name}_${id}_subImage3_${Date.now()}`,
        })
      ).url,
      (
        await cloudinary.v2.uploader.upload(req.files.sub_image_4[0].path, {
          ...cloudinaryOptions,
          public_id: `${name}_${id}_subImage4_${Date.now()}`,
        })
      ).url,
      (
        await cloudinary.v2.uploader.upload(req.files.sub_image_5[0].path, {
          ...cloudinaryOptions,
          public_id: `${name}_${id}_subImage5_${Date.now()}`,
        })
      ).url,
    ],
    description: description,
    product_details: product_details,
    specifications: specifications,
    userId: id,
    brandId: brandId,
    categoryId: categoryId,
  });
  const stockId = await Stock.create({
    productId: product.id,
    quantity: Number(stock),
  });

  await Product.update({ stockId: stockId.id }, { where: { id: product.id } });
  return res.status(201).json({
    success: true,
    message: "Product created successfully",
    product: product,
  });
});

exports.getSellerProducts = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.user;
  const { page = 1, sortBy = "createdAt", sortOrder = "desc" } = req.query;
  const pageSize = 3;
  const offset = (page - 1) * pageSize;

  const validSortOrders = ["asc", "desc"];
  const sort = validSortOrders.includes(sortOrder) ? sortOrder : "asc";

  const products = await Product.findAndCountAll({
    where: {
      userId: id,
    },
    order: [[sortBy, sort]],
    limit: pageSize,
    offset: offset,
  });

  const response = {
    success: true,
    message: "Seller's products",
    products: products.rows,
    currentPage: page,
    totalPages: Math.ceil(products.count / pageSize),
  };

  return res.status(200).json(response);
});

exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const updatedFields = req.body;

  const product = await Product.findOne({
    where: { id: id },
  });

  if (!product) {
    return next(
      new ErrorHandler(productNotFound.message, productNotFound.code),
    );
  }

  await product.update(updatedFields);

  return res.status(200).json({
    success: true,
    message: "Product updated successfully",
  });
});

exports.getProduct = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  const product = await Product.findOne({
    where: { id: id },
  });

  if (!product) {
    return next(
      new ErrorHandler(productNotFound.message, productNotFound.code),
    );
  }

  return res.status(200).json({
    success: true,
    message: "Product retrieved successfully",
    product: product,
  });
});

exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const { id: userId } = req.user;

  const product = await Product.findOne({
    where: { id: id, userId: userId },
  });

  if (!product) {
    return next(
      new ErrorHandler(productNotFound.message, productNotFound.code),
    );
  }

  await product.destroy();

  return res.status(204).end();
});
