const prisma = require("../prisma");

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

const getMessageService = async ({ chatId, userId }) => {

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

    const message = await prisma.message.findMany({
        where: { chatId },
        orderBy: { createdAt: "asc" }
    })

    if (message.length === 0) {
        return []
    }

    const lastMessageId = message[message.length - 1].id;

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

module.exports = { getPrivateChatService, sendMessageService, getMessageService };