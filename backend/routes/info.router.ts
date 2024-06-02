import { Router } from "express";

import isAuthenticated from "../middleware/authentication";
import {
  chatWithDays,
  getPlanAndChat,
  PlanCreationPhase,
  provideQuestionsAnswer,
  setGoal,
} from "../controller/user.controller";
const infoRouter = Router();

infoRouter.post("/goal", isAuthenticated, setGoal);
infoRouter.post("/goal-answer", isAuthenticated, provideQuestionsAnswer);
infoRouter.get("/create-goal", isAuthenticated, PlanCreationPhase);
infoRouter.post("/day-plan", isAuthenticated, chatWithDays);
infoRouter.get("/goal-chat", isAuthenticated, getPlanAndChat);

export default infoRouter;
