import type { RequestHandler } from "express";
import { signupService, loginService } from "../../services/Auth/auth.service.js";
import { signupValidator, loginValidator } from "../../validators/Auth/auth.validators.js";
import { emailVerificationService } from "../../services/Auth/emailVerification.service.js";
import { AppError } from "../../utils/AppError.js"; // Import AppError

export const signupController: RequestHandler = async (req, res, next) => {
    try {
        const validateData = signupValidator.parse(req.body);

        await signupService(validateData);
        
        return res.status(201).json({
            success: true,
            message: "Account created successfully. Please check email to verify your account."
        });
    } catch (error) {
        next(error); // Passes ZodError or service AppErrors to errorHandler
    }
};

export const emailVerificationController: RequestHandler = async (req, res, next) => {
    try {
        const token = req.query.token;
        
            if (typeof token !== "string" || !token) {
            throw new AppError(400, "Invalid or missing verification token.", "INVALID_TOKEN");
        }

        await emailVerificationService(token);
        
        return res.status(200).json({
            success: true,
            message: "Email is verified successfully."
        });
    } catch (error) {
        next(error); 
    }
};

export const loginController: RequestHandler = async (req, res, next) => {
    try {
        // .parse() handles validation throwing automatically
        const validateData = loginValidator.parse(req.body);
        
        const login = await loginService(validateData);
        
        res.cookie("token", login, {
            httpOnly: true,
            // secure: true, // Uncomment in production with HTTPS
            sameSite: "lax",
            maxAge: 24 * 60 * 60 * 1000
        });

        return res.status(200).json({
            success: true,
            message: "Logged in successfully",
            token: login
        });
    } catch (error) {
        next(error); // Passes login errors (like invalid credentials) to errorHandler
    }
};