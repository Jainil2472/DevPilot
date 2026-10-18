import mongoose, { Schema } from "mongoose";

const projectSchema =new mongoose.Schema({
    name:{
        type: String,
        required: true,
        trim: true,
    },
    description:{
        type: String,
        required: true,
        trim: true,
    },
    ownerId:{
        type: Schema.Types.ObjectId,
        ref:"user",
        required: true,
    },
    githubUrl:{
        type: String,
        trim: true,
    },
    visibility:{
        type: String,
        enum: ["PUBLIC","PRIVATE"],
        required: true,
        uppercase: true,
        default: "PUBLIC"
    },
    status:{
        type: String,
        enum: ["PLANNING","ACTIVE","COMPLETED"],
        required: true,
        uppercase: true,
        default: "PLANNING"
    },
    techStack:{
        type: [String],
        default: [],
        required: true,


    }
},{
    timestamps: true
});

export const Project = mongoose.model("project",projectSchema);