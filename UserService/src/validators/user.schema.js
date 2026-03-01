const { z } = require("zod")

const createUserSchema = z.object({
    name: z.string().min(1).trim(),
    username: z.string()
        .min(3)
        .max(20)
        .regex(/^[a-zA-Z0-9_]+$/)
        .transform(val => val.toLowerCase())
})

const updateUserSchema = z.object({
    name: z.string().min(1).optional(),
    username: z.string()
        .min(3)
        .regex(/^[a-zA-Z0-9_]+$/)
        .transform(val => val.toLowerCase())
        .optional()
})

const searchUserSchema = z.object({
    q: z.string().min(1),
    page: z.coerce.number().min(1).optional(),
    limit: z.coerce.number().min(1).max(50).optional()
})

module.exports = {
    createUserSchema,
    updateUserSchema,
    searchUserSchema
}