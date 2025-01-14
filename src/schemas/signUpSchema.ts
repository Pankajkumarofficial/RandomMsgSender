import { z } from 'zod'

export const usernameValidation = z.string()
    .min(3, "Username must be atleast 3 characters")
    .max(20, "Username must be no more then 20 charcters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username must no contain special characters")


export const signUpSchema = z.object({
    username: usernameValidation,
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(6, { message: "Password mus be larger then 6 characters" })
})