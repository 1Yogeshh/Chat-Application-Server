const prisma = require("../prisma")
const jwt = require("jsonwebtoken")
const hashToken = require("../utils/hashToken")
const {generateAccessToken, generateRefreshToken} = require("../config/generateToken")

const refreshTokenService = async (refreshToken) =>{
    const decoded = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET
    )

    const tokenHash = hashToken(refreshToken)

    const stored = await prisma.refreshToken.findFirst({
        where:{
            userId: decoded.userId,
            tokenHash,
            expiresAt: {gt: new Date()},
        }
    })

    if(!stored) throw new Error("Refresh Token Reused or Expired")

    await prisma.refreshToken.delete({where:{id: stored.id}})
    
    const newAccessToken = generateAccessToken({id: decoded.userId})
    const newRefreshToken = generateRefreshToken({id: decoded.userId})

    await prisma.refreshToken.create({
        data: {
            userId: decoded.userId,
            tokenHash: hashToken(newRefreshToken),
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
    })

    return { newAccessToken, newRefreshToken };
}

module.exports = refreshTokenService