const redis = require("../config/redis")

const storeRefreshToken = (tokenHash, userId) => {
    return redis.set(
        `refresh_token:${tokenHash}`,
        userId,
        "EX",
        7 * 24 * 60 * 60
    )
}

const deleteRefreshTokenFromCache = (tokenHash) => {
    return redis.del(`refresh_token:${tokenHash}`)
}

module.exports = {
    storeRefreshToken,
    deleteRefreshTokenFromCache
}