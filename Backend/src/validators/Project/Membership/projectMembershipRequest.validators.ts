import mongoose from "mongoose";
import z from "zod";




export const projectJoinRequestValidator = z.object({
    projectId: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
        message: "Invalid ObjectId format",
    }),
    role: z.enum(["ADMIN","MEMBER"]),
    message: z.string().optional(),
});
export const projectInvitationValidator = z.object({
    projectId: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
        message: "Invalid ObjectId format",
    }),
    userId: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
        message: "Invalid ObjectId format",
    }),
    role: z.enum(["ADMIN","MEMBER"]),
    message: z.string().optional(),
});

export const cancleValidator = z.object({
    requestId: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
        message: "Invalid ObjectId format",
    }),
})


export const requestQueryValidator = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
    status: z.enum(["PENDING", "ACCEPTED", "REJECTED", "CANCELLED"]).optional(),
});