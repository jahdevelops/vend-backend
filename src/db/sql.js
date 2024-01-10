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

exports.findUserWithPassword = "SELECT * FROM users WHERE email = ?";

exports.createToken = `INSERT INTO token(id,userId,token,type,expiresAt) VALUES (?)`;

exports.findToken = `SELECT * FROM token WHERE userId =? AND type=?`;
exports.deleteToken = `DELETE FROM token WHERE userId = ? AND type = ?`;
exports.deleteTokenOne = `DELETE FROM token WHERE userId = ? AND type = ? AND id=?`;
