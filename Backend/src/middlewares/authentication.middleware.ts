import type { RequestHandler } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import "dotenv/config"

interface AuthTokenPayload extends JwtPayload{
  userId: string;
}

export const authentication: RequestHandler = async (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({
        error: "You have to log in first"
      });
    }

    const secret = process.env.JWT_SECRET;

    if(!secret){
        throw new Error("JWT_SECRET_IS_NOT_DEFINED")
    }

    const decoded = jwt.verify(token, secret);

    if (typeof decoded === "string" || typeof decoded.userId !== "string") {
      return res.status(401).json({
        error: "Invalid or expired token, please log in again"
      });
    }
    console.log(decoded);
    
    res.locals.userId = decoded.userId;
    next();
  } catch (err) {

    if(err instanceof Error && err.message === "JWT_SECRET_IS_NOT_DEFINED"){
      next(err);
      return;
    }
    res.status(401).json({
      error: "Invalid or expired token. Please log in again."
    });
  }
};

