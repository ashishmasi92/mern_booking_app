import type { Request, Response, NextFunction } from "express";
import customResponse from "../utils/customResponse";
import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";
import "dotenv/config";

declare global {
  namespace Express {
    interface Request {
      userInfo: string | JwtPayload;
    }
  }
}

export async function verifyUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    let token = req.cookies["auth_token"] || null;

    let authHeader = req.header("Authorization");
    if (!token && authHeader) {
      if (authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
      }
    }

    if (!token) {
      return customResponse(res, 401, false, "forbidden, you are not allowed");
    }

    let decoded = jwt.verify(token, process.env.ACCESSTOKEN_SECRET as string);


    req.userInfo = decoded;
    next();
  } catch (error) {
    console.log("error unathorized ", error);
    return customResponse(res, 500, false, "internal error", error);
  }
}