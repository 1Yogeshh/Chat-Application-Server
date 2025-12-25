const jwt = require("jsonwebtoken")

const generateAccessToken =(user)=>{
    return jwt.sign(
        {
            userId:user.id,
            email:user.email
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRES_IN
        }
    )
}

const generateRefreshToken = (user)=>{
    return jwt.sign(
        {
            userId:user.id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRES
        }
    )
}

module.exports = {generateAccessToken, generateRefreshToken};