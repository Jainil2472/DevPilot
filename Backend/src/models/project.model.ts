import mongoose, { Schema } from "mongoose";

const projectSchema = new mongoose.Schema({
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


    },
    deletedAt : {
        type: Date,
        default: null
    },
    
},{
    timestamps: true
});

projectSchema.index(
    {ownerId:1, name:1},
    {unique: true}
)
export const Project = mongoose.model("project",projectSchema);