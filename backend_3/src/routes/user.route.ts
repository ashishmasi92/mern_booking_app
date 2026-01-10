import express from "express";
import {
  register,
  login,
  verifyToken,
  logout,
  me,
} from "../controllers/user.controller";
import { verifyUser } from "../middleware/verify";
let userRouter = express.Router();

userRouter.post("/register", register);
userRouter.post("/login", login);
userRouter.get("/validate-token", verifyUser, verifyToken);
userRouter.post("/logout", verifyUser, logout);
userRouter.get("/me", verifyUser, me);

export default userRouter;
