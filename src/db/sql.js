exports.findUserByEmail = "SELECT * FROM users WHERE email = ?";
exports.findUserById =
  "SELECT id, `first_name`, `last_name`, `email`, `role`, `isVerified`,`phoneNumber`,`id_number` FROM users WHERE id =?";
exports.createUser = `INSERT INTO users(
id,
    first_name,
    last_name,
    email,
    password,
    role,
    isVerified) VALUES ( ? )
`;

exports.updateUserVerification = `
    UPDATE users
    SET
        isVerified = ?
    WHERE id = ?
`;

exports.updateUserPassword = `
    UPDATE users
    SET
        password = ?
    WHERE id = ?
`;
exports.updateUserPhone = `
    UPDATE users
    SET
        phoneNumber = ?
    WHERE id = ?
`;

exports.updateUserRole = `
    UPDATE users
    SET
        role = ?
    WHERE id = ?
`;

exports.becomeSeller = `
    UPDATE users
    SET
        id_number = ?
    WHERE id = ?
`;

exports.updateBuyerToSeller = `
    UPDATE users
    SET
        role = ?
    WHERE id = ?
`;

exports.findUserWithPassword = "SELECT * FROM users WHERE email = ?";

exports.createToken = `INSERT INTO token(id,userId,token,type,expiresAt) VALUES (?)`;

exports.findToken = `SELECT * FROM token WHERE userId =? AND type=?`;
exports.deleteToken = `DELETE FROM token WHERE userId = ? AND type = ?`;
exports.deleteTokenOne = `DELETE FROM token WHERE userId = ? AND type = ? AND id=?`;

//Admin

exports.getPendingSellers = `SELECT
id,
first_name,
last_name,
email,
role,
isVerified,
phoneNumber,
id_number
FROM users
WHERE id_number IS NOT NULL
AND role = 'buyer'
AND isVerified = true`;

//Products

exports.createProduct = `INSERT INTO product (id,name, price, main_image, sub_images, description, product_details, specifications, userId,brandId,categoryId,stockId) VALUES (?)`;
exports.indexProduct = `SELECT * FROM product ORDER BY RAND()`;
exports.findProduct = `SELECT * FROM product WHERE id=?`;
exports.findSellersProduct = `SELECT * FROM product WHERE userId=?`;
exports.findASellerProduct = `SELECT * FROM product WHERE userId=? AND id=?`;
exports.updateProduct = `UPDATE product SET ? WHERE id=?`;
exports.deleteProduct = `DELETE FROM product WHERE id=?`;

//Categories

exports.createCategories = `INSERT INTO categories(id,name) VALUES (?)`;
exports.getCategories = `SELECT * FROM categories`;

//Brand

exports.createBrand = `INSERT INTO brands(id,name) VALUES (?)`;
exports.getBrand = `SELECT * FROM brands`;

//Stock

exports.createStock = `INSERT INTO stocks(id,productId,quantity) VALUES (?)`;
exports.getProductStock = `SELECT * FROM stocks WHERE id=? AND productId =?`;
