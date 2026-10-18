import mongoose, { Schema } from "mongoose";

const projectMembershipSchema = new Schema(
    {
        projectId: {
            type: Schema.Types.ObjectId,
            ref: "project",
            required: true,
        },

        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        role: {
            type: String,
            enum: ["OWNER", "ADMIN", "MEMBER"],
            default: "MEMBER",
            uppercase: true,
            required: true,
        },

        status: {
            type: String,
            enum: ["ACTIVE", "LEFT", "REMOVED"],
            default: "ACTIVE",
            uppercase: true,
            required: true,
        },

        joinedAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

projectMembershipSchema.index(
    { projectId: 1, userId: 1 },
    { unique: true }
);

export const ProjectMembership = mongoose.model(
    "ProjectMembership",
    projectMembershipSchema
);