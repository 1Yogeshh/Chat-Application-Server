const prisma = require("../prisma")

const findByAuthId = (authUserId) =>
    prisma.user.findUnique({ where: { authUserId } })

const findByUsername = (username) =>
    prisma.user.findUnique({ where: { username } })

const createUser = (data) =>
    prisma.user.create({ data })

const updateUser = (authUserId, data) =>
    prisma.user.update({
        where: { authUserId },
        data,
        select: {
            authUserId: true,
            name: true,
            username: true,
            email: true,
            isActive: true,
            updatedAt: true
        }
    })

const searchUsers = (where, skip, take) => {
    return prisma.user.findMany({
        where,
        select: {
            authUserId: true,
            name: true,
            email: true,
            isActive: true,
            avtar: true,
            username: true
        },
        skip,
        take
    })
}

module.exports = {
    findByAuthId,
    findByUsername,
    createUser,
    updateUser,
    searchUsers
}