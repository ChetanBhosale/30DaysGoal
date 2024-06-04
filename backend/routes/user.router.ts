import { Router } from "express";
import isAuthenticated from "../middleware/authentication";
import {
  active_user,
  register,
  login,
  me,
  logout,
} from "../controller/auth.controller";

const userRouter = Router();

userRouter.post("/register", register);
userRouter.post("/active-user", active_user);
userRouter.post("/login", login);
userRouter.get("/me", isAuthenticated, me);
userRouter.post("/logout", isAuthenticated, logout);

export default userRouter;
