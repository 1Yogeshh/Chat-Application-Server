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
                orderBy: { createdAt: "desc" }
            }
        },
        orderBy: {
            updatedAt: "desc"
        }
    })
}

const sendMessageService = async ({ chatId, senderId, content }) => {

    const [message] = await prisma.$transaction([

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

    return message
}

// get message service (paginated)
const getMessageService = async ({ chatId, userId, cursor, limit = 20 }) => {

    // 1️⃣ Validate user belongs to chat
    const participant = await prisma.chatParticipant.findUnique({
        where: {
            chatId_userId: {
                chatId,
                userId
            }
        }
    });

    if (!participant) {
        throw new Error("Access denied: Not a participant of this chat");
    }

    // 2️⃣ Fetch messages using cursor pagination
    const messages = await prisma.message.findMany({
        where: { chatId },
        take: limit,
        ...(cursor && {
            cursor: { id: cursor },
            skip: 1
        }),
        orderBy: {
            createdAt: "desc"
        }
    });

    // Reverse so frontend gets oldest → newest
    const orderedMessages = messages.reverse();


    return {
        messages: orderedMessages,
        nextCursor: orderedMessages.length > 0
            ? orderedMessages[0].id
            : null,
        hasMore: orderedMessages.length === limit
    };
};

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

module.exports = {
    getPrivateChatService,
    sendMessageService,
    getMessageService,
    markSeenService,
    getUserChatService
};