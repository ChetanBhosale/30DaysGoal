import { Router } from "express";

import isAuthenticated from "../middleware/authentication";
import {
  PlanCreationPhase,
  provideQuestionsAnswer,
  setGoal,
} from "../controller/user.controller";
const infoRouter = Router();

infoRouter.post("/goal", isAuthenticated, setGoal);
infoRouter.post("/goal-answer", isAuthenticated, provideQuestionsAnswer);
infoRouter.get("/create-goal", isAuthenticated, PlanCreationPhase);

export default infoRouter;
