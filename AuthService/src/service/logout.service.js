const hashToken = require("../utils/hashToken")
const authRepository = require("../repositories/auth.repository")
const tokenCache = require("../cache/token.cache")

module.exports = async (refreshToken) => {
    if (!refreshToken) {
        throw new Error("Refresh token required")
    }
    const tokenHash = hashToken(refreshToken)
    await authRepository.deleteRefreshToken(tokenHash)
    await tokenCache.deleteRefreshTokenFromCache(tokenHash)
}