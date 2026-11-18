import { z } from "zod";
import mongoose from "mongoose";

const objectIdSchema = z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: "Invalid ObjectId format",
});

// --- NEW: URL Parameter Validators ---
export const projectParamValidator = z.object({
    projectId: objectIdSchema,
});

export const taskParamValidator = z.object({
    projectId: objectIdSchema,
    taskId: objectIdSchema,
});
// -------------------------------------

export const createTaskValidator = z.object({
    title: z.string().trim().min(1, "Task title is required").max(150),
    description: z.string().trim().max(2000).optional(),
    assigneeId: objectIdSchema.optional(),
    status: z.enum(["TODO", "IN_PROGRESS", "IN_REVIEW", "DONE"]).default("TODO"),
    priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).default("MEDIUM"),
    // TS FIX: Ensure missing dates become null (which Mongoose allows) instead of undefined
    dueDate: z.coerce.date().optional().nullable().transform(val => val ? val : null),
});

export const updateTaskValidator = createTaskValidator
    .partial()
    .strict()
    .refine((data) => Object.keys(data).length > 0, {
        message: "At least one field is required for update",
    });

export const taskQueryValidator = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
    status: z.enum(["TODO", "IN_PROGRESS", "IN_REVIEW", "DONE"]).optional(),
    priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional(),
});