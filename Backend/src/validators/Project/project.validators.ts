import {z } from 'zod'

export const createProjectValidator = z.object({
    name: z.string().trim().min(1).max(100),
    description: z.string().trim().min(1).max(2000),
    visibility: z.enum(["PUBLIC","PRIVATE"]),
    techStack: z.array(z.string().trim().min(1).max(50).nonempty()).max(20),
});

export const updateProjectValidator = createProjectValidator
.partial()
.strict()
.refine(data => Object.keys(data).length > 0, {
    message: "At least one field is required",
  });

export const paginationValidation = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
})