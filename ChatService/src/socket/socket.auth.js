const jwt = require("jsonwebtoken");
const axios = require("axios");

module.exports = async (socket, next) => {
    const token = socket.handshake.auth?.token;

    if (!token) {
        return next(new Error("Not authorized: Token missing"));
    }

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        // 🔥 Fetch full user from User Service
        const response = await axios.get(
            `${process.env.USER_SERVICE}/api/users/userProfile/${decoded.userId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        const user = response.data;

        // console.log(user)

        // 🔥 Attach full user info
        socket.user = {
            userId: user.authUserId,
            name: user.name,
            avtar: user.avtar
        };

        next();
    } catch (error) {
        next(new Error("Not authorized: Token invalid or expired"));
    }
};