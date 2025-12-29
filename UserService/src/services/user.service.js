const prisma = require("../prisma")

const createUserService = async({authUserId, email, name})=>{
    const existUser = await prisma.user.findUnique({
        where: { authUserId, email }
    })

    if(existUser){
        return{
            alreadyExits: true,
            user: existUser
        }
    }

    //create new user
    const user = await prisma.user.create({
        data: {
            authUserId,
            email,
            name: name.trim(),
            role: "USER",
            isActive: true
        }
    })

    return {
        alreadyExists: false,
        user
    };
}

module.exports = {createUserService}