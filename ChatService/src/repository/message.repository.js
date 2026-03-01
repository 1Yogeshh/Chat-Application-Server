const prisma = require("../config/prisma")

const createMessage = (data) => {
    return prisma.message.create({ data })
}

const updateChatTimestamp = (chatId) => {
    return prisma.chat.update({
        where: { id: chatId },
        data: {}
    })
}

const findMessages = (chatId, cursor, limit) => {
    return prisma.message.findMany({
        where: { chatId },
        take: limit,
        ...(cursor && {
            cursor: { id: cursor },
            skip: 1
        }),
        orderBy: { createdAt: "desc" }
    })
}

module.exports = {
    createMessage,
    updateChatTimestamp,
    findMessages
}