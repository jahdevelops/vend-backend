const sendToken = (user, statusCode, res) => {
    const accessToken = user.getAccessToken();
    res.json({
        success: true,
        user,
        accessToken,
    });
};
module.exports = sendToken;