exports.findUserByEmail = "SELECT * FROM users WHERE email = ?";
exports.findUserById =
    "SELECT id, `first_name`, `last_name`, `email`, `role`, `isVerified` FROM users WHERE id =?";
exports.createUser = `INSERT INTO users(
id,
    first_name,
    last_name,
    email,
    password,
    role,
    isVerified) VALUES ( ? )
`;
exports.findUserWithPassword = "SELECT * FROM users WHERE email = ?";