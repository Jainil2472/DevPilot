import type { RequestHandler } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import "dotenv/config"

interface AuthTokenPayload extends JwtPayload{
  userId: string;
}

function isAuthTokenPayload(value: string | JwtPayload): value is AuthTokenPayload{
  return (
    typeof value !== "string" && 
    typeof value.userId === "string" &&
    value.userId.length > 0
  );
}

export const authentication: RequestHandler =  (req, res, next) => {
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


    const decoded = jwt.verify(token, secret,{algorithms: ["HS256"]});

    if (!isAuthTokenPayload(decoded)) {
      return res.status(401).json({
        error: "Invalid authentication token",
      });
    }
    
    
    res.locals.userId = decoded.userId;
    return next();
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

