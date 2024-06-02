import { Router } from "express";
import {
  activationAccount,
  login,
  logout,
  register,
  social,
} from "../controller/authentication";
import isAuthenticated from "../middleware/authentication";

const userRouter = Router();

userRouter.post("/register", register);
userRouter.post("/active-user", activationAccount);
userRouter.post("/login", login);
userRouter.get("/logout", isAuthenticated, logout);
userRouter.post("/social", social);

export default userRouter;
