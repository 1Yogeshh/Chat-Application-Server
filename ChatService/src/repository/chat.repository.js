const prisma = require("../../config/prisma")

const findPrivateChat = (me, other) => {
    return prisma.chat.findFirst({
        where: {
            type: "PRIVATE",
            AND: [
                { participants: { some: { userId: me } } },
                { participants: { some: { userId: other } } }
            ]
        }
    })
}

const createPrivateChat = (me, other) => {
    return prisma.chat.create({
        data: {
            type: "PRIVATE",
            participants: {
                create: [{ userId: me }, { userId: other }]
            }
        }
    })
}

const findUserChats = (userId) => {
    return prisma.chat.findMany({
        where: {
            participants: { some: { userId } }
        },
        include: {
            participants: true,
            message: {
                take: 1,
                orderBy: { createdAt: "desc" }
            }
        },
        orderBy: { updatedAt: "desc" }
    })
}

module.exports = {
    findPrivateChat,
    createPrivateChat,
    findUserChats
}