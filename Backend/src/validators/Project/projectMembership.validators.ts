import z, { string } from "zod";
import mongoose from "mongoose";

const objectIdSchema = z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: "Invalid ObjectId format",
});

export const projectRequestParamsSchema = z.object({
    params: z.object({
        projectId: objectIdSchema,
        requestId: objectIdSchema,
    }),
});

export const createOwner = z.object({
    projectId: z.string(),
    userId: z.string(),
    role: z.enum(["OWNER"]),
}).strict();


export const rejectValidator = z.object({
    params: z.object({
        requestId: objectIdSchema,
        userId: objectIdSchema,
    }),
});