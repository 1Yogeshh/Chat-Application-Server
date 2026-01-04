const prisma = require("../prisma");

const getPrivateChatService = async (me, other) => {
  let chat = await prisma.chat.findFirst({
    where: {
      type: "PRIVATE",
      AND: [
        {
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

module.exports = getPrivateChatService;
