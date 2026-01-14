const jwt = require("jsonwebtoken")

module.exports = (socket, next) => {
    const token = socket.handshake.auth?.token;

    if (!token) {
        return next(new Error("Not authorized: Token missing"))
    }

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        socket.user = {
            authUserId: decoded.userId,
            email: decoded.email,
        };
        next();
    } catch (error) {
        next(new Error("Not authorized: Token invalid or expired"));
    }
}