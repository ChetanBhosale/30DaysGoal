import { Router } from "express";
import userRouter from "./user.router";
import aiRouter from "./ai.router";
const indexRouter = Router();

indexRouter.use(userRouter);
indexRouter.use(aiRouter);

export default indexRouter;
