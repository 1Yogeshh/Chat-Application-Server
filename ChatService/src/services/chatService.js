const chatRepo = require("../repository/chat.repository")
const messageRepo = require("../repository/message.repository")

//create private chat service
const getPrivateChatService = async (me, other) => {
    let chat = await chatRepo.findPrivateChat(me, other)

    if (!chat) {
        chat = await chatRepo.createPrivateChat(me, other)
    }
    return chat;
};

//get all chats
const getUserChatService = async (userId) => {
    return chatRepo.findUserChats(userId)
}

const sendMessageService = async ({ chatId, senderId, content }) => {

    const [message] = await chatRepo.sendMessageTransaction(
        chatId,
        senderId,
        content
    )

    

    return message
}

// get message service (paginated)
const getMessageService = async ({ chatId, userId, cursor, limit = 20 }) => {

    const participant = await chatRepo.isParticipant(chatId, userId)

    if (!participant) {
        throw new Error("Access denied: Not a participant of this chat");
    }

    const messages = await messageRepo.findMessages(chatId, cursor, limit)

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
    if (!chatId || !userId || !lastSeenMessageId) {
        throw new Error("Invalid input")
    }

    await chatRepo.markSeenTransaction(
        chatId,
        userId,
        lastSeenMessageId
    )
}

module.exports = {
    getPrivateChatService,
    sendMessageService,
    getMessageService,
    markSeenService,
    getUserChatService
};