import mongoose, { Schema } from "mongoose";

const projectRequestSchema = new mongoose.Schema({
    projectId: {
        type: Schema.Types.ObjectId,
        ref: "project", 
        required: true,
    },
    requesterId: {
        type: Schema.Types.ObjectId,
        ref: "user", 
        required: true,
    },
    initiatedBy: {
        type: Schema.Types.ObjectId,
        ref: "user", 
        required: true,
    },
    role:{
        type: String,
        enum: ["ADMIN", "MEMBER"],
        required: true,
        uppercase: true,
        default: "MEMBER",
    },
    type: {
            type: String,
            enum: ["JOIN_REQUEST", "INVITATION"],
            required: true,
        },
    status: {
        type: String,
        enum: ["PENDING", "ACCEPTED", "REJECTED", "CANCELLED"],
        required: true,
        uppercase: true,
        default: "PENDING",
    },
    message: {
        type: String,
        trim: true,
    }
}, {
    timestamps: true 
});

projectRequestSchema.index(
    {
        projectId: 1, requesterId: 1
    },
    {
        unique: true,
        partialFilterExpression:{
            status: "PENDING",
        }
    }
)


export const ProjectJoinRequest = mongoose.model("projectJoinRequest", projectRequestSchema);
