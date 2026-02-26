const redis = require("../config/redis")

const storeRefreshToken = (tokenHash, userId) => {
    return redis.set(
        `refresh_token:${tokenHash}`,
        userId,
        "EX",
        7 * 24 * 60 * 60
    )
}

module.exports = { storeRefreshToken }