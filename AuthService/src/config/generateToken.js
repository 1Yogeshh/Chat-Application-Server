const jwt = require("jsonwebtoken")

const generateToken =(user)=>{
    return jwt.sign(
        {
            userId:user.id,
            email:user.email
        },
        process.env.JWT_SECRET,
        {
            expiresIn:process.env.JWT_EXPIRES_IN
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

module.exports = {generateToken, generateRefreshToken};