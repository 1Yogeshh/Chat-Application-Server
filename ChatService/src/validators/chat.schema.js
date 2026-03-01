const { z } = require("zod")

const privateChatSchema = z.object({
    otherUserId: z.string().min(1)
})

const getMessagesSchema = z.object({
    chatId: z.string().min(1),
    cursor: z.string().optional(),
    limit: z.coerce.number().min(1).max(50).optional()
})

module.exports = {
    privateChatSchema,
    getMessagesSchema,
}