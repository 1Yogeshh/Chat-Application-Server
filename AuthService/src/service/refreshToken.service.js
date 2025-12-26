const prisma = require("../prisma")
const jwt = require("jsonwebtoken")
const hashToken = require("../utils/hashToken")
const {generateAccessToken, generateRefreshToken} = require("../config/generateToken")
const redis = require("../config/redis")

const refreshTokenService = async (refreshToken) =>{
    const decoded = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET
    )

    const tokenHash = hashToken(refreshToken)

    const redisCheck = await redis.get(`refresh_token:${tokenHash}`)
    // console.log(redisCheck)
    if (!redisCheck) throw new Error("Refresh token invalid!");

    const stored = await prisma.refreshToken.findFirst({
        where:{
            userId: decoded.userId,
            tokenHash,
            expiresAt: {gt: new Date()},
        }
    })

    if(!stored) throw new Error("Refresh Token Reused or Expired")

    await prisma.refreshToken.delete({where:{id: stored.id}})
    await redis.del(`refresh_token:${tokenHash}`);
    
    const newAccessToken = generateAccessToken({id: decoded.userId})
    const newRefreshToken = generateRefreshToken({id: decoded.userId})

    const newHash = hashToken(newRefreshToken);

    await prisma.refreshToken.create({
        data: {
            userId: decoded.userId,
            tokenHash: newHash,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
    })

    await redis.set(
    `refresh_token:${newHash}`,
    decoded.id,
    "EX",
    7 * 24 * 60 * 60
    );

    return { newAccessToken, newRefreshToken };
}

module.exports = refreshTokenService