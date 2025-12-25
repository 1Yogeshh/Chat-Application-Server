const prisma = require("../prisma")
const bcrypt = require("bcrypt")
const {generateAccessToken, generateRefreshToken} = require("../config/generateToken")
const hashToken = require("../utils/hashToken")

const register = async(email, password)=>{
    const existUser = await prisma.authUser.findUnique({
        where:{email}
    })

    if(existUser){
        throw new Error("user already registered")
    }

    const hashPassword = await bcrypt.hash(password, 10)

    const user = await prisma.authUser.create({
        data:{
            email,
            password:hashPassword,
        }
    })

    delete user.password;
    return user;
}

const getAllUsers = async()=>{
    return prisma.authUser.findMany({
        select:{
            id:true,
            email:true,
            createdAt:true
        }
    })
}

const login = async(email, password)=>{
    
    const user = await prisma.authUser.findUnique({
        where:{email}
    })

    if(!user){
        throw new Error("Invalid Credentials")
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if(!isMatch){
        throw new Error("Invalid Credentials")
    }
    
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user)

    const refreshTokenHash = hashToken(refreshToken)

    await prisma.refreshToken.create({
        data:{
            userId: user.id,
            tokenHash: refreshTokenHash,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        }
    })

    const { password: _, ...safeUser } = user;

    return {safeUser, accessToken, refreshToken};
}

module.exports= {register, getAllUsers, login}