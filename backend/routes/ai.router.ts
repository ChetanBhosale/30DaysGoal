import { Router } from "express";
import isAuthenticated from "../middleware/authentication";

import {
  askQuestions,
  chatWithDays,
  getPlan,
  getUserGoals,
  setUserGoal,
} from "../controller/ai.controller";
const aiRouter = Router();

aiRouter.post("/goal", isAuthenticated, setUserGoal);
aiRouter.get("/goal", isAuthenticated, getUserGoals);
aiRouter.post("/goal/chat-questions/:id", isAuthenticated, askQuestions);
aiRouter.get("/goal-plan/:id", isAuthenticated, getPlan);
aiRouter.post("/goal-plan/chat/:id", isAuthenticated, chatWithDays);

export default aiRouter;
