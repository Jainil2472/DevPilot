import type { ErrorRequestHandler } from "express";
import { AppError } from "../utils/AppError.js";
import z from "zod";



export const errorHandler: ErrorRequestHandler= (err,req,res,next) => {
    console.error(err);
    

    if(err instanceof AppError){
        return res
        .status(err.statusCode)
        .json({
            success: false,
            message: err.message,
            code: err.code
        });
    }
    if(err instanceof z.ZodError){
        return res
        .status(400)
        .json({
            success: false,
            message:"validation error"
        })
    }
    if(err.code === 11000){
        return res
        .status(409)
        .json({
            success: false,
            message: "A record with this value already exists.",
            code: "DUPLICATE_RECORD",
        })
    }
    if(err.name === "CastError"){
        return res.status(400).json({
            success: false,
            message: "Invalid ID or data format.",
            code: "INVALID_DATA",
        });
    }
    return res
        .status(500)
        .json({
            success: false,
            message: "Internal server error",
            
        });
}