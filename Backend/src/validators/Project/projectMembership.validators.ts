import z, { string } from "zod";


export const addMember = z.object({
    projectId: z.string(),
    userId: z.string(),
    role: z.enum(["ADMIN","MEMBER"]),
}).strict();

export const createOwner = z.object({
    projectId: z.string(),
    userId: z.string(),
    role: z.enum(["OWNER"]),
}).strict();