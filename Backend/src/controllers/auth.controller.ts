import type { RequestHandler } from "express";
import { signupService, loginService } from "../services/Auth/auth.service.js";
import { signupValidator, loginValidator } from "../validators/Auth/auth.validators.js";
import { emailVerificationService } from "../services/Auth/emailVerification.service.js";

export  const signupController: RequestHandler=async (req,res,next)=>{
    try {
        const validateData = signupValidator.parse(req.body);

        await signupService(validateData);
        return res.status(201).json({
            message:"account created sucessfully please check email to verify your account"
        })
    } catch (error) {
        console.log("something went wrong in controller and service");
        next(error)
    }
}
export const emailVerificationController: RequestHandler = async(req,res,next)=>{

    try {
        const token = req.query.token;
        console.log(token);
        
        if(typeof token !== "string" || !token){
            return res.status(404).json({
                message: `invalid or missing token `
            })
        }
        await emailVerificationService(token);
        res.status(201).json({
            message: "email is verified successfully"
        })
        
    } catch (error) {
        next(error)
    }
}

export const loginController : RequestHandler =async (req, res, next)=>{

    try {
        const validateData = loginValidator.parse(req.body)
        const login = await loginService(validateData);
        res.cookie("token", login,{
            httpOnly: true,
            secure: true,
            sameSite: "none"
        })
        return res.status(200).json(
            {message: `login token is ${login}`   }
        )
    } catch (error) {
        next(error)
    }
}