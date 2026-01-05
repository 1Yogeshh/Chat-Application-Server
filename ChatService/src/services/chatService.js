const prisma = require("../prisma");

//create private chat service
const getPrivateChatService = async(me, other) => {
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

const sendMessageService = async({chatId, senderId, content})=>{
    const message = await prisma.message.create({
        data:{
            chatId,
            senderId,
            content,
            status:"SENT"
        }
    })
    return message
}

module.exports = {getPrivateChatService, sendMessageService};