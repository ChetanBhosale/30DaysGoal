import { Router } from "express";
import {
  activationAccount,
  login,
  register,
  social,
} from "../controller/authentication";

const userRouter = Router();

userRouter.post("/register", register);
userRouter.post("/active-user", activationAccount);
userRouter.post("/login", login);
userRouter.post("/social", social);

export default userRouter;
