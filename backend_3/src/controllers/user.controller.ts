import customResponse from "../utils/customResponse";
import User from "../models/user.model";
import type { Request, Response } from "express";
import "dotenv/config";
import { JwtPayload } from "jsonwebtoken";

export async function me(req: Request, res: Response) {

  let userId = req.userInfo as JwtPayload;

  try {
    let user = await User.findById(userId.id).select("-password");

    if (!user) {
      return customResponse(res, 400, false, "user not found");
    }

    return customResponse(res, 200, false, "get user successfully", user);
  } catch (error) {}
}



export async function register(req: Request, res: Response) {
  try {
    let { email, password, firstName, lastName } = req.body;

    if (
      [email, password, firstName, lastName].some((v) => {
        return v?.trim() == "";
      })
    ) {
      return customResponse(
        res,
        400,
        false,
        "please provide all field that required"
      );
    }

    if (password.length < 5) {
      return customResponse(
        res,
        400,
        false,
        "password length must be greater than 5"
      );
    }

    if (!email.includes("@")) {
      return customResponse(res, 400, false, "invalid email address");
    }

    let userExsit = await User.findOne({ email });

    if (userExsit) {
      return customResponse(res, 401, false, "user already exist");
    }

    let newUser = new User({ email, password, firstName, lastName });

    let save = await newUser.save();

    let token = save.accessToken();
    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 86400000,
    });

    if (!save) {
      return customResponse(res, 400, false, "save failed registered");
    }

    return customResponse(res, 201, true, "user registered successfully", save);
  } catch (error) {
    console.log("error Register", error);

    return customResponse(res, 500, false, "internal error", error);
  }
}

export async function login(req: Request, res: Response) {
  //   check user exist
  //  after that you should go with password match
  //
  try {
    let { email, password } = req.body;

    if (!email || !password) {
      return customResponse(res, 400, false, "credential must be required");
    }

    let user = await User.findOne({ email });

    if (!user) {
      return customResponse(res, 400, false, "user not exsit");
    }

    //  check password

    const isMatch = await user.isPasswordCorrect(password);
    // console.log(isMatch);

    if (!isMatch) {
      return customResponse(res, 400, false, "invalid credentials");
    }
    let token = user.accessToken();
    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 86400000,
    });

    return customResponse(res, 200, true, "user logged in successfully", user);
  } catch (error) {
    console.log("error login", error);
    return customResponse(res, 500, false, "internal error", error);
  }
}

export async function verifyToken(req: Request, res: Response) {
  try {
    let decoded = req.userInfo;
    // console.log(decoded);

    if (!decoded) {
      return customResponse(res, 401, false, "token invalid");
    }

    //  verify

    if (typeof decoded === "string" || !("id" in decoded)) {
      return customResponse(res, 401, false, "invalid token");
    }

    let user = await User.findById(decoded.id).select(
      "_id emil firstName lastName"
    );

    if (!user) {
      return customResponse(res, 401, false, "invalid token or expired");
    }

    return customResponse(res, 200, true, "user verify successfully", user);
  } catch (error) {
    console.log("verify error", error);
    return customResponse(res, 500, false, "internal error", error);
  }
}

export async function logout(req: Request, res: Response) {
  try {
    console.log("userInfo set", req.userInfo);
    res.clearCookie("auth_token");
    return customResponse(res, 200, true, "user logged out successfully");
  } catch (error) {
    console.log("error", error);
    return customResponse(res, 500, false, "internal error");
  }
}
