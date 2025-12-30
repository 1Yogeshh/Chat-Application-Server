const prisma = require("../prisma")

const createUserService = async({ authUserId, email, name }) => {
    const existUser = await prisma.user.findUnique({
        where: { authUserId }
    })

    if (existUser) {
        return {
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
        alreadyExits: false,
        user
    };
}

const getMyProfileService = async(authUserId) => {
    return prisma.user.findUnique({
        where: { authUserId }
    })
}

const updateUserService = async(authUserId, name)=>{
    return prisma.user.update({
        where:{authUserId},
        data :{name:name.trim()}
    })
}

module.exports = { createUserService, getMyProfileService, updateUserService }