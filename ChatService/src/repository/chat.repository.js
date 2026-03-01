const prisma = require("../config/prisma")

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

const isParticipant = (chatId, userId) => {
    return prisma.chatParticipant.findUnique({
        where: {
            chatId_userId: { chatId, userId }
        }
    })
}

const sendMessageTransaction = (chatId, senderId, content) => {
    return prisma.$transaction([
        prisma.message.create({
            data: {
                chatId,
                senderId,
                content,
                status: "SENT"
            }
        }),
        prisma.chat.update({
            where: { id: chatId },
            data: {}
        })
    ])
}

const updateLastReadMessage = (chatId, userId, lastSeenMessageId) => {
    return prisma.chatParticipant.update({
        where: {
            chatId_userId: { chatId, userId }
        },
        data: {
            lastReadMessageId: lastSeenMessageId
        }
    })
}

const markMessagesSeen = (chatId, userId, lastSeenMessageId) => {
    return prisma.message.updateMany({
        where: {
            chatId,
            senderId: { not: userId },
            id: { lte: lastSeenMessageId },
            status: { not: "SEEN" }
        },
        data: { status: "SEEN" }
    })
}

const markSeenTransaction = async (chatId, userId, lastSeenMessageId) => {
    return prisma.$transaction([
        updateLastReadMessage(chatId, userId, lastSeenMessageId),
        markMessagesSeen(chatId, userId, lastSeenMessageId)
    ])
}

module.exports = {
    findPrivateChat,
    createPrivateChat,
    findUserChats,
    markSeenTransaction,
    isParticipant,
    sendMessageTransaction
}