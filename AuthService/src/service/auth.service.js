const prisma = require("../prisma")
const bcrypt = require("bcrypt")

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

    const { password: _, ...safeUser } = user;

    return safeUser;
}

module.exports= {register, getAllUsers, login}