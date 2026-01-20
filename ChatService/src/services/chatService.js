const prisma = require("../config/prisma");
const redis = require("../config/redis")

//create private chat service
const getPrivateChatService = async (me, other) => {
    //if chat already exist
    let chat = await prisma.chat.findFirst({
        where: {
            type: "PRIVATE",
            AND: [{
                participants: {
                    some: { userId: me }
                }
            },
            {
                participants: {
                    some: { userId: other }
                }
            }
            ]
        }
    });

    //if chat not exist then create a chat
    if (!chat) {
        chat = await prisma.chat.create({
            data: {
                type: "PRIVATE",
                participants: {
                    create: [{ userId: me }, { userId: other }]
                }
            }
        });
    }
    return chat;
};

//get all chats
const getUserChatService = async (userId) => {
    return prisma.chat.findMany({
        where: {
            participants: {
                some: { userId }
            }
        },
        include: {
            participants: true,
            message: {
                take: 1,
                orderBy: { createdAt: "desc" } // last message
            }
        },
        orderBy: {
            createdAt: "desc"
        }
    })
}


//send message service
const sendMessageService = async ({ chatId, senderId, content }) => {
    const message = await prisma.message.create({
        data: {
            chatId,
            senderId,
            content,
            status: "SENT"
        }
    })

    return message
}

//get message service
const getMessageService = async ({ chatId, userId }) => {

    //Validate user belongs to chat
    const participant = await prisma.chatParticipant.findUnique({
        where: {
            chatId_userId: {
                chatId,
                userId
            }
        }
    });

    //if not belongs to chat
    if (!participant) {
        throw new Error("Access denied: Not a participant of this chat");
    }

    const message = await prisma.message.findMany({
        where: { chatId },
        orderBy: { createdAt: "asc" }
    })

    if (message.length === 0) {
        return []
    }

    const lastMessageId = message[message.length - 1].id;

    //update last message read id
    await prisma.chatParticipant.update({
        where: {
            chatId_userId: {
                chatId,
                userId
            }
        },
        data: {
            lastReadMessageId: lastMessageId
        }
    })

    //update message to seen
    await prisma.message.updateMany({
        where: {
            chatId,
            senderId: { not: userId },
            status: { not: "SEEN" }
        },
        data: {
            status: "SEEN"
        }
    })

    return message
}

//seen message service
const markSeenService = async ({ chatId, userId, lastSeenMessageId }) => {
    await prisma.$transaction([
        //update last message read id
        prisma.chatParticipant.update({
            where: {
                chatId_userId: {
                    chatId,
                    userId
                }
            },
            data: {
                lastReadMessageId: lastSeenMessageId
            }
        }),

        //update message to seen
        prisma.message.updateMany({
            where: {
                chatId,
                senderId: { not: userId },
                id: { lte: lastSeenMessageId },
                status: { not: "SEEN" }
            },
            data: {
                status: "SEEN"
            }
        })

    ])
}

module.exports = { getPrivateChatService, sendMessageService, getMessageService, markSeenService };