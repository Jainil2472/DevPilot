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