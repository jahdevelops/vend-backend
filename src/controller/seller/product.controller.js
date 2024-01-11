const mysql = require("../../db");
const {
    findUserById,
    createProduct,
    findProduct,
    findSellersProduct,
    updateProduct,
    findASellerProduct,
    deleteProduct,
} = require("../../db/sql");
const {
    requiredField,
    userNotFound,
    productNotFound,
} = require("../../messages/error.messages");
const catchAsyncErrors = require("../../middlewares/catchAsyncErrors");
const ErrorHandler = require("../../utils/errorHandler");
const cloudinary = require("cloudinary");
const crypto = require("crypto");
exports.createProduct = catchAsyncErrors(async(req, res, next) => {
    const { name, price, description, product_details, specifications } =
    req.body;
    const { id } = req.user;
    if (!name ||
        !price ||
        !description ||
        !product_details ||
        !specifications ||
        !req.files.main_image ||
        !req.files.sub_image_1 ||
        !req.files.sub_image_2 ||
        !req.files.sub_image_3 ||
        !req.files.sub_image_4 ||
        !req.files.sub_image_5
    ) {
        return next(new ErrorHandler(requiredField.message, requiredField.code));
    }
    mysql.query(findUserById, [id], async(err, data) => {
        if (err) return next(new ErrorHandler(err.message, 500));
        if (!data.length)
            return next(new ErrorHandler(userNotFound.message, userNotFound.code));
        console.log(req.files.main_image);
        const timestamp = Date.now();
        const cloudinaryOptions = {
            folder: "product",
            crop: "fill",
            gravity: "center",
            quality: 40,
            timestamp: timestamp,
        };

        const product_id = crypto.randomUUID();
        const values = [
            product_id,
            name,
            price,
            (
                await cloudinary.v2.uploader.upload(req.files.main_image[0].path, {
                    ...cloudinaryOptions,
                    public_id: `${name}_${id}_mainImage_${Date.now()}`,
                })
            ).url,
            JSON.stringify([
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
            ]),
            description,
            product_details,
            specifications,
            data[0].id,
        ];
        mysql.query(createProduct, [values], (err) => {
            if (err) return next(new ErrorHandler(err.message, 500));
            mysql.query(findProduct, [product_id], (err, product) => {
                if (err) return next(new ErrorHandler(err.message, 500));
                return res.status(201).json({
                    success: true,
                    message: "Product created successfully",
                    product: product[0],
                });
            });
        });
    });
});

exports.getSellerProducts = catchAsyncErrors(async(req, res, next) => {
    const { id } = req.user;
    const { page = 1, sortBy = "createdAt", sortOrder = "desc" } = req.query;
    const pageSize = 3;
    const offset = (page - 1) * pageSize;

    // Validating sort order
    const validSortOrders = ["asc", "desc"];
    const sort = validSortOrders.includes(sortOrder) ? sortOrder : "asc";

    // Building the query with sorting options
    const query = `${findSellersProduct} ORDER BY ${mysql.escapeId(
    sortBy
  )} ${sort} LIMIT ${pageSize} OFFSET ${offset}`;

    // Query to count the total number of products without LIMIT and OFFSET
    const countQuery = `SELECT COUNT(*) AS total FROM product WHERE userId=?`;

    // Execute both queries in parallel
    mysql.query(query, [id], (err, data) => {
        if (err) return next(new ErrorHandler(err.message, 500));

        mysql.query(countQuery, [id], (err, countData) => {
            if (err) return next(new ErrorHandler(err.message, 500));

            const totalProducts = countData[0].total;

            const response = {
                success: true,
                message: "Seller's products",
                products: data,
                currentPage: page,
                totalPages: Math.ceil(totalProducts / pageSize),
            };

            return res.status(200).json(response);
        });
    });
});

exports.updateProduct = catchAsyncErrors(async(req, res, next) => {
    const { id } = req.params;
    const updatedFields = req.body;
    mysql.query(findProduct, [id], (err, data) => {
        if (err) return next(new ErrorHandler(err.message, 500));
        if (!data.length)
            return next(
                new ErrorHandler(productNotFound.message, productNotFound.code)
            );
        mysql.query(updateProduct, [updatedFields, id], (err) => {
            if (err) return next(new ErrorHandler(err.message, 500));
            return res.status(200).json({
                success: true,
                message: "Product updated successfully",
            });
        });
    });
});

exports.getProduct = catchAsyncErrors(async(req, res, next) => {
    const { id } = req.params;
    mysql.query(findProduct, [id], (err, data) => {
        if (err) return next(new ErrorHandler(err.message, 500));
        if (!data.length)
            return next(
                new ErrorHandler(productNotFound.message, productNotFound.code)
            );
        return res.status(200).json({
            success: true,
            message: "Product retrieved successfully",
            product: data[0],
        });
    });
});

exports.deleteProduct = catchAsyncErrors(async(req, res, next) => {
    const { id } = req.params;
    const { id: userId } = req.user;
    mysql.query(findASellerProduct, [userId, id], (err, data) => {
        if (err) return next(new ErrorHandler(err.message, 500));
        if (!data.length) {
            return next(
                new ErrorHandler(productNotFound.message, productNotFound.code)
            );
        }
        mysql.query(deleteProduct, [id], (err) => {
            if (err) return next(new ErrorHandler(err.message, 500));
            return res.status(204).end();
        });
    });
});