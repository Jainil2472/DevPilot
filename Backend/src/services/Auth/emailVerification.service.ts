import {User,verificationToken} from '../../models/user.model.js'
import crypto from 'node:crypto';
import { AppError } from '../../utils/AppError.js';

export async function emailVerificationService(token: string) {
    const emailToken = crypto.createHash('sha256').update(token).digest('hex');
    
    const verify = await verificationToken.findOne({
        emailVerificationToken: emailToken,
        emailVerificationExpiry: {$gt: new Date()},
    });
    
    if (!verify) {
        throw new AppError(400, "Verification token is invalid or has expired.", "INVALID_TOKEN"); 
    }

    const user = await User.findById(verify.userId);
    if (!user) {
        throw new AppError(404, "Associated user account not found.", "USER_NOT_FOUND");
    }

    if (user.isEmailVerified) {
        await verificationToken.deleteOne({
            _id: verify._id
        });
        throw new AppError(400, "Email is already verified.", "ALREADY_VERIFIED");
    }

    const update_user = await User.updateOne(
        {_id: verify.userId, isEmailVerified: false},
        {$set: {isEmailVerified: true, emailVerificationAt: new Date()}}
    );
    
    if (update_user.matchedCount === 0) {
        throw new AppError(404, "User could not be found or updated.", "USER_NOT_FOUND");
    }

    await verificationToken.deleteOne({ _id: verify._id });
  
    return { message: "Email is verified successfully" };
}