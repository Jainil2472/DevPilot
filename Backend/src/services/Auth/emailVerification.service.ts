import {User,verificationToken} from '../../models/user.model.js'
import crypto from 'node:crypto';


export async function emailVerificationService(token:string ) {
    
    const emailToken = crypto.createHash('sha256').update(token).digest('hex')
    
    const verify = await verificationToken.findOne({
        emailVerificationToken: emailToken,
        emailVerificationExpiry: {$gt: new Date()},
    })
    
    // verify the token 
    if (!verify) {
        throw new Error("token is invalid"); 
    }

    
    // if user not found then we can not go further 
    const user = await User.findById(verify.userId);
    if(!user){
        throw new Error("User not found")
    }

    // check the email is already verified or not 
    if(user.isEmailVerified){
        await verificationToken.deleteOne({
            _id: verify._id
        })
        throw new Error("Email is already verified")
    }



    const upate_user = await User.updateOne(
        {_id: verify.userId, isEmailVerified: false},
        {$set:{isEmailVerified: true, emailVerificationAt: new Date()},
    });
    if (upate_user.matchedCount === 0) {
        throw new Error("USER_NOT_FOUND");
    }

    await verificationToken.deleteOne({ _id: verify._id });
  
    return {message:   `email is verified successfully `}
}

