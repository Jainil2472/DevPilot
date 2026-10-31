import {z } from 'zod'

export const createProjectValidator = z.object({
    name: z.string().trim().min(1).max(100),
    description: z.string(),
    visibility: z.enum(["PUBLIC","PRIVATE"]),
    techStack: z.array(z.string().nonempty()),
    userId: z.string(),
})

