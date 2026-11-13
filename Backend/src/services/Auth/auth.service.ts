import {User,verificationToken} from '../../models/user.model.js'
import bcrypt from 'bcrypt'
import {z} from 'zod';
import {signupValidator, loginValidator, resendEmailValidator} from '../../validators/Auth/auth.validators.js'
import crypto from 'node:crypto';
import { verificationMail } from './email.service.js';
import jwt from "jsonwebtoken";
import 'dotenv/config'
import { AppError } from '../../utils/AppError.js'; // Import AppError

export async function signupService(input: z.infer<typeof signupValidator>) {
    const {email, username, password} = input;
    
    const isUserExsist = await User.findOne({
        $or: [{email}, {username}]
    });
    
    if (isUserExsist) {
        throw new AppError(409, "An account with this email or username already exists.", "EMAIL_OR_USERNAME_IN_USE"); 
    }

    const encryptedPassword = await bcrypt.hash(password, 10);

    // Use Mongoose .create() instead of .insertOne()
    const addUser = await User.create({
        email,
        username,
        password: encryptedPassword
    });

    const randomToken = crypto.randomBytes(36).toString('hex');
    const emailToken = crypto.createHash('sha256').update(randomToken).digest('hex');
    const expiry = new Date(Date.now() + 1000 * 60 * 60);

    await verificationToken.create({
        userId: addUser._id,
        emailVerificationToken: emailToken,
        emailVerificationExpiry: expiry
    });
    
    const verificationLink = `http://localhost:8000/user/verification?token=${encodeURIComponent(randomToken)}`;

    try {
        await verificationMail(email, verificationLink);
    } catch (error) {
        throw new AppError(500, "Failed to send verification email. Please try again later.", "VERIFICATION_EMAIL_SEND_FAILED");
    }

    return addUser;
}

export async function loginService(input: z.infer<typeof loginValidator>) {
    const {email, password} = input;

    const isEmailExsist = await User.findOne({
        email,
        isEmailVerified: true,
    }).select("+password");

    if (!isEmailExsist) {
        throw new AppError(401, "Invalid email or password, or email is not verified.", "INVALID_CREDENTIALS");
    }
    
    const isPasswordCorrect = await bcrypt.compare(
        password,
        isEmailExsist.password
    );
    
    if (!isPasswordCorrect) {
        throw new AppError(401, "Invalid email or password.", "INVALID_CREDENTIALS");
    }

    // JWT creation 
    const payload = {
        userId: isEmailExsist._id.toString(),
    };
    
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
        throw new AppError(500, "JWT_SECRET is not configured on the server.", "INTERNAL_CONFIG_ERROR");
    }
    
    const jwtToken = jwt.sign(payload, JWT_SECRET, {algorithm: "HS256", expiresIn: '1d'});
        
    return jwtToken;
}

export async function resendEmailVerification(input: z.infer<typeof resendEmailValidator>) {
    const {email} = input;

    const isEmailExsist = await User.findOne({
        email,
        isEmailVerified: false,
    });
    
    if (!isEmailExsist) {
        throw new AppError(404, "No unverified account found with this email address.", "EMAIL_NOT_FOUND");
    }

    const randomToken = crypto.randomBytes(36).toString('hex');
    const emailToken = crypto.createHash('sha256').update(randomToken).digest('hex');
    const expiry = new Date(Date.now() + 1000 * 60 * 60);
    
    await verificationToken.updateOne(
        {
            userId: isEmailExsist._id,
        },
        {
            $set: {
                emailVerificationToken: emailToken,
                emailVerificationExpiry: expiry,
            }
        },
        {
            upsert: true,
            runValidators: true,
        }
    );
    
    const verificationLink = `http://localhost:8000/user/verification?token=${encodeURIComponent(randomToken)}`;

    try {
        await verificationMail(email, verificationLink);
    } catch (error) {
        throw new AppError(500, "Failed to send verification email.", "VERIFICATION_EMAIL_SEND_FAILED");
    }
}