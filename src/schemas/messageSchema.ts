import { z } from 'zod'

export const messageSchema = z.object({
    code: z.string()
        .min(10, { message: "Content must be contain 10 charcters" })
        .max(300, { message: "Content must be not larger then 300 charcters" })
})