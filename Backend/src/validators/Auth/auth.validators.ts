import {email, z} from 'zod'

export const signupValidator= z.object({
    username: z.string().min(2).max(50),
    email: z.string().email().transform((str)=> str.toLowerCase().trim()),
    password: z
    .string()
    .min(8,"password must be at least 8 characters ")
    .max(50)

}).strict();


export const loginValidator = z.object({
    email: z.string().email().transform((str)=> str.toLowerCase().trim()),
    password: z
    .string()
    .min(8,"password must be at least 8 characters ")
    .max(50)
}).strict();

export const resendEmailValidator = z.object({
    email: z.string().email().transform((str)=> str.toLowerCase().trim()),
})