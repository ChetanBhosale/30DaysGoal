import { Router } from "express";
import { goalInformation } from "../controller/user.controller";
const infoRouter = Router();

infoRouter.post("/goal", goalInformation);

export default infoRouter;
