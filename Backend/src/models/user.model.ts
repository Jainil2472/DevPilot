import mongoose, {Schema} from "mongoose";
import { lowercase } from "zod";
import { required } from "zod/mini";

const userSchema = new mongoose.Schema({
    // avatar:{
    //     type:{
    //         url: String,
    //         localPath: String,
    //     },
    //     default:{
    //         url: String,
    //         localPath: String,
    //     }
    // },
    username:{
        type: String,
        required: true,
        unique: true,
        trim: true,
        index: true,
    },
    email:{
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    password:{
        type: String,
        required: true,
        trim: true,
        select: false
    },
    emailVerificationAt:{
        type: Date,

    },
    isEmailVerified: {
        type: Boolean,
        default: false,
    },
    status: {
        type: String,
        enum: ["ACTIVE", "SUSPENDED", "DISABLED"],
        default: "ACTIVE"
    }

},{
    timestamps: true,
})


const verificationTokenSchema =new mongoose.Schema({
    userId:{
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true,

    },
    emailVerificationToken:{
        type: String,
    },
    emailVerificationExpiry:{
        type: Date,
        required: true,
        index:{ expires: 0},
    },

},{
    timestamps:true,
});


export const User = mongoose.model("user",userSchema);
export const verificationToken = mongoose.model("verificationToken",verificationTokenSchema);
