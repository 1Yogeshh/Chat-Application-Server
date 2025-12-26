const prisma = require("../prisma")
const redis = require("../config/redis")
const hashToken = require("../utils/hashToken")

module.exports = async (refreshToken)=>{
    const tokenHash = hashToken(refreshToken)
    await prisma.refreshToken.deleteMany({where:{tokenHash}})
    await redis.del(`refresh_token:${tokenHash}`)
}