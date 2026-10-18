import {z } from 'zod'

export const createProjectValidator = z.object({
    name: z.string().min(1).max(100),
    description: z.string(),
    userId: z.string(),
    visibility: z.string(),
    techStack: z.string()
})