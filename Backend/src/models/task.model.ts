import mongoose, { Schema } from "mongoose";

const taskSchema = new mongoose.Schema({
    projectId: {
        type: Schema.Types.ObjectId,
        ref: "project",
        required: true,
    },
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "user", 
        required: true,
    },
    assigneeId: {
        type: Schema.Types.ObjectId,
        ref: "user", 
    },
    status: {
        type: String,
        enum: ["TODO", "IN_PROGRESS", "IN_REVIEW", "DONE"],
        required: true,
        uppercase: true,
        default: "TODO",
    },
    priority: {
        type: String,
        enum: ["LOW", "MEDIUM", "HIGH", "URGENT"],
        required: true,
        uppercase: true,
        default: "MEDIUM",
    },
    dueDate: {
        type: Date,
    }
}, {
    timestamps: true 
});

export const Task = mongoose.model("task", taskSchema);
