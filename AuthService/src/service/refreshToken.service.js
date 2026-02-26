const hashToken = require("../utils/hashToken")
const { generateAccessToken, generateRefreshToken } = require("../config/generateToken")
const authRepository = require("../repositories/auth.repository")
const { verifyRefreshToken } = require("../utils/jwt.util")
const tokenCache = require("../cache/token.cache")

const refreshTokenService = async (refreshToken) => {
    if (!refreshToken) {
        throw new Error("Refresh token required")
    }

    const decoded = verifyRefreshToken(refreshToken)

    const tokenHash = hashToken(refreshToken)

    const redisCheck = await tokenCache.getRefreshToken(tokenHash)

    if (!redisCheck) throw new Error("Refresh token invalid!");

    const stored = await authRepository.findValidRefreshToken(
        decoded.userId,
        tokenHash
    )

    if (!stored) throw new Error("Refresh Token Reused or Expired")

    await authRepository.deleteRefreshTokenById(stored.id)
    await tokenCache.deleteRefreshTokenFromCache(tokenHash)

    const newAccessToken = generateAccessToken({ id: decoded.userId })
    const newRefreshToken = generateRefreshToken({ id: decoded.userId })

    const newHash = hashToken(newRefreshToken);

    await authRepository.createRefreshToken({
        userId: decoded.userId,
        tokenHash: newHash,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    })

    await tokenCache.storeRefreshToken(newHash, decoded.userId)

    return { newAccessToken, newRefreshToken };
}

module.exports = refreshTokenService