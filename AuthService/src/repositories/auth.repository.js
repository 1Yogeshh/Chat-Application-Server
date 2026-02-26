const prisma = require("../prisma")

const findUserByEmail = (email) => {
    return prisma.authUser.findUnique({
        where: { email }
    })
}

const createUser = (data) => {
    return prisma.authUser.create({ data })
}

const getAllUsers = () => {
    return prisma.authUser.findMany({
        select: {
            id: true,
            email: true,
            createdAt: true
        }
    })
}

const createRefreshToken = (data) => {
    return prisma.refreshToken.create({ data })
}

module.exports = {
    findUserByEmail,
    createUser,
    getAllUsers,
    createRefreshToken
}